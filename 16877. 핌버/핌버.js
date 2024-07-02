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
    const P = input[1].split(' ').map(Number);

    // 피보나치 수열 계산 (범위 내의 최대 피보나치 수 구하기)
    const fibonacci = [1, 2];
    while (true) {
        const nextFib = fibonacci[fibonacci.length - 1] + fibonacci[fibonacci.length - 2];
        if (nextFib > 3000000) break;
        fibonacci.push(nextFib);
    }

    // 각 돌 더미에 대한 Grundy 수 계산
    const maxP = Math.max(...P);
    const grundy = Array(maxP + 1).fill(0);

    for (let i = 1; i <= maxP; i++) {
        const reachable = new Set();
        for (const f of fibonacci) {
            if (i - f >= 0) {
                reachable.add(grundy[i - f]);
            } else {
                break;
            }
        }
        grundy[i] = 0;
        while (reachable.has(grundy[i])) {
            grundy[i]++;
        }
    }

    // Grundy 수들의 XOR 계산
    let xorSum = 0;
    for (const p of P) {
        xorSum ^= grundy[p];
    }

    // 최종 결과 판단
    if (xorSum === 0) {
        console.log("cubelover");
    } else {
        console.log("koosaga");
    }
});