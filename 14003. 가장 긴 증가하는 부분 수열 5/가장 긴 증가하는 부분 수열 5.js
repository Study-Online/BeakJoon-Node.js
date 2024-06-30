const readline = require('readline');

// 입력 처리
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let input = [];

rl.on('line', (line) => {
    input.push(line);
    if (input.length === 2) {
        rl.close();
    }
});

rl.on('close', () => {
    let nums = input[1].split(' ').map(Number);

    // 이진 검색 함수
    function binarySearch(arr, num) {
        let low = -1;
        let high = arr.length;

        while (low + 1 < high) {
            let mid = Math.floor((low + high) / 2);
            if (num > arr[mid]) {
                low = mid;
            } else {
                high = mid;
            }
        }
        return high;
    }

    let lisArr = [-1000000001];
    let lisTotal = [[-1000000001, 0]]; // [number, index]

    // 역순으로 배열을 처리하여 스택처럼 사용
    nums.reverse();

    while (nums.length > 0) {
        let num = nums.pop();

        if (num > lisArr[lisArr.length - 1]) {
            lisTotal.push([num, lisArr.length]);
            lisArr.push(num);
        } else {
            let idx = binarySearch(lisArr, num);
            lisArr[idx] = num;
            lisTotal.push([num, idx]);
        }
    }

    let lisLength = lisArr.length - 1;
    let lis = [];

    while (lisTotal.length > 0 && lisLength > 0) {
        let [num, idx] = lisTotal.pop();
        if (idx === lisLength) {
            lis.push(num);
            lisLength--;
        }
    }

    console.log(lis.length);
    console.log(lis.reverse().join(' '));
});