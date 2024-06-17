const readline = require('readline');

// Function to read inputs from stdin
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Global variables for input reading
let input = [];
rl.on('line', line => {
    input.push(line.trim());
}).on('close', () => {
    solve(input);
});

// Function to solve the problem
function solve(input) {
    let idx = 0;

    // Read N
    const N = parseInt(input[idx++]);
    const sqrtN = Math.sqrt(N);

    // Read the array A
    const A = [0];  // 1-based index
    input[idx++].split(' ').forEach(num => A.push(parseInt(num)));

    // Read M
    const M = parseInt(input[idx++]);
    const queries = [];
    for (let i = 0; i < M; i++) {
        const [s, e] = input[idx++].split(' ').map(Number);
        queries.push({ idx: i, s, e });
    }

    // Sort queries using Mo's algorithm
    queries.sort((a, b) => {
        if (Math.floor(a.s / sqrtN) === Math.floor(b.s / sqrtN)) {
            return a.e - b.e;
        }
        return a.s - b.s;
    });

    const mxn = 1e5;
    const cnt = new Array(mxn + 1).fill(0);
    const ccnt = new Array(mxn + 1).fill(0);
    let now = 0;
    const ans = new Array(M);

    // Functions to add and remove elements
    function add(x) {
        ccnt[cnt[A[x]]++]--;
        ccnt[cnt[A[x]]]++;
        now = Math.max(now, cnt[A[x]]);
    }

    function remove(x) {
        ccnt[cnt[A[x]]--]--;
        ccnt[cnt[A[x]]]++;
        if (ccnt[now] === 0) now--;
    }

    // Process the queries
    let l = queries[0].s, r = queries[0].s;
    add(l);
    for (let q of queries) {
        while (l < q.s) remove(l++);
        while (l > q.s) add(--l);
        while (r < q.e) add(++r);
        while (r > q.e) remove(r--);
        ans[q.idx] = now;
    }

    // Output the results
    ans.forEach(result => console.log(result));
}