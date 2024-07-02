const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];

rl.on('line', function (line) {
    input.push(line);
}).on('close', function () {
    main(input);
});

function main(input) {
    const n = parseInt(input[0].trim());
    const sharks = input.slice(1, n + 1).map(line => {
        const [a, b, c] = line.split(' ').map(Number);
        return { a, b, c };
    });

    const bias = 50;
    const g = Array.from({ length: 111 }, () => []);
    const par = Array(111).fill(-1);
    let chk = Array(111).fill(0);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const res = cmp(sharks[i], sharks[j]);
            if (res === 0) continue;
            if (res === 1) g[i].push(j + bias);
            else if (res === 2 && i < j) g[i].push(j + bias);
        }
    }

    for (let i = 0; i < n; i++) {
        chk.fill(0);
        dfs(i, g, chk, par);
        chk.fill(0);
        dfs(i, g, chk, par);
    }

    let ans = 0;
    for (let i = bias; i < bias + n; i++) {
        if (par[i] === -1) ans++;
    }

    console.log(ans);
}

function cmp(shark1, shark2) {
    let cnt = 0;
    if (shark1.a < shark2.a) return 0;
    else if (shark1.a === shark2.a) cnt++;
    if (shark1.b < shark2.b) return 0;
    else if (shark1.b === shark2.b) cnt++;
    if (shark1.c < shark2.c) return 0;
    else if (shark1.c === shark2.c) cnt++;
    if (cnt === 3) return 2;
    return 1;
}

function dfs(v, g, chk, par) {
    for (let i of g[v]) {
        if (chk[i]) continue;
        chk[i] = 1;
        if (par[i] === -1 || dfs(par[i], g, chk, par)) {
            par[i] = v;
            return true;
        }
    }
    return false;
}