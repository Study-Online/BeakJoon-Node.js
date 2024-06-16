const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let input = [];
rl.on('line', (line) => {
    input.push(line.trim());
}).on('close', () => {
    // Đọc số lượng chuỗi
    const n = parseInt(input[0]);
    const nums = [];
    for (let i = 1; i <= n; i++) {
        nums.push(input[i]);
    }
    const mod = parseInt(input[n + 1]);
    const tenPow = Array(55).fill(0);
    tenPow[0] = 1 % mod;
    for (let i = 1; i < 55; i++) {
        tenPow[i] = (tenPow[i - 1] * 10) % mod;
    }
    const p = [];
    for (let i = 0; i < n; i++) {
        nums[i] = nums[i].split('').reverse().join('');
        let next = 0;
        for (let j = 0; j < nums[i].length; j++) {
            next += (parseInt(nums[i][j]) * tenPow[j]) % mod;
        }
        next %= mod;
        p.push({ next: next, cnt: nums[i].length });
    }
    const all = factorial(n);
    const d = Array(1 << n).fill(null).map(() => Array(mod).fill(-1));
    function factorial(x) {
        if (x === 0) return 1;
        let result = 1;
        for (let i = 2; i <= x; i++) {
            result *= i;
        }
        return result;
    }
    function gcd(a, b) {
        if (!b) return a;
        return gcd(b, a % b);
    }
    function go(s, num) {
        if (s === (1 << n) - 1) return (num % mod === 0) ? 1 : 0;
        if (d[s][num] !== -1) return d[s][num];   
        let ret = 0;
        for (let k = 0; k < n; k++) {
            if (s & (1 << k)) continue;
            const { next, cnt } = p[k];
            let nextNum = (num * tenPow[cnt] + next) % mod;
            ret += go(s | (1 << k), nextNum);
        }
        d[s][num] = ret;
        return ret;
    }
    const cnt = go(0, 0);
    const g = gcd(all, cnt);
    console.log(`${cnt / g}/${all / g}`);
});