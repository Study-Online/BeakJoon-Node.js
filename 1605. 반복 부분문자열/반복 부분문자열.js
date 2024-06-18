const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let n;
let input = [];

rl.on('line', (line) => {
    input.push(line);
    if (input.length === 2) {
        n = parseInt(input[0]);
        const text = input[1];
        const suffixArray = getSuffixArray(text);
        const maxLength = getLongestSubStrLen(text, suffixArray);
        console.log(maxLength);
        rl.close();
    }
});

class CompUsingT {
    constructor(t, group) {
        this.t = t;
        this.group = group;
    }

    changeValues(t, group) {
        this.t = t;
        this.group = group;
    }

    compare(o1, o2) {
        if (this.group[o1] !== this.group[o2]) {
            return this.group[o1] - this.group[o2];
        }

        let left = o1 + this.t, right = o2 + this.t;
        if (left >= n) left = n;
        if (right >= n) right = n;
        
        return this.group[left] - this.group[right];
    }
}

function getSuffixArray(text) {
    let t = 1;
    const sa = Array.from({length: n}, (_, i) => i);
    let group = new Array(n + 1).fill(0).map((_, i) => i < n ? text.charCodeAt(i) - 'a'.charCodeAt(0) : -1);
    
    let comp = new CompUsingT(t, group);
    while (t < n) {
        sa.sort((a, b) => comp.compare(a, b));

        t *= 2;
        if (t >= n) break;

        const nGroup = new Array(n + 1).fill(0);
        nGroup[n] = -1;

        for (let i = 1; i < n; i++) {
            if (comp.compare(sa[i - 1], sa[i]) < 0) {
                nGroup[sa[i]] = nGroup[sa[i - 1]] + 1;
            } else {
                nGroup[sa[i]] = nGroup[sa[i - 1]];
            }
        }
        group = nGroup;
        comp.changeValues(t, group);
    }
    return sa;
}

function getLongestSubStrLen(text, sa) {
    const lcp = new Array(n - 1).fill(0);
    const isa = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
        isa[sa[i]] = i;
    }

    let max = 0;
    let h = 0;

    for (let i = 0; i < n; i++) {
        const k = isa[i];
        if (k === n - 1) continue;

        const j = sa[k + 1];
        while (i + h < n && j + h < n) {
            if (text[i + h] !== text[j + h]) break;
            h++;
        }
        lcp[k] = h;
        max = Math.max(max, h);
        if (h > 0) {
            h -= 1;
        }
    }
    return max;
}