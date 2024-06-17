const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
rl.on('line', (line) => {
    input.push(line);
}).on('close', () => {
    main();
});

let n, h, serialNum = 1;
let list = [];
let trip = [];
let tree;
let depth, no2serial, serial2no, locInTrip;
function main() {
    n = parseInt(input[0]);
    for (let i = 0; i <= n; i++) {
        list[i] = [];
    }

    for (let i = 1; i < n; i++) {
        let [a, b] = input[i].split(' ').map(Number);
        list[a].push(b);
        list[b].push(a);
    }
    h = Math.ceil(Math.log2(n)) + 1;
    depth = new Array(n + 1);
    no2serial = new Array(n + 1);
    serial2no = new Array(n + 1);
    locInTrip = new Array(n + 1);
    traversal(1, 1, 0);
    let len = trip.length;
    let size = getTreeSize(len);
    tree = new Array(size);
    init(0, len - 1, 1);
    let m = parseInt(input[n]);
    let sb = [];
    for (let i = 1; i <= m; i++) {
        let [a, b] = input[n + i].split(' ').map(Number);
        a = locInTrip[a];
        b = locInTrip[b];
        if (a > b) {
            [a, b] = [b, a];
        }
        let lca = query(0, len - 1, a, b, 1);
        sb.push(serial2no[lca]);
    }
    console.log(sb.join('\n'));
}

// Hàm tính kích thước cây
function getTreeSize(size) {
    let h = Math.ceil(Math.log2(size)) + 1;
    return Math.pow(2, h) - 1;
}

// Hàm duyệt cây
function traversal(cur, h, pa) {
    depth[cur] = h;
    no2serial[cur] = serialNum;
    serial2no[serialNum] = cur;
    serialNum++;
    locInTrip[cur] = trip.length;
    trip.push(no2serial[cur]);

    for (let nxt of list[cur]) {
        if (nxt != pa) {
            traversal(nxt, h + 1, cur);
            trip.push(no2serial[cur]);
        }
    }
}

// Hàm khởi tạo cây
function init(start, end, node) {
    if (start === end) {
        return tree[node] = trip[start];
    }
    let mid = Math.floor((start + end) / 2);
    return tree[node] = Math.min(init(start, mid, node * 2), init(mid + 1, end, node * 2 + 1));
}

// Hàm truy vấn
function query(start, end, left, right, node) {
    if (right < start || end < left) return Number.MAX_SAFE_INTEGER;
    if (left <= start && end <= right) {
        return tree[node];
    }
    let mid = Math.floor((start + end) / 2);
    return Math.min(query(start, mid, left, right, node * 2), query(mid + 1, end, left, right, node * 2 + 1));
}