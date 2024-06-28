const readline = require('readline');

// Thiết lập để đọc dữ liệu đầu vào
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = [];
rl.on('line', line => input.push(line.trim()));
rl.on('close', main);

function main() {
    const n = parseInt(input[0]);
    const pat = input[1].split(' ').map(Number).reverse();

    const pi = bakePi(pat);
    let k = 0;
    let p = 0;
    let total = Infinity;

    for (let i = 0; i < pi.length; i++) {
        const kk = pi.length - (i + 1);
        const pp = (i + 1) - pi[i];
        if (kk + pp < total) {
            total = kk + pp;
            k = kk;
            p = pp;
        }
    }
    console.log(`${k} ${p}`);
}

function bakePi(pt) {
    const pi = new Array(pt.length).fill(0);
    let j = 0;
    for (let i = 1; i < pt.length; i++) {
        while (j > 0 && pt[i] !== pt[j]) j = pi[j - 1];
        if (pt[i] === pt[j]) pi[i] = ++j;
    }
    return pi;
}