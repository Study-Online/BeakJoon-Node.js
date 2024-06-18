// Import the necessary modules
const readline = require('readline');

// Create an interface for reading input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Manacher's algorithm to find the longest palindromic substring
function manachers(S) {
    let s = "";
    for (let c of S) {
        s += `#${c}`;
    }
    s += '#';
    
    const len = s.length;
    const A = new Array(len).fill(0);
    let r = 0, p = 0;
    
    for (let i = 0; i < len; i++) {
        if (i <= r) {
            A[i] = Math.min(r - i, A[2 * p - i]);
        } else {
            A[i] = 0;
        }
        
        while (i - A[i] - 1 >= 0 && i + A[i] + 1 < len && s[i - A[i] - 1] === s[i + A[i] + 1]) {
            A[i]++;
        }
        
        if (r < i + A[i]) {
            r = i + A[i];
            p = i;
        }
    }
    
    return A;
}

// Read input string and process using the Manacher's algorithm
rl.question('', (input) => {
    const S = input.trim();
    const A = manachers(S);
    let ans = 0;
    for (let x of A) {
        ans += Math.floor((x + 1) / 2);
    }
    console.log(ans);

    // Close the input stream
    rl.close();
});