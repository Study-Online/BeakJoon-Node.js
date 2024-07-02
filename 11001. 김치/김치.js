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
    let [n, d] = input[0].split(' ').map(Number);
    let t = [0, ...input[1].split(' ').map(Number)];
    let v = [0, ...input[2].split(' ').map(Number)];

    let ans = Number.NEGATIVE_INFINITY;

    const c = (i, j) => {
        return (j - i) * t[j] + v[i];
    };

    const f = (s, e, l, r) => {
        if (s > e) return;
        let m = Math.floor((s + e) / 2);
        let k = Math.max(l, m - d);
        for (let i = k; i <= Math.min(m, r); i++) {
            if (c(k, m) < c(i, m)) k = i;
        }
        ans = Math.max(ans, c(k, m));
        f(s, m - 1, l, k);
        f(m + 1, e, k, r);
    };

    f(1, n, 1, n);

    console.log(ans);
});