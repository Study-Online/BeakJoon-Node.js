const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let n;
let tree;

const sum = (idx) => {
    let res = 0;
    while (idx > 0) {
        res += tree[idx];
        idx &= (idx - 1);
    }
    return res;
};

const update = (idx) => {
    while (idx <= n) {
        tree[idx] += 1;
        idx += (idx & -idx);
    }
};

const input = [];

rl.on('line', (line) => {
    input.push(line.trim());
    if (input.length === 3) {
        rl.close();
    }
});

rl.on('close', () => {
    n = parseInt(input[0]);

    const first = new Map();
    const second = new Map();

    let st = input[1].split(' ').map(Number);
    for (let i = 1; i <= n; i++) {
        first.set(st[i - 1], i);
    }

    st = input[2].split(' ').map(Number);
    for (let i = 1; i <= n; i++) {
        second.set(first.get(st[i - 1]), i);
    }

    tree = Array(n + 1).fill(0);
    let answer = 0;
    for (const [key, num] of [...second.entries()].sort((a, b) => a[0] - b[0])) {
        update(num);
        answer += (key - sum(num));
    }
    console.log(answer);
});