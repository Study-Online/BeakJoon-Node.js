const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MOD = 1_000_000_007;
const MAX = 8000 * 8000 * 1_000_000_000;

let L, G;
let sumCost = [];
let dp = [];

function solve(g, lLow, lHigh, kLow, kHigh) {
    if (lLow > lHigh || kLow > kHigh) return;

    const lMid = Math.floor((lLow + lHigh) / 2);
    let optK = kLow;

    dp[g][lMid] = MAX; // Initialize to a very large value

    for (let k = kLow; k <= Math.min(kHigh, lMid); k++) {
        const num = dp[g - 1][k] + cost(k + 1, lMid);
        if (num < dp[g][lMid]) {
            dp[g][lMid] = num;
            optK = k;
        }
    }
    solve(g, lLow, lMid - 1, kLow, optK);
    solve(g, lMid + 1, lHigh, optK, kHigh);
}

function cost(start, end) {
    return (end - start + 1) * (sumCost[end] - sumCost[start - 1]);
}

rl.on('line', (line) => {
    input.push(line.trim());
});

rl.on('close', () => {
    processInput();
});

let input = [];

function processInput() {
    let index = 0;

    // Read L and G
    [L, G] = input[index++].split(' ').map(Number);

    // Initialize sumCost and dp arrays
    sumCost = new Array(L + 1).fill(0);
    dp = Array.from({ length: G + 1 }, () => new Array(L + 1).fill(MAX));

    // Read costs and compute prefix sum
    const costs = input[index++].split(' ').map(Number);
    sumCost[1] = costs[0];
    for (let i = 2; i <= L; i++) {
        sumCost[i] = costs[i - 1] + sumCost[i - 1];
    }

    // Base case: only 1 guard
    for (let l = 1; l <= L; l++) {
        dp[1][l] = cost(1, l);
    }

    // Solve for more than 1 guard
    for (let g = 2; g <= G; g++) {
        solve(g, 1, L, 1, L);
    }

    // Output the result
    console.log(dp[G][L]);
}