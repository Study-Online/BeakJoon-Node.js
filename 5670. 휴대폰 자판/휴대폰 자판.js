const readline = require('readline');
// Định nghĩa lớp TrieNode
class TrieNode {
    constructor() {
        this.childNode = new Map();
        this.terminal = false;  // Đánh dấu kết thúc một từ
    }

    // Phương thức thêm từ vào Trie
    insert(word) {
        let trieNode = this;
        for (let i = 0; i < word.length; i++) {
            let c = word.charAt(i);
            if (!trieNode.childNode.has(c)) {
                trieNode.childNode.set(c, new TrieNode());
            }
            trieNode = trieNode.childNode.get(c);
            if (i === word.length - 1) {
                trieNode.terminal = true;  // Đánh dấu kết thúc từ
            }
        }
    }

    // Phương thức tính số lần gõ phím để auto hoàn thành
    autoModule(word) {
        let trieNode = this;
        let count = 0;
        for (let i = 0; i < word.length; i++) {
            let c = word.charAt(i);
            let node = trieNode.childNode.get(c);
            if (i === 0) {
                count++;
            } else if (trieNode.terminal || trieNode.childNode.size > 1) {
                count++;
            }
            trieNode = node;
        }
        return count;
    }
}

// Thiết lập đọc đầu vào từ console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

let input = [];

rl.on('line', function (line) {
    input.push(line);
});

rl.on('close', function () {
    let index = 0;
    while (index < input.length) {
        try {
            // Đọc số lượng từ
            let n = parseInt(input[index]);
            index++;
            let inputData = [];
            let trie = new TrieNode();
            
            // Đọc các từ và chèn vào Trie
            for (let i = 0; i < n; i++) {
                let str = input[index];
                index++;
                inputData.push(str);
                trie.insert(str);
            }

            // Tính số lần gõ phím trung bình
            let res = 0;
            for (let str of inputData) {
                res += trie.autoModule(str);
            }
            console.log((res / inputData.length).toFixed(2));
        } catch (error) {
            // Kết thúc nếu gặp lỗi
            return;
        }
    }
});