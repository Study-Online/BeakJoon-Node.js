const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const input = [];
rl.on('line', (line) => {
    input.push(line.trim());
}).on('close', () => {
    main(input);
});
let N, V, num;
let graph, parent, CNF, visit;
let stack;
function main(input) {
    let idx = 0;
    while (idx < input.length) {
        const [NValue, M] = input[idx++].split(' ').map(Number);
        N = NValue;
        parent = new Array(2 * N + 1).fill(0);
        visit = new Array(2 * N + 1).fill(false);
        stack = [];
        num = 0;
        V = 0;
        CNF = new Array(2 * N + 1).fill(0);
        graph = Array.from({ length: 2 * N + 1 }, () => []);
        graph[validate(-1)].push(1);
        for (let i = 0; i < M; i++) {
            const [u, v] = input[idx++].split(' ').map(Number);
            graph[validate(-u)].push(validate(v));
            graph[validate(-v)].push(validate(u));
        }

        for (let i = 1; i < 2 * N + 1; i++) {
            if (!visit[i]) {
                SCC(i);
            }
        }
        process.stdout.write(printResult());
    }
}
function validate(n) {
    return (0 < n && n < N + 1) ? n : -n + N;
}
function printResult() {
    for (let i = 1; i < N + 1; i++) {
        if (CNF[i] === CNF[i + N]) return "no\n";
    }
    return "yes\n";
}
function SCC(idx) {
    parent[idx] = ++num;
    stack.push(idx);
    let root = parent[idx];
    for (const next of graph[idx]) {
        if (parent[next] === 0) {
            root = Math.min(root, SCC(next));
        } else if (!visit[next]) {
            root = Math.min(root, parent[next]);
        }
    }
    if (root === parent[idx]) {
        while (stack.length) {
            const top = stack.pop();
            CNF[top] = V;
            visit[top] = true;
            if (top === idx) break;
        }
        V++;
    }
    return root;
}