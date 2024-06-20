const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line.trim());
}).on('close', () => {
  const N = parseInt(input[0], 10);
  const heights = input.slice(1, N + 1).map(Number);
  
  function largestRectangleArea(heights) {
    const stack = [];
    let maxArea = 0;
    heights.push(0); // Sentinel to ensure the stack is emptied at the end

    for (let i = 0; i < heights.length; i++) {
      while (stack.length && heights[i] < heights[stack[stack.length - 1]]) {
        const h = heights[stack.pop()];
        const w = stack.length ? i - stack[stack.length - 1] - 1 : i;
        maxArea = Math.max(maxArea, h * w);
      }
      stack.push(i);
    }

    return maxArea;
  }

  console.log(largestRectangleArea(heights));
});