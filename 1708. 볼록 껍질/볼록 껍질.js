const readline = require('readline');

// Khởi tạo giao diện nhập liệu từ người dùng
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let point = [];
let N;
let sortList = [];

function Cross(x1, y1, x2, y2) {
    return BigInt(x1) * BigInt(y2) - BigInt(x2) * BigInt(y1);
}

function CCW(p1, p2, p3) {
    let x1 = point[p2][0] - point[p1][0];
    let x2 = point[p3][0] - point[p1][0];
    let y1 = point[p2][1] - point[p1][1];
    let y2 = point[p3][1] - point[p1][1];
    return Cross(x1, y1, x2, y2);
}

function dist(x1, y1, x2, y2) {
    let x = BigInt(x2) - BigInt(x1);
    let y = BigInt(y2) - BigInt(y1);
    return Math.sqrt(Number(x * x + y * y));
}

function compare(a, b) {
    let x1 = point[a][0];
    let y1 = point[a][1];
    let x2 = point[b][0];
    let y2 = point[b][1];

    if (y1 === y2) {
        return x1 - x2;
    } else {
        return y1 - y2;
    }
}

function compare2(a, b) {
    let x0 = point[sortList[0]][0];
    let y0 = point[sortList[0]][1];
    let x1 = point[a][0];
    let y1 = point[a][1];
    let x2 = point[b][0];
    let y2 = point[b][1];

    let ccw = CCW(sortList[0], a, b);
    if (ccw === 0n) {
        return dist(x0, y0, x1, y1) - dist(x0, y0, x2, y2);
    }
    return ccw > 0n ? -1 : 1;
}

function convexHull(input) {
    N = parseInt(input[0]);
    point = input.slice(1, N + 1).map(line => line.split(' ').map(Number));
    
    let minY = 1000000;
    let minX = 1000000;
    let minYIndex = 0;
    
    for (let i = 0; i < N; i++) {
        let x = point[i][0];
        let y = point[i][1];
        if (y < minY || (y === minY && x < minX)) {
            minY = y;
            minX = x;
            minYIndex = i;
        }
    }
    
    sortList.push(minYIndex);
    for (let i = 0; i < N; i++) {
        if (i !== minYIndex) sortList.push(i);
    }
    
    sortList.sort(compare);
    sortList = [sortList[0], ...sortList.slice(1).sort(compare2)];
    
    for (let index = 0; index < sortList.length; index++) {
        let prev = (index - 1 + sortList.length) % sortList.length;
        let next = (index + 1) % sortList.length;
        let ccw = CCW(sortList[prev], sortList[index], sortList[next]);

        if (ccw <= 0n) {
            sortList.splice(index, 1);
            index -= 2;
            if (index < -1) index = -1;
        }
    }
    
    console.log(sortList.length);
}
let input = [];
rl.on('line', function(line) {
    input.push(line);
}).on('close', function() {
    convexHull(input);
});