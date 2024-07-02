const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = [];
rl.on('line', (line) => {
    input.push(line);
});

rl.on('close', () => {
    let idx = 0;
    const N = parseInt(input[idx++]);
    const A = input[idx++].split(' ').map(Number);
    const M = parseInt(input[idx++]);
    const queries = [];

    for (let i = 0; i < M; i++) {
        const [l, r] = input[idx++].split(' ').map(Number);
        queries.push({ l: l - 1, r: r - 1, index: i });
    }

    const sqrtN = Math.floor(Math.sqrt(N));
    queries.sort((a, b) => {
        const blockA = Math.floor(a.l / sqrtN);
        const blockB = Math.floor(b.l / sqrtN);
        if (blockA === blockB) {
            return a.r - b.r;
        } else {
            return blockA - blockB;
        }
    });

    const result = new Array(M).fill(0);
    const count = new Array(1000001).fill(0);
    let currentL = 0, currentR = 0, uniqueCount = 0;

    const add = (pos) => {
        count[A[pos]]++;
        if (count[A[pos]] === 1) {
            uniqueCount++;
        }
    };

    const remove = (pos) => {
        count[A[pos]]--;
        if (count[A[pos]] === 0) {
            uniqueCount--;
        }
    };

    add(0);

    for (const { l, r, index } of queries) {
        while (currentR < r) {
            add(++currentR);
        }
        while (currentR > r) {
            remove(currentR--);
        }
        while (currentL < l) {
            remove(currentL++);
        }
        while (currentL > l) {
            add(--currentL);
        }
        result[index] = uniqueCount;
    }

    console.log(result.join('\n'));
});