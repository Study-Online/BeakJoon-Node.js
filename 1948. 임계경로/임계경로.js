const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
let graph = [];
let reverseGraph = [];
let inDegree = [];
let distance = [];
let pathCount = 0;

rl.on('line', (line) => {
    input.push(line.trim());
});

rl.on('close', () => {
    const n = parseInt(input[0]);
    const m = parseInt(input[1]);
    graph = Array.from({ length: n + 1 }, () => []);
    reverseGraph = Array.from({ length: n + 1 }, () => []);
    inDegree = Array(n + 1).fill(0);
    distance = Array(n + 1).fill(0);
    let index = 2;
    for (let i = 0; i < m; i++) {
        const [u, v, w] = input[index++].split(' ').map(Number);
        graph[u].push({ node: v, weight: w });
        reverseGraph[v].push({ node: u, weight: w });
        inDegree[v]++;
    }

    const [start, end] = input[index].split(' ').map(Number);
    // Topological Sort and find longest path
    const queue = [];
    for (let i = 1; i <= n; i++) {
        if (inDegree[i] === 0) queue.push(i);
    }

    while (queue.length > 0) {
        const current = queue.shift();
        for (const edge of graph[current]) {
            const next = edge.node;
            const weight = edge.weight;
            if (distance[next] < distance[current] + weight) {
                distance[next] = distance[current] + weight;
            }
            inDegree[next]--;
            if (inDegree[next] === 0) queue.push(next);
        }
    }

    const longestPath = distance[end];
    // Backtrack to find the number of critical edges
    const visited = Array(n + 1).fill(false);
    const stack = [end];
    while (stack.length > 0) {
        const current = stack.pop();
        for (const edge of reverseGraph[current]) {
            const prev = edge.node;
            const weight = edge.weight;
            if (distance[prev] + weight === distance[current]) {
                pathCount++;
                if (!visited[prev]) {
                    visited[prev] = true;
                    stack.push(prev);
                }
            }
        }
    }
    console.log(longestPath);
    console.log(pathCount);
});