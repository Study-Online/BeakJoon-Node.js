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
    const M = parseInt(input[0]);
    const queries = input.slice(1).map(line => line.split(' ').map(Number));

    class TrieNode {
        constructor() {
            this.children = {};
            this.count = 0; // To keep track of the number of elements with this prefix
        }
    }

    class Trie {
        constructor() {
            this.root = new TrieNode();
        }

        insert(num) {
            let node = this.root;
            for (let i = 30; i >= 0; i--) { // Considering 31 bits to represent numbers up to 10^9
                const bit = (num >> i) & 1;
                if (!node.children[bit]) {
                    node.children[bit] = new TrieNode();
                }
                node = node.children[bit];
                node.count++;
            }
        }

        remove(num) {
            let node = this.root;
            for (let i = 30; i >= 0; i--) {
                const bit = (num >> i) & 1;
                if (node.children[bit]) {
                    node = node.children[bit];
                    node.count--;
                }
            }
        }

        maxXOR(num) {
            let node = this.root;
            let maxXor = 0;
            for (let i = 30; i >= 0; i--) {
                const bit = (num >> i) & 1;
                const toggledBit = bit ^ 1;
                if (node.children[toggledBit] && node.children[toggledBit].count > 0) {
                    maxXor |= (1 << i);
                    node = node.children[toggledBit];
                } else if (node.children[bit] && node.children[bit].count > 0) {
                    node = node.children[bit];
                } else {
                    break;
                }
            }
            return maxXor;
        }
    }

    const trie = new Trie();
    trie.insert(0); // We start with a zero in the trie as specified in the problem
    const results = [];

    for (const query of queries) {
        const type = query[0];
        const x = query[1];
        if (type === 1) {
            trie.insert(x);
        } else if (type === 2) {
            trie.remove(x);
        } else if (type === 3) {
            results.push(trie.maxXOR(x));
        }
    }

    console.log(results.join('\n'));
});