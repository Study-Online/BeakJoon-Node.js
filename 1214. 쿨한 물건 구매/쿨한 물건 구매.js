const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function solution(D, P, Q) {
    if (D % P === 0 || D % Q === 0) return D;

    [P, Q] = P > Q ? [P, Q] : [Q, P]; // P > Q
    let maxPCount = Math.floor(D / P) + 1; // Số lượng lớn nhất của P để P*n lớn hơn hoặc bằng D
    let answer = P * maxPCount; // Chi phí tối thiểu trong trường hợp trên

    for (let i = maxPCount - 1; i >= 0; i--) { // Duyệt từ n-1 đến 0
        let remainingCost = D - (i * P);
        let div = Math.floor(remainingCost / Q);
        let mod = remainingCost % Q; // Chia chi phí còn lại cho Q, lấy phần nguyên và phần dư
        if (mod === 0) return D;
        let currentMinCost = (i * P) + ((div + 1) * Q); // Chi phí tối thiểu cho i
        if (answer === currentMinCost) break; // Nếu answer lặp lại, kết thúc vòng lặp
        answer = Math.min(answer, currentMinCost); // Cập nhật chi phí tối thiểu
    }

    return answer;
}

// Đọc đầu vào
rl.question('', (line) => {
    let [D, P, Q] = line.split(' ').map(Number);
    let result = solution(D, P, Q);
    console.log(result);
    rl.close();
});