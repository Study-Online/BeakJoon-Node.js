const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const mod = 1000003n;
class Matrix {
    constructor(size) {
        this.size = size;
        this.arr = Array.from({ length: size }, () => Array(size).fill(0n));
    }
    multiply(other) {
        const result = new Matrix(this.size);
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                for (let k = 0; k < this.size; k++) {
                    result.arr[i][j] = (result.arr[i][j] + this.arr[i][k] * other.arr[k][j]) % mod;
                }
            }
        }
        return result;
    }
}
function powmat(a, b) {
    if (b === 1n) return a;
    let half = powmat(a, b / 2n);
    half = half.multiply(half);
    if (b % 2n === 1n) half = half.multiply(a);
    return half;
}
let input = [];
rl.on('line', (line) => {
    input.push(line.trim());
}).on('close', () => {
    const [n, s, e, t] = input[0].split(' ').map(Number);
    const matrixSize = n * 5;
    const mat = new Matrix(matrixSize);
    for (let i = 0; i < n; i++) {
        for (let j = 1; j < 5; j++) {
            mat.arr[i * 5 + j][i * 5 + j - 1] = 1n;
        }
    }
    for (let i = 1; i <= n; i++) {
        const str = input[i];
        for (let j = 0; j < n; j++) {
            const t = parseInt(str[j], 10);
            if (t === 1) mat.arr[(i - 1) * 5][j * 5] = 1n;
            else if (t > 1) mat.arr[(i - 1) * 5][j * 5 + t - 1] = 1n;
        }
    }
    // Tính ma trận chuyển tiếp sau t bước
    const ans = powmat(mat, BigInt(t));
    // Lấy số đường đi từ đỉnh s đến đỉnh e sau t bước
    const result = ans.arr[(s - 1) * 5][(e - 1) * 5];
    console.log(result.toString());
});