const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
rl.on('line', (line) => {
    input.push(line.trim());
});

rl.on('close', () => {
    const [N, M] = input[0].split(' ').map(Number);
    const parents = input[1].split(' ').map(Number);
    const commands = input.slice(2).map(line => line.split(' ').map(Number));

    solve(N, M, parents, commands);
});

function solve(N, M, parents, commands) {
    const children = Array.from({ length: N + 1 }, () => []);
    for (let i = 2; i <= N; i++) {
        children[parents[i - 1]].push(i);
    }

    let time = 0;
    const start = Array(N + 1).fill(0);
    const end = Array(N + 1).fill(0);

    function dfs(node) {
        start[node] = ++time;
        for (const child of children[node]) {
            dfs(child);
        }
        end[node] = time;
    }

    dfs(1);

    const segTree = new SegmentTree(N);

    const results = [];

    for (const [type, i, w] of commands) {
        if (type === 1) {
            segTree.update(start[i], end[i], w);
        } else if (type === 2) {
            results.push(segTree.query(start[i]));
        }
    }

    console.log(results.join('\n'));
}

class SegmentTree {
    constructor(size) {
        this.size = size;
        this.tree = Array(size * 4).fill(0);
        this.lazy = Array(size * 4).fill(0);
    }

    update(l, r, value, node = 1, nodeLeft = 1, nodeRight = this.size) {
        this.propagate(node, nodeLeft, nodeRight);

        if (r < nodeLeft || l > nodeRight) {
            return;
        }

        if (l <= nodeLeft && nodeRight <= r) {
            this.lazy[node] += value;
            this.propagate(node, nodeLeft, nodeRight);
            return;
        }

        const mid = Math.floor((nodeLeft + nodeRight) / 2);
        this.update(l, r, value, node * 2, nodeLeft, mid);
        this.update(l, r, value, node * 2 + 1, mid + 1, nodeRight);
        this.tree[node] = this.tree[node * 2] + this.tree[node * 2 + 1];
    }

    query(index, node = 1, nodeLeft = 1, nodeRight = this.size) {
        this.propagate(node, nodeLeft, nodeRight);

        if (nodeLeft === nodeRight) {
            return this.tree[node];
        }

        const mid = Math.floor((nodeLeft + nodeRight) / 2);
        if (index <= mid) {
            return this.query(index, node * 2, nodeLeft, mid);
        } else {
            return this.query(index, node * 2 + 1, mid + 1, nodeRight);
        }
    }

    propagate(node, nodeLeft, nodeRight) {
        if (this.lazy[node] !== 0) {
            this.tree[node] += (nodeRight - nodeLeft + 1) * this.lazy[node];
            if (nodeLeft !== nodeRight) {
                this.lazy[node * 2] += this.lazy[node];
                this.lazy[node * 2 + 1] += this.lazy[node];
            }
            this.lazy[node] = 0;
        }
    }
}