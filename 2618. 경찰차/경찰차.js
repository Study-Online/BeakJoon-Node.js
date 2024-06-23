const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let input = [];
let N, W;
let dp = Array.from({ length: 1002 }, () => Array(1002).fill(0));
let eventPosition = Array.from({ length: 1002 }, () => [0, 0]);
rl.on('line', function (line) {
    input.push(line);
});
rl.on('close', function () {
    let idx = 0;
    N = parseInt(input[idx++]);
    W = parseInt(input[idx++]);
    for (let i = 1; i <= W; i++) {
        let [x, y] = input[idx++].split(' ').map(Number);
        eventPosition[i][0] = x;
        eventPosition[i][1] = y;
    }
    let sb = [];
    sb.push(solution(1, 0, 0).toString());
    let oneIdx = 0;
    let twoIdx = 0;
    for (let i = 1; i <= W; i++) {
        // Khoảng cách cảnh sát 1 di chuyển đến vị trí sự kiện thứ i
        let oneDistance = distance(1, oneIdx, i);
        if (dp[oneIdx][twoIdx] - oneDistance === dp[i][twoIdx]) {
            oneIdx = i;
            sb.push('1');
        } else {
            twoIdx = i;
            sb.push('2');
        }
    }
    console.log(sb.join('\n'));
});
function solution(eventIdx, oneIdx, twoIdx) {
    // Nếu chỉ số sự kiện tính toán vượt quá số lượng sự kiện
    if (eventIdx > W) {
        return 0;
    }
    // Nếu đã được tính toán
    if (dp[oneIdx][twoIdx] !== 0) {
        return dp[oneIdx][twoIdx];
    }
    let oneMoveCount = solution(eventIdx + 1, eventIdx, twoIdx) + distance(1, oneIdx, eventIdx);
    let twoMoveCount = solution(eventIdx + 1, oneIdx, eventIdx) + distance(2, twoIdx, eventIdx);
    // Chọn giá trị nhỏ hơn giữa việc cảnh sát 1 di chuyển hoặc cảnh sát 2 di chuyển
    return dp[oneIdx][twoIdx] = Math.min(oneMoveCount, twoMoveCount);
}
function distance(type, startIdx, endIdx) {
    let startPosition = getStartPosition(type, startIdx);
    // Khoảng cách giữa điểm bắt đầu và điểm kết thúc
    return Math.abs(startPosition[0] - eventPosition[endIdx][0]) +
           Math.abs(startPosition[1] - eventPosition[endIdx][1]);
}

function getStartPosition(type, idx) {
    // Nếu điểm bắt đầu là 0
    if (idx === 0) {
        // Nếu là cảnh sát 1
        if (type === 1) {
            return [1, 1];
        }
        // Nếu là cảnh sát 2
        return [N, N];
    }
    // Nếu điểm bắt đầu không phải là 0
    return eventPosition[idx];
}