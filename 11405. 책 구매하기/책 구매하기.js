const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
rl.on('line', (line) => {
    input.push(line);
});

rl.on('close', () => {
    const [N, M] = input[0].split(' ').map(Number);
    const A = input[1].split(' ').map(Number);
    const B = input[2].split(' ').map(Number);
    const costs = input.slice(3).map(line => line.split(' ').map(Number));

    const source = N + M;
    const sink = N + M + 1;
    const nodes = N + M + 2;

    const capacities = Array.from({ length: nodes }, () => Array(nodes).fill(0));
    const cost = Array.from({ length: nodes }, () => Array(nodes).fill(0));
    const adj = Array.from({ length: nodes }, () => []);

    // Connect source to shops
    for (let i = 0; i < M; i++) {
        capacities[source][i] = B[i];
        adj[source].push(i);
        adj[i].push(source);
    }

    // Connect shops to people
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            capacities[i][M + j] = Infinity;
            cost[i][M + j] = costs[i][j];
            cost[M + j][i] = -costs[i][j];
            adj[i].push(M + j);
            adj[M + j].push(i);
        }
    }

    // Connect people to sink
    for (let j = 0; j < N; j++) {
        capacities[M + j][sink] = A[j];
        adj[M + j].push(sink);
        adj[sink].push(M + j);
    }

    const flow = Array.from({ length: nodes }, () => Array(nodes).fill(0));
    const inQueue = Array(nodes).fill(false);
    const dist = Array(nodes).fill(Infinity);
    const parent = Array(nodes).fill(-1);

    const spfa = () => {
        dist.fill(Infinity);
        inQueue.fill(false);
        const queue = [source];
        dist[source] = 0;
        inQueue[source] = true;

        while (queue.length) {
            const u = queue.shift();
            inQueue[u] = false;

            for (const v of adj[u]) {
                if (flow[v][u] > 0 && dist[u] - cost[v][u] < dist[v]) {
                    dist[v] = dist[u] - cost[v][u];
                    parent[v] = u;
                    if (!inQueue[v]) {
                        queue.push(v);
                        inQueue[v] = true;
                    }
                } else if (capacities[u][v] > flow[u][v] && dist[u] + cost[u][v] < dist[v]) {
                    dist[v] = dist[u] + cost[u][v];
                    parent[v] = u;
                    if (!inQueue[v]) {
                        queue.push(v);
                        inQueue[v] = true;
                    }
                }
            }
        }

        return dist[sink] < Infinity;
    };

    const minCostMaxFlow = () => {
        let maxFlow = 0;
        let minCost = 0;

        while (spfa()) {
            let pathFlow = Infinity;
            for (let v = sink; v !== source; v = parent[v]) {
                const u = parent[v];
                if (flow[v][u] > 0) {
                    pathFlow = Math.min(pathFlow, flow[v][u]);
                } else {
                    pathFlow = Math.min(pathFlow, capacities[u][v] - flow[u][v]);
                }
            }

            for (let v = sink; v !== source; v = parent[v]) {
                const u = parent[v];
                if (flow[v][u] > 0) {
                    flow[v][u] -= pathFlow;
                    minCost -= pathFlow * cost[v][u];
                } else {
                    flow[u][v] += pathFlow;
                    minCost += pathFlow * cost[u][v];
                }
            }

            maxFlow += pathFlow;
        }

        return minCost;
    };

    const result = minCostMaxFlow();
    console.log(result);
});