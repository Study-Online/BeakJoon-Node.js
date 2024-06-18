const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const inf = 1e9;
let arr = Array.from(Array(111), () => Array(111).fill(''));
let graph = Array.from(Array(23232), () => []);
let parent = Array(23232).fill(-1);
let capacity = new Map();
let flow = new Map();
let source = -1, sink = -1;
let startI, startJ, endI, endJ;
let n, m;
function addEdge(start, end, cap) {
    graph[start].push(end);
    capacity.set(`${start},${end}`, cap);
    graph[end].push(start);
    capacity.set(`${end},${start}`, 0);
}

function maxFlow() {
    let totalFlow = 0;
    while (true) {
        parent.fill(-1);
        let queue = [];
        queue.push(source);

        // BFS tìm đường đi từ source đến sink
        while (queue.length) {
            let current = queue.shift();
            for (let next of graph[current]) {
                if (parent[next] === -1 && (capacity.get(`${current},${next}`) - (flow.get(`${current},${next}`) || 0)) > 0) {
                    queue.push(next);
                    parent[next] = current;
                }
            }
        }

        if (parent[sink] === -1) break; // Không còn đường đi từ source đến sink

        // Cập nhật dòng chảy cho đường đi tìm được
        for (let i = sink; i !== source; i = parent[i]) {
            let a = parent[i], b = i;
            flow.set(`${a},${b}`, (flow.get(`${a},${b}`) || 0) + 1);
            flow.set(`${b},${a}`, (flow.get(`${b},${a}`) || 0) - 1);
        }
        totalFlow++;
    }
    return totalFlow;
}

function main() {
    rl.question('', (line) => {
        [n, m] = line.split(' ').map(Number);
        let pv = 0;
        let inputLines = [];
        let lineCount = 0;
        rl.on('line', (line) => {
            inputLines.push(line);
            lineCount++;
            if (lineCount === n) {
                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < m; j++) {
                        arr[i][j] = inputLines[i][j];
                        if (arr[i][j] === 'K') {
                            source = pv + 1;
                            startI = i;
                            startJ = j;
                        }
                        if (arr[i][j] === 'H') {
                            sink = pv;
                            endI = i;
                            endJ = j;
                        }
                        pv += 2;
                    }
                }

                if (n === 1 && m === 1) {
                    console.log(-1);
                    process.exit(0);
                }
                if (Math.abs(startI - endI) + Math.abs(startJ - endJ) === 1 || source === -1 || sink === -1) {
                    console.log(-1);
                    process.exit(0);
                }

                for (let i = 0; i < n * m; i++) {
                    addEdge(2 * i, 2 * i + 1, 1);
                }

                pv = 0;
                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < m; j++) {
                        if (i + 1 < n && arr[i][j] !== '#' && arr[i + 1][j] !== '#') {
                            let next = pv + 2 * m;
                            addEdge(pv + 1, next, inf);
                            addEdge(next + 1, pv, inf);
                        }
                        if (j + 1 < m && arr[i][j] !== '#' && arr[i][j + 1] !== '#') {
                            let next = pv + 2;
                            addEdge(pv + 1, next, inf);
                            addEdge(next + 1, pv, inf);
                        }
                        pv += 2;
                    }
                }
                console.log(maxFlow());
                process.exit(0);
            }
        });
    });
}
main();