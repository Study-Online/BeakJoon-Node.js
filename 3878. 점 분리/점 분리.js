const readline = require('readline');

// Utility function to compute ccw (counter-clockwise)
const ccw = (a, b, c) => {
    let res = a.x * b.y + b.x * c.y + c.x * a.y;
    res -= b.x * a.y + c.x * b.y + a.x * c.y;
    if (res > 0) return 1;
    if (res < 0) return -1;
    return 0;
};

// Utility function to compute the squared distance between two points
const dist = (a, b) => {
    let dx = a.x - b.x;
    let dy = a.y - b.y;
    return dx * dx + dy * dy;
};

// Function to compute the convex hull using Graham's scan
const getHull = (v) => {
    v.sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
    const start = v[0];
    v.sort((a, b) => {
        const cw = ccw(start, a, b);
        if (cw !== 0) return -cw;
        return dist(start, a) - dist(start, b);
    });
    const hull = [];
    for (let i of v) {
        while (hull.length >= 2 && ccw(hull[hull.length - 2], hull[hull.length - 1], i) <= 0) {
            hull.pop();
        }
        hull.push(i);
    }
    return hull;
};

// Function to check if a point is inside a polygon using ray-casting algorithm
const chk = (now, v) => {
    let cnt = 0;
    for (let i = 0; i < v.length; i++) {
        let j = (i + 1) % v.length;
        const [ii, jj] = [v[i], v[j]];
        if ((ii.y > now.y) !== (jj.y > now.y)) {
            const X = (jj.x - ii.x) * (now.y - ii.y) / (jj.y - ii.y) + ii.x;
            if (now.x < X) cnt++;
        }
    }
    return cnt % 2 > 0;
};

// Helper function to check if two segments are disjoint
const disjoint = (a, b, c, d) => {
    if (a > b) [a, b] = [b, a];
    if (c > d) [c, d] = [d, c];
    return b < c || d < a;
};

// Function to check if two segments crash (intersect)
const crash = (a, b, c, d) => {
    const ab = ccw(a, b, c) * ccw(a, b, d);
    const cd = ccw(c, d, a) * ccw(c, d, b);
    if (ab === 0 && cd === 0) {
        return !disjoint(a.x, b.x, c.x, d.x) && !disjoint(a.y, b.y, c.y, d.y);
    }
    return ab <= 0 && cd <= 0;
};

// Main function to process each test case
const solve = (input) => {
    let idx = 0;
    const t = parseInt(input[idx++]);
    const results = [];

    for (let ti = 0; ti < t; ti++) {
        const [n, m] = input[idx++].split(' ').map(Number);
        const a = [];
        const b = [];

        for (let i = 0; i < n; i++) {
            const [x, y] = input[idx++].split(' ').map(Number);
            a.push({ x, y });
        }

        for (let i = 0; i < m; i++) {
            const [x, y] = input[idx++].split(' ').map(Number);
            b.push({ x, y });
        }

        const aHull = getHull(a);
        const bHull = getHull(b);

        let ans = 0;

        if (chk(aHull[0], bHull) || chk(bHull[0], aHull)) ans = 1;

        for (let i of aHull) if (chk(i, bHull)) ans = 1;
        for (let i of bHull) if (chk(i, aHull)) ans = 1;

        const nHull = aHull.length;
        const mHull = bHull.length;
        for (let i = 0; i < nHull; i++) {
            for (let j = 0; j < mHull; j++) {
                if (crash(aHull[i], aHull[(i + 1) % nHull], bHull[j], bHull[(j + 1) % mHull])) ans = 1;
            }
        }

        results.push(ans ? "NO" : "YES");
    }

    return results;
};

// Read input and run the solution
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const readInputLines = async () => {
    const lines = [];
    for await (const line of rl) {
        lines.push(line);
    }
    return lines;
};

const main = async () => {
    const input = await readInputLines();
    const results = solve(input);
    results.forEach(result => console.log(result));
    rl.close();
};

main();