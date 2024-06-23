const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let input = [];
rl.on('line', (line) => {
  input.push(line.trim());
}).on('close', () => {
  main(input);
});

let idx = 0;
let sccCnt = 0;
let discovered;
let sccId;
let list;
let stack;
let result;

function main(input) {
  const [v, e] = input[0].split(' ').map(Number);
  list = Array.from({ length: v + 1 }, () => []);
  discovered = Array(v + 1).fill(-1);
  sccId = Array(v + 1).fill(-1);

  for (let i = 1; i <= e; i++) {
    const [a, b] = input[i].split(' ').map(Number);
    list[a].push(b);
  }

  result = [];
  stack = [];

  for (let i = 1; i <= v; i++) {
    if (discovered[i] === -1) {
      scc(i);
    }
  }

  console.log(sccCnt);
  result.sort((a, b) => a[0] - b[0]);
  let sb = '';
  for (const q of result) {
    for (const node of q) {
      sb += node + ' ';
    }
    sb += '-1\n';
  }
  console.log(sb.trim());
}

function scc(cur) {
  discovered[cur] = idx++;
  stack.push(cur);

  let ret = discovered[cur];
  for (const nxt of list[cur]) {
    if (discovered[nxt] === -1) {
      ret = Math.min(ret, scc(nxt));
    } else if (sccId[nxt] === -1) {
      ret = Math.min(ret, discovered[nxt]);
    }
  }

  if (ret === discovered[cur]) {
    const q = [];
    while (true) {
      const t = stack.pop();
      q.push(t);
      sccId[t] = sccCnt;
      if (t === cur) break;
    }
    q.sort((a, b) => a - b);
    result.push(q);
    sccCnt++;
  }
  return ret;
}