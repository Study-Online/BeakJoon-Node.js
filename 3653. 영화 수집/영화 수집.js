const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
rl.on('line', (line) => {
    input.push(line);
});

rl.on('close', () => {
    let T = parseInt(input[0]); // Số lượng bộ test
    let indexLine = 1;
    for (let t = 0; t < T; t++) {
        let [n, m] = input[indexLine].split(' ').map(Number); // Đọc n và m
        indexLine++;
        let indices = new Array(n + 1);
        for (let i = 1; i <= n; i++) {
            indices[i] = i + m - 1;
        }

        let st = new SegTree(4 * (n + m));
        st.init(1, 0, n + m - 1, m);
        let movies = input[indexLine].split(' ').map(Number);
        indexLine++;
        let result = [];
        for (let i = 0; i < m; i++) {
            let movie = movies[i];
            let idx = indices[movie];
            result.push(st.sum(1, 0, n + m - 1, 0, idx - 1));
            st.update(1, 0, n + m - 1, idx, -1);
            st.update(1, 0, n + m - 1, m - 1 - i, 1);
            indices[movie] = m - 1 - i;
        }

        console.log(result.join(' '));
    }
});

class SegTree {
    constructor(n) {
        this.tree = new Array(n).fill(0);
    }

    init(node, start, end, m) {
        if (start === end) {
            this.tree[node] = (start < m) ? 0 : 1;
            return this.tree[node];
        }

        let mid = Math.floor((start + end) / 2);
        this.tree[node] = this.init(node * 2, start, mid, m) + this.init(node * 2 + 1, mid + 1, end, m);
        return this.tree[node];
    }

    sum(node, start, end, left, right) {
        if (right < start || end < left) return 0;
        if (left <= start && end <= right) return this.tree[node];
        let mid = Math.floor((start + end) / 2);
        return this.sum(node * 2, start, mid, left, right) + this.sum(node * 2 + 1, mid + 1, end, left, right);
    }

    update(node, start, end, idx, diff) {
        if (idx < start || end < idx) return;
        this.tree[node] += diff;
        if (start === end) return;
        let mid = Math.floor((start + end) / 2);
        this.update(node * 2, start, mid, idx, diff);
        this.update(node * 2 + 1, mid + 1, end, idx, diff);
    }
}