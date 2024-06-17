const readline = require('readline');
// Create interface for reading input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to handle the main logic
const main = () => {
    rl.question('', (N) => {
        N = parseInt(N);
        let dp = new Array(1001).fill(0);

        for (let x = 2; x <= N; x++) {
            let s = new Set();
            for (let y = 0; y <= x - 2; y++) {
                s.add(dp[y] ^ dp[x - 2 - y]);
            }
            while (s.has(dp[x])) {
                dp[x]++;
            }
        }
        console.log(dp[N] ? 1 : 2);
        
        rl.close();
    });
};

// Run the main function
main();