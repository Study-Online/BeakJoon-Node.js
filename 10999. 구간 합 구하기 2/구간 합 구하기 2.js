const fs = require('fs');

// Reading input from stdin
const input = fs.readFileSync('/dev/stdin').toString().trim().split('\n');

let index = 0;
const [n, m, k] = input[index++].split(' ').map(Number);

const elements = new Array(n);
for (let i = 0; i < n; i++) {
    elements[i] = BigInt(input[index++]);
}

const tree = new Array(n * 4).fill(BigInt(0));
const lazy = new Array(n * 4).fill(BigInt(0));

function init(start, end, node) {
    if (start === end) {
        return tree[node] = elements[start];
    }
    const mid = Math.floor((start + end) / 2);
    return tree[node] = init(start, mid, node * 2) + init(mid + 1, end, node * 2 + 1);
}

function propagate(start, end, node) {
    if (lazy[node] !== BigInt(0)) {
        if (start !== end) {
            lazy[node * 2] += lazy[node];
            lazy[node * 2 + 1] += lazy[node];
        }
        tree[node] += lazy[node] * BigInt(end - start + 1);
        lazy[node] = BigInt(0);
    }
}

function update(start, end, node, left, right, dif) {
    propagate(start, end, node);
    if (end < left || right < start) return;
    if (left <= start && end <= right) {
        lazy[node] += dif;
        propagate(start, end, node);
        return;
    }
    const mid = Math.floor((start + end) / 2);
    update(start, mid, node * 2, left, right, dif);
    update(mid + 1, end, node * 2 + 1, left, right, dif);
    tree[node] = tree[node * 2] + tree[node * 2 + 1];
}

function pSum(start, end, node, left, right) {
    propagate(start, end, node);
    if (end < left || right < start) return BigInt(0);
    if (left <= start && end <= right) return tree[node];
    const mid = Math.floor((start + end) / 2);
    return pSum(start, mid, node * 2, left, right) + pSum(mid + 1, end, node * 2 + 1, left, right);
}

// Initialize segment tree
init(0, n - 1, 1);

const results = [];
for (let i = 0; i < m + k; i++) {
    const [op, l, r, d] = input[index++].split(' ').map(Number);
    const left = l - 1;
    const right = r - 1;
    if (op === 1) {
        const dif = BigInt(d);
        update(0, n - 1, 1, left, right, dif);
    } else {
        results.push(pSum(0, n - 1, 1, left, right).toString());
    }
}

console.log(results.join('\n'));