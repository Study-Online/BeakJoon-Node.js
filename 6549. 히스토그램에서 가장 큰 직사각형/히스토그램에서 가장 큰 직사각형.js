const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputLines = [];
let results = [];

rl.on('line', (line) => {
    if (line.trim() === '0') {
        rl.close();
    } else {
        inputLines.push(line);
    }
});

rl.on('close', () => {
    inputLines.forEach(line => {
        const tokens = line.split(' ').map(Number);
        const n = tokens[0];

        if (n === 0) return;

        const heights = tokens.slice(1); // Extract the heights array
        const maxArea = findLargestRectangle(heights);
        results.push(maxArea);
    });
    results.forEach(result => console.log(result));
});

function findLargestRectangle(heights) {
    let stack = [];
    let maxArea = 0;
    let index = 0;
    const n = heights.length;

    while (index < n) {
        if (stack.length === 0 || heights[stack[stack.length - 1]] <= heights[index]) {
            stack.push(index++);
        } else {
            const topOfStack = stack.pop();
            const height = heights[topOfStack];
            const width = stack.length === 0 ? index : index - stack[stack.length - 1] - 1;
            const area = height * width;
            maxArea = Math.max(maxArea, area);
        }
    }
    while (stack.length > 0) {
        const topOfStack = stack.pop();
        const height = heights[topOfStack];
        const width = stack.length === 0 ? index : index - stack[stack.length - 1] - 1;
        const area = height * width;
        maxArea = Math.max(maxArea, area);
    }

    return maxArea;
}