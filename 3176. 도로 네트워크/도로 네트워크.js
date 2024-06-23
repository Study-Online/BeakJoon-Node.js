const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout});

let inputLines = [];
rl.on('line', (line) => {
    inputLines.push(line);});

rl.on('close', () => {
    main();});

class City {
    constructor(to, dis) {
        this.to = to;
        this.dis = dis;
    }
}

let n, h;
let list, parent, minRoad, maxRoad, depth;
function main() {
    let lineIndex = 0;
    n = parseInt(inputLines[lineIndex++]);
    depth = new Array(n + 1).fill(0);
    list = Array.from({ length: n + 1 }, () => []);    
    h = getTreeH();   
    parent = Array.from({ length: n + 1 }, () => new Array(h).fill(0));
    minRoad = Array.from({ length: n + 1 }, () => new Array(h).fill(1000001));
    maxRoad = Array.from({ length: n + 1 }, () => new Array(h).fill(-1));
    
    let root = new Array(n + 1).fill(false);
    for (let i = 0; i < n - 1; i++) {
        let st = inputLines[lineIndex++].split(' ').map(Number);
        let a = st[0], b = st[1], c = st[2];
        list[a].push(new City(b, c));
        list[b].push(new City(a, c));
        root[b] = true;
    }
    
    let rIdx = 0;
    for (let i = 1; i <= n; i++) {
        if (!root[i]) {
            rIdx = i;
            break;
        }
    }
    
    init(rIdx, 1, 0);
    fillParents();    
    let sb = [];
    let k = parseInt(inputLines[lineIndex++]);
    for (let i = 0; i < k; i++) {
        let st = inputLines[lineIndex++].split(' ').map(Number);
        let d = st[0], e = st[1];        
        let res = LCA(d, e);
        sb.push(res[0] + " " + res[1]);
    }  
    console.log(sb.join('\n'));
}

function getTreeH() {
    return Math.ceil(Math.log2(n)) + 1;
}

function fillParents() {
    for (let i = 1; i < h; i++) {
        for (let j = 1; j <= n; j++) {
            parent[j][i] = parent[parent[j][i - 1]][i - 1];          
            maxRoad[j][i] = Math.max(maxRoad[j][i - 1], maxRoad[parent[j][i - 1]][i - 1]);
            minRoad[j][i] = Math.min(minRoad[j][i - 1], minRoad[parent[j][i - 1]][i - 1]);
        }
    }
}

function init(cur, h, pa) {
    depth[cur] = h;
    for (let nxt of list[cur]) {
        if (nxt.to != pa) {
            init(nxt.to, h + 1, cur);
            minRoad[nxt.to][0] = nxt.dis;
            maxRoad[nxt.to][0] = nxt.dis;
            parent[nxt.to][0] = cur;
        }
    }
}

function LCA(a, b) {
    let ah = depth[a];
    let bh = depth[b];
    if (ah < bh) {
        [a, b] = [b, a];
    }
    let min = 1000001;
    let max = -1;
    for (let i = h - 1; i >= 0; i--) {
        if (Math.pow(2, i) <= depth[a] - depth[b]) {
            min = Math.min(min, minRoad[a][i]);
            max = Math.max(max, maxRoad[a][i]);
            a = parent[a][i];
        }
    }
    
    if (a == b) return [min, max];  
    for (let i = h - 1; i >= 0; i--) {
        if (parent[a][i] != parent[b][i]) {
            min = Math.min(min, Math.min(minRoad[a][i], minRoad[b][i]));
            max = Math.max(max, Math.max(maxRoad[a][i], maxRoad[b][i]));
            a = parent[a][i];
            b = parent[b][i];
        }
    }
    min = Math.min(min, Math.min(minRoad[a][0], minRoad[b][0]));
    max = Math.max(max, Math.max(maxRoad[a][0], maxRoad[b][0]));
    return [min, max];
}