const readline = require('readline');
const { exit } = require('process');

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

const MAX = Number.MAX_SAFE_INTEGER;

let N, M;
let edge_dict = [];

function cvt(a) {
    if (a < 0) {
        return -a - 1 + N;
    } else {
        return a - 1;
    }
}

function neg(a) {
    return (a + N) % (2 * N);
}

function solve(input) {
    [N, M] = input[0].split(' ').map(Number);

    edge_dict = Array.from({ length: 2 * N }, () => []);

    for (let i = 1; i <= M; i++) {
        let [a, b] = input[i].split(' ').map(Number);
        a = cvt(a);
        b = cvt(b);
        edge_dict[neg(a)].push(b);
        edge_dict[neg(b)].push(a);
    }

    let visited = Array(2 * N).fill(MAX);
    let finished = Array(2 * N).fill(false);
    let stk = [];
    let scc_result = Array(2 * N).fill(-1);
    let idx = 0, scc_idx = 0;

    function scc(node) {
        let result = visited[node] = idx++;
        stk.push(node);

        for (const nxt of edge_dict[node]) {
            if (finished[nxt]) {
                continue;
            }
            if (visited[nxt] < MAX) {
                result = Math.min(result, visited[nxt]);
                continue;
            }
            result = Math.min(result, scc(nxt));
        }

        if (result === visited[node]) {
            while (true) {
                const n = stk.pop();
                finished[n] = true;
                scc_result[n] = scc_idx;
                if (n === node) break;
            }
            scc_idx++;
        }
        return result;
    }

    for (let i = 0; i < 2 * N; i++) {
        if (!finished[i]) {
            scc(i);
        }
    }

    let result = Array(N).fill(0);
    for (let i = 0; i < N; i++) {
        if (scc_result[i] === scc_result[neg(i)]) {
            console.log(0);
            return;
        }
        if (scc_result[i] < scc_result[neg(i)]) {
            result[i] = 1;
        }
    }
    console.log(1);
    console.log(result.join(' '));
}