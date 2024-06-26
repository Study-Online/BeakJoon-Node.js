const fs = require('fs');

// Reading input from stdin
const input = fs.readFileSync('/dev/stdin').toString().trim().split('\n');
const n = parseInt(input[0], 10);

const SIZE = 360000;

// Initialize arrays
const clock1 = new Array(SIZE * 2).fill(0);
const clock2 = new Array(SIZE).fill(0);

// Read the first set of clock positions
const clock1Positions = input[1].split(' ').map(Number);
for (let i = 0; i < n; i++) {
    const num = clock1Positions[i];
    clock1[num] = 1;
    clock1[SIZE + num] = 1; // Duplicate for circular check
}

// Read the second set of clock positions
const clock2Positions = input[2].split(' ').map(Number);
for (let i = 0; i < n; i++) {
    const num = clock2Positions[i];
    clock2[num] = 1;
}

// KMP algorithm
function kmp(c1, c2) {
    const table = makeTable(c2);
    let idx = 0;
    for (let i = 0; i < SIZE * 2; i++) {
        while (idx > 0 && c1[i] !== c2[idx]) {
            idx = table[idx - 1];
        }
        if (c1[i] === c2[idx]) {
            if (idx === SIZE - 1) {
                console.log("possible");
                return;
            } else {
                idx++;
            }
        }
    }
    console.log("impossible");
}

function makeTable(clock) {
    let idx = 0;
    const table = new Array(SIZE).fill(0);
    for (let i = 1; i < SIZE; i++) {
        while (idx > 0 && clock[i] !== clock[idx]) {
            idx = table[idx - 1];
        }
        if (clock[i] === clock[idx]) {
            table[i] = ++idx;
        }
    }
    return table;
}

kmp(clock1, clock2);