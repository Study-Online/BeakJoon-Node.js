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

// Helper function to check relative orientation
const chk = (s, e, ss, ee) => {
    const t = { x: e.x - s.x, y: e.y - s.y };
    const tt = { x: ee.x - ss.x, y: ee.y - ss.y };
    return ccw({ x: 0, y: 0 }, t, tt) >= 0;
};

// Function to compute the convex hull and the most distant pair of points
const rot = (v) => {
    // Sort the points based on their position and angle with respect to the first point
    const hull = [];
    const minPoint = v.reduce((min, point) => {
        return (point.y < min.y || (point.y === min.y && point.x < min.x)) ? point : min;
    }, v[0]);
    v.sort((a, b) => {
        const cw = ccw(minPoint, a, b);
        if (cw !== 0) return cw > 0 ? -1 : 1;
        return dist(minPoint, a) - dist(minPoint, b);
    });

    // Graham's scan to build the convex hull
    for (let i of v) {
        while (hull.length >= 2 && ccw(hull[hull.length - 2], hull[hull.length - 1], i) <= 0) {
            hull.pop();
        }
        hull.push(i);
    }

    let ret = 0;
    let pt = 0;
    let xx = { x: 0, y: 0 };
    let yy = { x: 0, y: 0 };
    for (let i = 0; i < hull.length; i++) {
        while (pt + 1 < hull.length && chk(hull[i], hull[(i + 1) % hull.length], hull[pt], hull[(pt + 1) % hull.length])) {
            const now = dist(hull[i], hull[pt]);
            if (now > ret) {
                ret = now;
                xx = hull[i];
                yy = hull[pt];
            }
            pt++;
        }
        const now = dist(hull[i], hull[pt]);
        if (now > ret) {
            ret = now;
            xx = hull[i];
            yy = hull[pt];
        }
    }
    return { xx, yy };
};

// Function to solve each test case
const solve = (input) => {
    let index = 0;
    const t = parseInt(input[index++]);
    const results = [];

    for (let caseIndex = 0; caseIndex < t; caseIndex++) {
        const n = parseInt(input[index++]);
        const v = [];
        for (let i = 0; i < n; i++) {
            const [x, y] = input[index++].split(' ').map(Number);
            v.push({ x, y });
        }
        const { xx, yy } = rot(v);
        results.push(`${xx.x} ${xx.y} ${yy.x} ${yy.y}`);
    }

    return results;
};

// Main function to handle input and output
const main = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const input = [];
    for await (const line of rl) {
        input.push(line);
    }
    rl.close();

    const results = solve(input);
    results.forEach(result => console.log(result));
};

main();