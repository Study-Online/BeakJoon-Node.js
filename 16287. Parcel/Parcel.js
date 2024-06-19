const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = [];
rl.on('line', (line) => {
    input.push(line.trim());
}).on('close', () => {
    solve(input);
});

function solve(input) {
    const [w, n] = input[0].split(' ').map(Number);
    const arr = input[1].split(' ').map(Number).sort((a, b) => a - b);   
    const mem = Array(800000).fill(-1);
    function find() {
        for (let i = 0; i < n; i++) {
            if (arr[i] >= w) {
                return false;
            }
            for (let j = i + 1; j < n; j++) {
                const res = arr[i] + arr[j];
                if (res >= w) {
                    break;
                }
                if (mem[res] < 0) {
                    mem[res] = j;
                } else {
                    mem[res] = Math.min(mem[res], j);
                }
                if (mem[w - res] > -1 && mem[w - res] < i) {
                    return true;
                }
            }
        }
        return false;
    }

    if (find()) {
        console.log('YES');
    } else {
        console.log('NO');
    }
}