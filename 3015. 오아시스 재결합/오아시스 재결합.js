const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputLines = [];
rl.on('line', (line) => {
    inputLines.push(line);
});
rl.on('close', () => {
    main();
});

function main() {
    let n = parseInt(inputLines[0]);
    let arr = new Array(n);
    for (let i = 1; i <= n; i++) {
        arr[i - 1] = parseInt(inputLines[i]);
    }
    
    let result = 0;
    let stack = [];
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && stack[stack.length - 1][0] < arr[i]) {
            result += stack.pop()[1];
        }
        if (stack.length === 0) {
            stack.push([arr[i], 1]);
        } else {
            if (stack[stack.length - 1][0] > arr[i]) {
                stack.push([arr[i], 1]);
                result++;
            } else {
                result += stack[stack.length - 1][1]++;
                if (stack.length > 1) result++;
            }
        }
    }
    console.log(result);
}