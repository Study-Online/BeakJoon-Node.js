const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let n;
let pv = 0;
let id = [];
let arr = [];
let v = [];

function p(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
}

function compareP(a, b) {
    if (a.x !== b.x) return a.x - b.x;
    return a.y - b.y;
}

function dfs(nd, d) {
    if (nd * 2 <= n) dfs(nd * 2, d + 1);
    id[nd] = pv;
    v.push(new p(d, pv++, 0));
    if (nd * 2 + 1 <= n) dfs(nd * 2 + 1, d + 1);
}

function main() {
    rl.question('', (input) => {
        n = parseInt(input.trim());
        dfs(1, 0);
        let ans = -1e9;
        
        rl.on('line', (line) => {
            let values = line.trim().split(' ').map(Number);
            for (let i = 1; i <= n; i++) {
                let t = values[i-1];
                v[id[i]].w = t;
                ans = Math.max(ans, t);
            }
            
            if (ans <= 0) {
                console.log(ans);
                process.exit(0);
            }
            
            ans = 0;
            for (let i = 0; i < 20; i++) {
                for (let j = i; j < 20; j++) {
                    let now = 0, mx = 0;
                    for (let k = 0; k < n; k++) {
                        if (v[k].x < i || v[k].x > j) continue;
                        now = Math.max(0, now + v[k].w);
                        mx = Math.max(mx, now);
                    }
                    ans = Math.max(ans, mx);
                }
            }
            
            console.log(ans);
            process.exit(0);
        });
    });
}

main();