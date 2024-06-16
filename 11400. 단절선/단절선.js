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

let V, E;
let order = 1;
let discover;
let list;
let cutEdge = [];

function solve(input) {
    [V, E] = input[0].split(' ').map(Number);
    list = Array.from({ length: V + 1 }, () => []);
    discover = Array(V + 1).fill(0);
    for (let i = 1; i <= E; i++) {
        const [u, v] = input[i].split(' ').map(Number);
        list[u].push(v);
        list[v].push(u);
    }

    for (let i = 1; i <= V; i++) {
        if (discover[i] === 0) dfs(i, 0);
    }
    
    cutEdge.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    let output = `${cutEdge.length}\n`;
    for (const edge of cutEdge) {
        output += `${edge[0]} ${edge[1]}\n`;
    }
    process.stdout.write(output);
}

function dfs(cur, parent) {
    discover[cur] = order++;
    let ret = discover[cur];
    for (const next of list[cur]) {
        if (next === parent) continue;
        if (discover[next] === 0) {
            const prev = dfs(next, cur);
            if (prev > discover[cur]) {
                cutEdge.push([Math.min(cur, next), Math.max(cur, next)]);
            }
            ret = Math.min(ret, prev);
        } else {
            ret = Math.min(ret, discover[next]);
        }
    }
    return ret;
}