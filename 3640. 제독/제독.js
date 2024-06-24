const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const INF = Number.MAX_SAFE_INTEGER;

// MinCost_MaxFlow class
class MinCostMaxFlow {
    constructor(N) {
        this.N = N;
        this.g = Array.from({ length: N }, () => []);
        this.dist = new Array(N).fill(0);
        this.pv = new Array(N).fill(0);
        this.pe = new Array(N).fill(0);
        this.inQ = new Array(N).fill(false);
    }

    clear() {
        for (let i = 0; i < this.N; i++) {
            this.g[i] = [];
        }
    }

    add_edge(u, v, cap, cost) {
        let u_idx = this.g[u].length;
        let v_idx = this.g[v].length;
        if (u === v) v_idx++;
        this.g[u].push({ to: v, rev: v_idx, cap: cap, cost: cost });
        this.g[v].push({ to: u, rev: u_idx, cap: 0, cost: -cost });
    }

    async SPFA(src, sink) {
        this.dist.fill(INF);
        this.inQ.fill(false);
        let q = [];

        this.dist[src] = 0;
        this.inQ[src] = true;
        q.push(src);

        while (q.length > 0) {
            let here = q.shift();
            this.inQ[here] = false;

            for (let i = 0; i < this.g[here].length; i++) {
                let edge = this.g[here][i];
                let there = edge.to;

                if (edge.cap > 0 && this.dist[there] > this.dist[here] + edge.cost) {
                    this.dist[there] = this.dist[here] + edge.cost;
                    this.pv[there] = here;
                    this.pe[there] = i;
                    if (!this.inQ[there]) {
                        this.inQ[there] = true;
                        q.push(there);
                    }
                }
            }
        }

        return this.dist[sink] !== INF;
    }

    async MCMF(src, sink) {
        let min_cost = 0;
        let max_flow = 0;

        while (await this.SPFA(src, sink)) {
            let flow = INF;
            for (let pos = sink; pos !== src; pos = this.pv[pos]) {
                flow = Math.min(flow, this.g[this.pv[pos]][this.pe[pos]].cap);
            }
            min_cost += this.dist[sink] * flow;
            max_flow += flow;

            for (let pos = sink; pos !== src; pos = this.pv[pos]) {
                let rev = this.g[this.pv[pos]][this.pe[pos]].rev;
                this.g[this.pv[pos]][this.pe[pos]].cap -= flow;
                this.g[pos][rev].cap += flow;
            }
        }

        return { min_cost, max_flow };
    }
}

// Process input
let input = '';

rl.on('line', (line) => {
    input += line + '\n';
}).on('close', () => {
    let lines = input.trim().split('\n');
    let index = 0;

    while (index < lines.length) {
        let [V, E] = lines[index++].split(' ').map(Number);
        let flo = new MinCostMaxFlow(2 * V + 2);

        flo.add_edge(0, 1, 2, 0); // set source

        for (let u = 1; u <= V; u++) {
            if (u === 1 || u === V) {
                flo.add_edge(u, u + V, 2, 0);
            } else {
                flo.add_edge(u, u + V, 1, 0);
            }
        }

        flo.add_edge(2 * V, 2 * V + 1, 2, 0); // set sink

        for (let e = 0; e < E; e++) {
            let [u, v, w] = lines[index++].split(' ').map(Number);
            flo.add_edge(u + V, v, 1, w);
        }

        flo.MCMF(0, 2 * V + 1).then(result => {
            console.log(result.min_cost);
        });
    }
});