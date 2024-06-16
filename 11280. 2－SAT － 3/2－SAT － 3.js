const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = [];

rl.on('line', (line) => {
    input.push(line.trim());
}).on('close', () => {
    solve(input);
});

let N, M;
let id = 0, sccNum = 0;
let Path = [];
let scc_id = [];
let scc_finished = [];
let sn = [];
let scc_stack = [];

function Not(a) {
    return (N < a ? a - N : a + N);
}

function dfs(c) {
    scc_id[c] = ++id;
    scc_stack.push(c);
    let res = scc_id[c];
    for (let next of Path[c]) {
        if (scc_id[next] === 0) {
            res = Math.min(res, dfs(next));
        } else if (!scc_finished[next]) {
            res = Math.min(res, scc_id[next]);
        }
    }
    if (res === scc_id[c]) {
        while (true) {
            let t = scc_stack.pop();
            scc_finished[t] = 1;
            sn[t] = sccNum;
            if (t === c) break;
        }
        sccNum++;
    }
    return res;
}

function Check() {
    for (let i = 1; i <= N; i++) {
        if (sn[i] === sn[i + N]) return 0;
    }
    return 1;
}

function solve(input) {
    [N, M] = input[0].split(' ').map(Number);
    Path = Array.from({ length: 2 * N + 1 }, () => []);
    scc_id = new Array(2 * N + 1).fill(0);
    scc_finished = new Array(2 * N + 1).fill(0);
    sn = new Array(2 * N + 1).fill(0);

    for (let i = 1; i <= M; i++) {
        let [a, b] = input[i].split(' ').map(Number);
        if (a < 0) a = -a + N;
        if (b < 0) b = -b + N;
        Path[Not(a)].push(b);
        Path[Not(b)].push(a);
    }

    for (let i = 1; i <= 2 * N; i++) {
        if (scc_id[i] === 0) dfs(i);
    }

    if (Check()) {
        console.log(1);
    } else {
        console.log(0);
    }
}