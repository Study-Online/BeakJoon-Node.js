const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const INF = 987654321;
const INF2 = 2147483647;

let g = [];
let capacity = [];
let parent = [];
let n, m;

const dfs = (here) => {
    for (let there of g[here]) {
        if (capacity[there]) continue;
        capacity[there] = true;
        if (parent[there] === -1 || dfs(parent[there])) {
            parent[there] = here;
            return true;
        }
    }
    return false;
};

const bipartite = () => {
    parent = Array(mxn).fill(-1);
    let ret = 0;
    for (let i = 0; i < n; i++) {
        capacity = Array(mxn).fill(false);
        ret += dfs(i) ? 1 : 0;
    }
    return ret;
};

const mxn = 1000;

const processInput = (input) => {
    let lines = input.trim().split('\n');
    let T = parseInt(lines[0]);
    let lineIndex = 1;

    let results = [];

    for (let t = 0; t < T; t++) {
        [n, m] = lines[lineIndex++].split(' ').map(Number);
        g = Array.from({ length: n }, () => []);

        for (let i = 0; i < m; i++) {
            let [u, v] = lines[lineIndex++].split(' ').map(Number);
            g[u].push(v);
        }

        results.push(bipartite());
    }

    results.forEach(result => console.log(result));
};

let input = '';

rl.on('line', (line) => {
    input += line + '\n';
}).on('close', () => {
    processInput(input);
    process.exit(0);
});