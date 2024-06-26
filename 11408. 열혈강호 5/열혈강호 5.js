const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line);
}).on('close', () => {
  solve(input);
});

function solve(input) {
  const [N, M] = input[0].split(' ').map(Number);
  const edges = [];
  const capacity = Array.from({ length: N + M + 2 }, () => Array(N + M + 2).fill(0));
  const cost = Array.from({ length: N + M + 2 }, () => Array(N + M + 2).fill(0));
  const source = 0;
  const sink = N + M + 1;

  // Reading input and building the graph
  for (let i = 1; i <= N; i++) {
    const [k, ...rest] = input[i].split(' ').map(Number);
    for (let j = 0; j < k; j++) {
      const job = rest[2 * j];
      const wage = rest[2 * j + 1];
      const workerNode = i;
      const jobNode = N + job;

      capacity[workerNode][jobNode] = 1;
      cost[workerNode][jobNode] = wage;
      cost[jobNode][workerNode] = -wage;
      edges.push([workerNode, jobNode, 1, wage]);
    }
  }

  for (let i = 1; i <= N; i++) {
    capacity[source][i] = 1;
    edges.push([source, i, 1, 0]);
  }

  for (let i = 1; i <= M; i++) {
    capacity[N + i][sink] = 1;
    edges.push([N + i, sink, 1, 0]);
  }

  const [maxFlow, minCost] = minCostMaxFlow(source, sink, capacity, cost, N + M + 2);
  console.log(maxFlow);
  console.log(minCost);
}

function minCostMaxFlow(source, sink, capacity, cost, V) {
  const INF = 1e9;
  let totalFlow = 0;
  let totalCost = 0;

  while (true) {
    const dist = Array(V).fill(INF);
    const prev = Array(V).fill(-1);
    const inQueue = Array(V).fill(false);
    const flow = Array(V).fill(0);
    dist[source] = 0;
    flow[source] = INF;

    const queue = [];
    queue.push(source);
    inQueue[source] = true;

    while (queue.length > 0) {
      const u = queue.shift();
      inQueue[u] = false;

      for (let v = 0; v < V; v++) {
        if (capacity[u][v] > 0 && dist[v] > dist[u] + cost[u][v]) {
          dist[v] = dist[u] + cost[u][v];
          prev[v] = u;
          flow[v] = Math.min(flow[u], capacity[u][v]);
          if (!inQueue[v]) {
            queue.push(v);
            inQueue[v] = true;
          }
        }
      }
    }

    if (dist[sink] == INF) break;

    let currFlow = flow[sink];
    totalFlow += currFlow;
    totalCost += currFlow * dist[sink];

    let u = sink;
    while (u != source) {
      let v = prev[u];
      capacity[v][u] -= currFlow;
      capacity[u][v] += currFlow;
      u = v;
    }
  }

  return [totalFlow, totalCost];
}