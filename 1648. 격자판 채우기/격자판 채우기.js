const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const MAX = 14;
const MOD = 9901;
let dp = [];
let N, M;

const initializeDP = () => {
    dp = Array.from({ length: MAX * MAX }, () => new Array(1 << MAX).fill(-1));
};

const func = (x, bit) => {
    if (x === N * M) return 1;

    if (dp[x][bit] !== -1) return dp[x][bit];

    dp[x][bit] = 0;

    if (bit & 1) {
        dp[x][bit] = func(x + 1, bit >> 1);
    } else {
        if (Math.floor(x / M) !== N - 1) {
            dp[x][bit] = func(x + 1, (bit >> 1) | (1 << (M - 1)));
        }

        if (x % M !== M - 1 && !(bit & 2)) {
            dp[x][bit] = (dp[x][bit] + func(x + 2, bit >> 2)) % MOD;
        }
    }

    return dp[x][bit];
};

const inputHandler = (line) => {
    const [n, m] = line.split(' ').map(Number);
    N = n;
    M = m;
    initializeDP();
    console.log(func(0, 0));
};

rl.on('line', inputHandler);