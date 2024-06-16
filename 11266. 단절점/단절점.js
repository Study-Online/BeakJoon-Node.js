const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let inputLines = [];
let currentLine = 0;

// Đọc toàn bộ dữ liệu đầu vào
rl.on('line', (input) => {
    inputLines.push(input);
});

rl.on('close', () => {
    const [v, e] = inputLines[currentLine++].split(' ').map(Number);
    let list = Array.from({ length: v + 1 }, () => []);
    let isCutVertex = new Array(v + 1).fill(false);
    let discovered = new Array(v + 1).fill(-1);
    let counter = 0;

    // Đọc các cạnh của đồ thị
    for (let i = 0; i < e; i++) {
        const [a, b] = inputLines[currentLine++].split(' ').map(Number);
        list[a].push(b);
        list[b].push(a);
    }

    // Tìm các điểm cắt
    function findCutVertex(cur, isRoot) {
        discovered[cur] = counter++;
        let ret = discovered[cur];
        let child = 0;
        for (let nxt of list[cur]) {
            if (discovered[nxt] === -1) {
                child++;
                let subTree = findCutVertex(nxt, false);

                if (!isRoot && subTree >= discovered[cur]) {
                    isCutVertex[cur] = true;
                }
                ret = Math.min(ret, subTree);
            } else {
                ret = Math.min(ret, discovered[nxt]);
            }
        }
        if (isRoot) {
            isCutVertex[cur] = child >= 2;
        }

        return ret;
    }
    for (let i = 1; i <= v; i++) {
        if (discovered[i] === -1) {
            findCutVertex(i, true);
        }
    }
    let cnt = 0;
    let result = [];
    for (let i = 1; i <= v; i++) {
        if (isCutVertex[i]) {
            cnt++;
            result.push(i);
        }
    }
    console.log(cnt);
    if (cnt > 0) {
        console.log(result.join(' '));
    }
});