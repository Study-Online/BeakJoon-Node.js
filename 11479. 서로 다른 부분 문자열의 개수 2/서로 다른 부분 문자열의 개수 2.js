const readline = require('readline');

// Create an interface for reading input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to read a single line of input
function readLine() {
    return new Promise((resolve) => {
        rl.on('line', (line) => {
            resolve(line.trim());
        });
    });
}

// SuffixArray class to compute suffix array and LCP array
class SuffixArray {
    constructor(s) {
        this.str = s;
        this.sz = s.length;
        this.sa = [];
        this.rank = [];
        this.tmpRank = [];
        this.lcp = [];
        this.make_sa();
        this.make_lcp();
    }

    make_sa() {
        this.sa = Array.from({ length: this.sz }, (_, i) => i);
        this.rank = Array.from({ length: this.sz + 1 }, (_, i) => i < this.sz ? this.str.charCodeAt(i) - 'a'.charCodeAt(0) : -1);
        this.tmpRank = Array(this.sz + 1).fill(-1);

        for (let cmpLen = 1; cmpLen < this.sz; cmpLen <<= 1) {
            this.sa.sort((x, y) => {
                if (this.rank[x] === this.rank[y]) {
                    return (x + cmpLen < this.sz ? this.rank[x + cmpLen] : -1) - (y + cmpLen < this.sz ? this.rank[y + cmpLen] : -1);
                }
                return this.rank[x] - this.rank[y];
            });

            this.tmpRank[this.sa[0]] = 0;
            for (let i = 1; i < this.sz; i++) {
                if (this.rank[this.sa[i - 1]] !== this.rank[this.sa[i]] || (this.sa[i - 1] + cmpLen < this.sz ? this.rank[this.sa[i - 1] + cmpLen] : -1) !== (this.sa[i] + cmpLen < this.sz ? this.rank[this.sa[i] + cmpLen] : -1)) {
                    this.tmpRank[this.sa[i]] = this.tmpRank[this.sa[i - 1]] + 1;
                } else {
                    this.tmpRank[this.sa[i]] = this.tmpRank[this.sa[i - 1]];
                }
            }
            this.rank = [...this.tmpRank];
        }
    }

    make_lcp() {
        this.lcp = Array(this.sz).fill(0);
        this.rank = Array(this.sz).fill(0);

        for (let i = 0; i < this.sz; i++) {
            this.rank[this.sa[i]] = i;
        }

        let len = 0;
        for (let i = 0; i < this.sz; i++) {
            if (this.rank[i] > 0) {
                const j = this.sa[this.rank[i] - 1];
                while (i + len < this.sz && j + len < this.sz && this.str[i + len] === this.str[j + len]) {
                    len++;
                }
                this.lcp[this.rank[i]] = len;
                if (len > 0) len--;
            }
        }
    }

    get_sa() {
        return this.sa;
    }

    get_lcp() {
        return this.lcp;
    }
}

// Main function to read input and execute the algorithm
async function main() {
    const S = await readLine();
    const suffixArray = new SuffixArray(S);
    const sa = suffixArray.get_sa();
    const lcp = suffixArray.get_lcp();
    const sz = S.length;

    let ans = 0;
    for (let i = 0; i < sz; i++) {
        ans += (sz - sa[i]) - lcp[i];
    }
    console.log(ans);
    rl.close();
}

main();