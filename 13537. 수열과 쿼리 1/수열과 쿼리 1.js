const fs = require('fs');

// Reading input from stdin
const input = fs.readFileSync('/dev/stdin').toString().trim().split('\n');
let index = 0;

const n = parseInt(input[index++], 10);
const arr = new Array(n + 1);
const tree = new Array(n * 4).fill(null).map(() => []);

const arrInput = input[index++].split(' ').map(Number);
for (let i = 1; i <= n; i++) {
    arr[i] = arrInput[i - 1];
    update(1, n, 1, i);
}

// Sort the tree segments
for (let i = 0; i < n * 4; i++) {
    tree[i].sort((a, b) => a - b);
}

const results = [];
const m = parseInt(input[index++], 10);

for (let i = 0; i < m; i++) {
    const [a, b, k] = input[index++].split(' ').map(Number);
    results.push(getMoreThanNumOfK(1, n, 1, a, b, k));
}

console.log(results.join('\n'));

// Update function to populate the segment tree
function update(s, e, node, idx) {
    if (s > idx || e < idx) return;
    tree[node].push(arr[idx]);

    if (s === e) return;

    const mid = Math.floor((s + e) / 2);
    update(s, mid, node * 2, idx);
    update(mid + 1, e, node * 2 + 1, idx);
}

// Query function to get the count of elements greater than k
function getMoreThanNumOfK(s, e, node, l, r, k) {
    if (r < s || l > e) return 0;
    if (l <= s && e <= r) {
        const x = upperbound(tree[node], k);
        return tree[node].length - x;
    }

    const mid = Math.floor((s + e) / 2);
    return getMoreThanNumOfK(s, mid, node * 2, l, r, k) + getMoreThanNumOfK(mid + 1, e, node * 2 + 1, l, r, k);
}

// Helper function to find the upper bound index of k in sorted data
function upperbound(data, val) {
    let s = 0;
    let e = data.length;

    while (s < e) {
        const mid = Math.floor((s + e) / 2);
        if (data[mid] <= val) {
            s = mid + 1;
        } else {
            e = mid;
        }
    }
    return e;
}