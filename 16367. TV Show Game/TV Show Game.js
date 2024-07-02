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
    const [k, n] = input[0].split(' ').map(Number);
    const queries = input.slice(1).map(line => {
        return line.split(' ').map((val, index) => {
            if (index % 2 === 0) return parseInt(val, 10);
            return val;
        });
    });

    // 2-SAT 문제를 그래프로 변환
    const graph = Array.from({ length: 2 * k }, () => []);
    const addImplication = (u, v) => {
        graph[u ^ 1].push(v); // ¬u -> v
        graph[v ^ 1].push(u); // ¬v -> u
    };

    for (let query of queries) {
        let [l1, c1, l2, c2, l3, c3] = query;
        
        // 맵핑: x -> 2 * (x - 1), ¬x -> 2 * (x - 1) + 1
        const toLiteral = (lamp, color) => (lamp - 1) * 2 + (color === 'R' ? 0 : 1);

        const literals = [
            toLiteral(l1, c1),
            toLiteral(l2, c2),
            toLiteral(l3, c3)
        ];

        // 두 개 이상의 조건을 만족해야 하므로, 다음의 간선 추가
        // ¬A -> B or C, ¬B -> A or C, ¬C -> A or B
        addImplication(literals[0], literals[1]);
        addImplication(literals[0], literals[2]);
        addImplication(literals[1], literals[0]);
        addImplication(literals[1], literals[2]);
        addImplication(literals[2], literals[0]);
        addImplication(literals[2], literals[1]);
    }

    // Kosaraju 알고리즘을 사용한 SCC 찾기
    let index = 0;
    const stack = [];
    const indexArray = Array(2 * k).fill(-1);
    const lowlink = Array(2 * k).fill(-1);
    const onStack = Array(2 * k).fill(false);
    let sccId = 0;
    const scc = Array(2 * k).fill(-1);

    const dfs = (v) => {
        indexArray[v] = lowlink[v] = index++;
        stack.push(v);
        onStack[v] = true;

        for (let w of graph[v]) {
            if (indexArray[w] === -1) {
                dfs(w);
                lowlink[v] = Math.min(lowlink[v], lowlink[w]);
            } else if (onStack[w]) {
                lowlink[v] = Math.min(lowlink[v], indexArray[w]);
            }
        }

        if (lowlink[v] === indexArray[v]) {
            while (true) {
                let w = stack.pop();
                onStack[w] = false;
                scc[w] = sccId;
                if (w === v) break;
            }
            sccId++;
        }
    };

    for (let i = 0; i < 2 * k; i++) {
        if (indexArray[i] === -1) {
            dfs(i);
        }
    }

    // 각 램프에 대해 모순 체크
    let possible = true;
    for (let i = 0; i < k; i++) {
        if (scc[2 * i] === scc[2 * i + 1]) {
            possible = false;
            break;
        }
    }

    if (!possible) {
        console.log("-1");
    } else {
        const result = Array(k);
        for (let i = 0; i < k; i++) {
            result[i] = (scc[2 * i] < scc[2 * i + 1]) ? 'R' : 'B';
        }
        console.log(result.join(''));
    }
});