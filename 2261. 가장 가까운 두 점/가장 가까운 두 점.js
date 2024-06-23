const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];
rl.on('line', (line) => {
    input.push(line.trim());
    if (input.length > 1 && input.length - 1 === parseInt(input[0])) {
        rl.close();
    }
});

rl.on('close', () => {
    const n = parseInt(input[0]);
    const points = input.slice(1).map(line => line.split(' ').map(Number));
    // Hàm tính khoảng cách bình phương giữa hai điểm
    const distSq = (p1, p2) => {
        return (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2;
    };

    // Hàm tìm khoảng cách gần nhất giữa các cặp điểm trong dải
    const stripClosest = (strip, d) => {
        let minDist = d;
        strip.sort((a, b) => a[1] - b[1]); // Sắp xếp theo tọa độ y

        for (let i = 0; i < strip.length; i++) {
            for (let j = i + 1; j < strip.length && (strip[j][1] - strip[i][1]) ** 2 < minDist; j++) {
                minDist = Math.min(minDist, distSq(strip[i], strip[j]));
            }
        }
        return minDist;
    };

    // Hàm tìm khoảng cách gần nhất giữa các cặp điểm bằng chia để trị
    const closestUtil = (points, left, right) => {
        if (right - left <= 3) {
            let minDist = Infinity;
            for (let i = left; i <= right; i++) {
                for (let j = i + 1; j <= right; j++) {
                    minDist = Math.min(minDist, distSq(points[i], points[j]));
                }
            }
            return minDist;
        }
        const mid = Math.floor((left + right) / 2);
        const midPoint = points[mid];
        const dl = closestUtil(points, left, mid);
        const dr = closestUtil(points, mid + 1, right);
        let d = Math.min(dl, dr);
        const strip = [];
        for (let i = left; i <= right; i++) {
            if ((points[i][0] - midPoint[0]) ** 2 < d) {
                strip.push(points[i]);
            }
        }
        return Math.min(d, stripClosest(strip, d));
    };
    points.sort((a, b) => a[0] - b[0]); // Sắp xếp theo tọa độ x
    const result = closestUtil(points, 0, n - 1);
    console.log(result);
});