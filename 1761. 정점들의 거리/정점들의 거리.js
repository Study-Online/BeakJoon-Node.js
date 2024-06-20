class Node {
    constructor(to, w) {
        this.to = to; // đỉnh đích
        this.w = w;   // trọng số của cạnh
    }
}

let n, h;
let list;
let dp;
let dis;
let depth;
let sb = [];

// Hàm chính để khởi động chương trình
async function main() {
    const fs = require('fs');
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let input = [];
    for await (const line of rl) {
        input.push(line);
    }

    n = parseInt(input[0]);
    list = Array.from({ length: n + 1 }, () => []);

    for (let i = 1; i < n; i++) {
        let [from, to, w] = input[i].split(' ').map(Number);
        list[from].push(new Node(to, w));
        list[to].push(new Node(from, w));
    }

    h = getTreeH();
    depth = new Array(n + 1).fill(0);
    dis = new Array(n + 1).fill(0);
    dp = Array.from({ length: n + 1 }, () => new Array(h).fill(0));

    init(1, 1, 0);
    fillParents();

    let m = parseInt(input[n]);
    for (let i = n + 1; i < n + 1 + m; i++) {
        let [a, b] = input[i].split(' ').map(Number);
        let res = LCA(a, b);
        sb.push(dis[a] + dis[b] - 2 * dis[res]);
    }

    console.log(sb.join('\n'));
}

// Hàm tính chiều cao của cây
function getTreeH() {
    return Math.ceil(Math.log(n) / Math.log(2)) + 1;
}

// Hàm khởi tạo thông tin cho mỗi đỉnh
function init(cur, h, pa) {
    depth[cur] = h;
    for (let nxt of list[cur]) {
        if (nxt.to !== pa) {
            dis[nxt.to] = dis[cur] + nxt.w;
            init(nxt.to, h + 1, cur);
            dp[nxt.to][0] = cur;
        }
    }
}

// Hàm điền thông tin cha mẹ cho mỗi đỉnh
function fillParents() {
    for (let i = 1; i < h; i++) {
        for (let j = 1; j <= n; j++) {
            dp[j][i] = dp[dp[j][i - 1]][i - 1];
        }
    }
}

// Hàm tìm tổ tiên chung gần nhất của hai đỉnh a và b
function LCA(a, b) {
    let ah = depth[a];
    let bh = depth[b];

    if (ah < bh) {
        [a, b] = [b, a];
    }

    for (let i = h - 1; i >= 0; i--) {
        if (Math.pow(2, i) <= depth[a] - depth[b]) {
            a = dp[a][i];
        }
    }

    if (a === b) return a;

    for (let i = h - 1; i >= 0; i--) {
        if (dp[a][i] !== dp[b][i]) {
            a = dp[a][i];
            b = dp[b][i];
        }
    }

    return dp[a][0];
}
main();