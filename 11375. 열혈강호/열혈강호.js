const readline = require('readline');
// Khởi tạo giao diện đọc/ghi
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = [];

// Đọc toàn bộ input
rl.on('line', (line) => {
    input.push(line);
}).on('close', () => {
    solve(input);
});

function solve(input) {
    // Đọc N và M
    const [N, M] = input[0].split(' ').map(Number);
    
    // Tạo danh sách công việc của mỗi nhân viên
    const workers = Array.from({ length: N + 1 }, () => []);
    
    for (let i = 1; i <= N; i++) {
        const [_, ...jobs] = input[i].split(' ').map(Number);
        workers[i] = jobs;
    }
    
    const jobOwner = Array(M + 1).fill(0);    
    function canAssign(worker, visited) {
        for (const job of workers[worker]) {
            if (visited[job]) continue;
            visited[job] = true;
            if (jobOwner[job] === 0 || canAssign(jobOwner[job], visited)) {
                jobOwner[job] = worker;
                return true;
            }
        }
        return false;
    }
    
    let matchCount = 0;    
    for (let worker = 1; worker <= N; worker++) {
        if (canAssign(worker, Array(M + 1).fill(false))) {
            matchCount++;
        }
    }
    
    // In kết quả
    console.log(matchCount);
}