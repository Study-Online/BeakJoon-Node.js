const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('', (t) => {
    rl.question('', (p) => {
        KMP(t, p);
        rl.close();
    });
});

// Hàm KMP
function KMP(parent, pattern) {
    let table = makeTable(pattern);
    
    let n1 = parent.length, n2 = pattern.length;
    let begin = 0, matched = 0;
    let cnt = 0;
    let sb = [];

    while (begin <= n1 - n2) {
        if (matched < n2 && parent.charAt(begin + matched) === pattern.charAt(matched)) {
            ++matched;
            if (matched === n2) {
                sb.push((begin + 1) + " ");
                cnt++;
            }
        } else {
            if (matched === 0) {
                ++begin;
            } else {
                begin += matched - table[matched - 1];
                matched = table[matched - 1];
            }
        }
    }

    console.log(cnt);
    console.log(sb.join(''));
}

// Hàm tạo bảng tiền xử lý (table)
function makeTable(pattern) {
    let n = pattern.length;
    let table = new Array(n).fill(0);
    let idx = 0;

    for (let i = 1; i < n; i++) {
        while (idx > 0 && pattern.charAt(i) !== pattern.charAt(idx)) {
            idx = table[idx - 1];
        }
        if (pattern.charAt(i) === pattern.charAt(idx)) {
            table[i] = ++idx;
        }
    }
    return table;
}