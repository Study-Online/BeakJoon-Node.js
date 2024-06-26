const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = [];
rl.on('line', (line) => {
    input.push(line);
});

rl.on('close', () => {
    const N = parseInt(input[0], 10);
    const arr = input[1].split(' ').map(Number);
    const M = parseInt(input[2], 10);
    const queries = input.slice(3, 3 + M).map(line => line.split(' ').map(Number));

    const mergeSortTree = Array(4 * N).fill(null).map(() => []);

    // Merge Sort Tree Build
    const build = (node, start, end) => {
        if (start === end) {
            mergeSortTree[node] = [arr[start]];
        } else {
            const mid = Math.floor((start + end) / 2);
            build(2 * node + 1, start, mid);
            build(2 * node + 2, mid + 1, end);
            mergeSortTree[node] = merge(mergeSortTree[2 * node + 1], mergeSortTree[2 * node + 2]);
        }
    };

    const merge = (left, right) => {
        let result = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }
        while (i < left.length) result.push(left[i++]);
        while (j < right.length) result.push(right[j++]);
        return result;
    };

    build(0, 0, N - 1);

    // Query the merge sort tree
    const query = (node, start, end, L, R, K) => {
        if (R < start || L > end) {
            return 0;
        }
        if (L <= start && end <= R) {
            return mergeSortTree[node].length - lowerBound(mergeSortTree[node], K + 1);
        }
        const mid = Math.floor((start + end) / 2);
        const leftResult = query(2 * node + 1, start, mid, L, R, K);
        const rightResult = query(2 * node + 2, mid + 1, end, L, R, K);
        return leftResult + rightResult;
    };

    const lowerBound = (arr, x) => {
        let lo = 0, hi = arr.length;
        while (lo < hi) {
            const mid = Math.floor((lo + hi) / 2);
            if (arr[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    };

    let lastAns = 0;
    const results = [];
    for (let i = 0; i < M; i++) {
        let [a, b, c] = queries[i];
        const iQuery = (a ^ lastAns);
        const jQuery = (b ^ lastAns);
        const kQuery = (c ^ lastAns);

        const L = Math.min(iQuery, jQuery) - 1;
        const R = Math.max(iQuery, jQuery) - 1;
        const K = kQuery;

        lastAns = query(0, 0, N - 1, L, R, K);
        results.push(lastAns);
    }

    console.log(results.join('\n'));
});