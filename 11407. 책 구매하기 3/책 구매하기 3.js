const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const INF = 1e9;
let input = [];
rl.on('line', function (line) {
    input.push(line);
}).on('close', function () {
    solve(input);
});

function solve(input) {
    let [N, M] = input[0].split(' ').map(Number);
    let A = input[1].split(' ').map(Number);
    let B = input[2].split(' ').map(Number);

    let C = [];
    let D = [];
    for (let i = 0; i < M; i++) {
        C.push(input[3 + i].split(' ').map(Number));
    }
    for (let i = 0; i < M; i++) {
        D.push(input[3 + M + i].split(' ').map(Number));
    }

    let V = N + M + 2;
    let source = 0;
    let sink = V - 1;

    let capacity = Array.from({ length: V }, () => Array(V).fill(0));
    let cost = Array.from({ length: V }, () => Array(V).fill(0));
    let flow = Array.from({ length: V }, () => Array(V).fill(0));

    // 소스에서 사람으로 가는 간선
    for (let i = 0; i < N; i++) {
        capacity[source][1 + i] = A[i];
    }

    // 서점에서 싱크로 가는 간선
    for (let i = 0; i < M; i++) {
        capacity[1 + N + i][sink] = B[i];
    }

    // 사람과 서점 간의 간선
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            if (C[i][j] > 0) {
                capacity[1 + j][1 + N + i] = C[i][j];
                cost[1 + j][1 + N + i] = D[i][j];
                cost[1 + N + i][1 + j] = -D[i][j];
            }
        }
    }

    let totalFlow = 0;
    let totalCost = 0;

    while (true) {
        let dist = Array(V).fill(INF);
        let parent = Array(V).fill(-1);
        let inQueue = Array(V).fill(false);

        let queue = [source];
        dist[source] = 0;
        inQueue[source] = true;

        while (queue.length > 0) {
            let u = queue.shift();
            inQueue[u] = false;

            for (let v = 0; v < V; v++) {
                if (capacity[u][v] - flow[u][v] > 0 && dist[v] > dist[u] + cost[u][v]) {
                    dist[v] = dist[u] + cost[u][v];
                    parent[v] = u;
                    if (!inQueue[v]) {
                        queue.push(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        if (dist[sink] === INF) break;

        let increment = INF;
        for (let u = sink; u !== source; u = parent[u]) {
            increment = Math.min(increment, capacity[parent[u]][u] - flow[parent[u]][u]);
        }

        for (let u = sink; u !== source; u = parent[u]) {
            flow[parent[u]][u] += increment;
            flow[u][parent[u]] -= increment;
            totalCost += increment * cost[parent[u]][u];
        }

        totalFlow += increment;
    }

    console.log(totalFlow);
    console.log(totalCost);
}