const inf = 1e9 + 7;

class EdmondsKarp {
  constructor(n, source = -1, sink = -1) {
    this.n = n;
    this.s = source;
    this.e = sink;
    this.flow = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    this.capacity = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    this.adjList = Array.from({ length: n + 1 }, () => []);
  }

  setSource(source) {
    this.s = source;
  }

  setSink(sink) {
    this.e = sink;
  }

  addEdge(start, end, cap, directed) {
    this.adjList[start].push(end);
    this.adjList[end].push(start);
    this.capacity[start][end] += cap;
    if (!directed) {
      this.capacity[end][start] += cap;
    }
  }

  bfs(par) {
    par.fill(-1);
    par[this.s] = -2; // Mark the source as visited
    let queue = [[this.s, inf]]; // (node, flow)

    while (queue.length > 0) {
      let [cur, flow] = queue.shift();

      for (let nxt of this.adjList[cur]) {
        if (par[nxt] === -1 && this.capacity[cur][nxt] - this.flow[cur][nxt] > 0) {
          par[nxt] = cur;
          let new_flow = Math.min(flow, this.capacity[cur][nxt] - this.flow[cur][nxt]);
          if (nxt === this.e) return new_flow;
          queue.push([nxt, new_flow]);
        }
      }
    }

    return 0;
  }

  maxFlow() {
    if (this.s === -1 || this.e === -1) return -1;
    let par = Array(this.n + 1).fill(-1);
    let max_flow = 0;

    while (true) {
      let flow = this.bfs(par);
      if (flow === 0) break;

      max_flow += flow;
      let cur = this.e;

      while (cur !== this.s) {
        let prev = par[cur];
        this.flow[prev][cur] += flow;
        this.flow[cur][prev] -= flow;
        cur = prev;
      }
    }

    return max_flow;
  }
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const main = () => {
  rl.question('', (line) => {
    const [n, m, k] = line.split(' ').map(Number);
    const s = 2001;
    const e = 2003;
    const bridge = 2002;
    const flow = new EdmondsKarp(2003, s, e);

    let inputCount = n;
    let lines = [];

    const processLine = (line) => {
      lines.push(line);
      if (--inputCount === 0) {
        rl.close();
        // Add edges
        for (let i = 1; i <= n; i++) {
          flow.addEdge(s, i, 1, true);
          flow.addEdge(bridge, i, 1, true);
          const [x, ...targets] = lines[i - 1].split(' ').map(Number);
          targets.forEach(t => flow.addEdge(i, 1000 + t, 1, true));
        }

        flow.addEdge(s, bridge, k, true);
        for (let i = 1; i <= m; i++) {
          flow.addEdge(1000 + i, e, 1, true);
        }

        console.log(flow.maxFlow());
      }
    };

    rl.on('line', processLine);
  });
};

main();