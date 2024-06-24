const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class Node {
    constructor(to, w) {
        this.to = to;
        this.w = w;
    }
}

Node.prototype.compareTo = function (o) {
    return this.w - o.w;
};

const MAX = Number.MAX_SAFE_INTEGER; // Giá trị lớn nhất có thể
let n, m;
let dp;
let exRoute;
let list;
let removeList;

const input = [];
rl.on('line', (line) => {
    if (line.trim() === '0 0') {
        processInput();
        rl.close();
    } else {
        input.push(line.trim());
    }
});

function processInput() {
    let index = 0;
    const sb = [];
    while (index < input.length && input[index] !== '0 0') {
        let st = input[index++].split(' ');
        n = parseInt(st[0]);
        m = parseInt(st[1]);

        st = input[index++].split(' ');
        const s = parseInt(st[0]);
        const d = parseInt(st[1]);

        list = Array.from({ length: n }, () => []);
        removeList = Array.from({ length: n }, () => []);
        dp = Array(n).fill(MAX);

        for (let i = 0; i < m; i++) {
            st = input[index++].split(' ');
            const u = parseInt(st[0]);
            const v = parseInt(st[1]);
            const cost = parseInt(st[2]);
            list[u].push(new Node(v, cost));
        }

        exRoute = Array.from({ length: n }, () => Array(n).fill(false));
        dijkstra(s);
        removeMinRouteVertex(s, d);
        dijkstra(s);
        sb.push(dp[d] === MAX ? -1 : dp[d]);
        sb.push("\n");
    }
    process.stdout.write(sb.join(''));
}

function initDp() {
    dp.fill(MAX); // Khởi tạo mảng dp với giá trị lớn nhất
}

function removeMinRouteVertex(s, d) {
    if (s === d) return;
    for (const nxt of removeList[d]) {
        if (!exRoute[nxt][d]) {
            exRoute[nxt][d] = true;
            removeMinRouteVertex(s, nxt);
        }
    }
}

function dijkstra(s) {
    const q = new MinPriorityQueue();
    initDp();
    dp[s] = 0;
    q.enqueue(new Node(s, 0), 0);

    while (!q.isEmpty()) {
        const node = q.dequeue().element;
        const cur = node.to;
        if (node.w > dp[cur]) continue;
        for (const nxt of list[cur]) {
            if (exRoute[cur][nxt.to]) continue;
            if (dp[nxt.to] > dp[cur] + nxt.w) {
                dp[nxt.to] = dp[cur] + nxt.w;
                removeList[nxt.to] = [cur];
                q.enqueue(new Node(nxt.to, dp[nxt.to]), dp[nxt.to]);
            } else if (dp[nxt.to] === dp[cur] + nxt.w) {
                removeList[nxt.to].push(cur);
            }
        }
    }
}

class MinPriorityQueue {
    constructor() {
        this.heap = [];
    }

    enqueue(element, priority) {
        this.heap.push({ element, priority });
        this.bubbleUp();
    }

    dequeue() {
        const first = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.sinkDown(0);
        }
        return first;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        const element = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];
            if (element.priority >= parent.priority) break;
            this.heap[index] = parent;
            index = parentIndex;
        }
        this.heap[index] = element;
    }

    sinkDown(index) {
        const length = this.heap.length;
        const element = this.heap[index];
        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIndex < length) {
                leftChild = this.heap[leftChildIndex];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIndex;
                }
            }
            if (rightChildIndex < length) {
                rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIndex;
                }
            }
            if (swap === null) break;
            this.heap[index] = this.heap[swap];
            index = swap;
        }
        this.heap[index] = element;
    }
}