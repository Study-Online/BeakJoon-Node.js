const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SIZE = 1000001;
let tree = new Array(SIZE * 4).fill(0);

let input = [];
rl.on('line', (line) => {
  input.push(line.trim());
}).on('close', () => {
  main(input);
});

// Hàm chính để xử lý các thao tác truy vấn và cập nhật
function main(input) {
  const n = parseInt(input[0]);
  let output = [];
  for (let i = 1; i <= n; i++) {
    let [op, a, b] = input[i].split(' ').map(Number);
    if (op === 1) {
      const candy = query(1, SIZE, 1, a);
      output.push(candy);
    } else {
      update(1, SIZE, 1, a, b);
    }
  }
  console.log(output.join('\n'));
}

// Hàm truy vấn để tìm giá trị kẹo ngọt tại vị trí `target`
function query(s, e, idx, target) {
  if (s === e) {
    update(1, SIZE, 1, s, -1);
    return s;
  }
  
  const mid = Math.floor((s + e) / 2);
  if (target <= tree[idx * 2]) {
    return query(s, mid, idx * 2, target);
  } else {
    return query(mid + 1, e, idx * 2 + 1, target - tree[idx * 2]);
  }
}

// Hàm cập nhật số lượng kẹo ngọt tại vị trí `target` với giá trị `dif`
function update(s, e, idx, target, dif) {
  if (target < s || e < target) return;
  
  tree[idx] += dif;
  if (s === e) return;
  
  const mid = Math.floor((s + e) / 2);
  update(s, mid, idx * 2, target, dif);
  update(mid + 1, e, idx * 2 + 1, target, dif);
}