let pattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]
// let pattern = [0,0,0,0,0,0,0,0,0] // 也可以为数组表示 i*3+j
let color = 2
// 显示棋盘
function show() {
    let board = document.getElementById('board')
    board.innerHTML = ''
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let cell = document.createElement("div")
            cell.classList.add("cell");
            cell.innerText = pattern[i][j] === 2 ? 'x' : pattern[i][j] === 1 ? 'o' : '';
            cell.addEventListener('click', () => {
                userMove(j, i)
            })
            board.appendChild(cell);
        }
        board.appendChild(document.createElement("br"))
    }
}
// 移动
function userMove(x, y) {
    pattern[x][y] = color;
    if (check(pattern, color)) {
        alert(color == 2 ? "x is winner" : "o is winner");
    }
    color = 3 - color;

    show();
    computerMove();
}

function computerMove() {
    let choice = bestChoice(pattern, color);
    if (choice.point)
        pattern[choice.point[0]][choice.point[1]] = color;
    if (check(pattern, color)) {
        alert(color == 2 ? "x is winner" : "0 is winner");
    }
    color = 3 - color;

    show();
}
// 检查三行三列斜向
function check(pattern, color) {
    // 三横行
    for (let i = 0; i < 3; i++) { 
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j] !== color) {
                win = false;
            }
        }
        if (win)
            return true;
    }
    // 三纵列
    for (let i = 0; i < 3; i++) {
        let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[j][i] !== color) {
                win = false;
            }
        }
        if (win)
            return true;
    } {//  斜向横纵坐标相等
        let win = true;
        for (let j = 0; j < 3; j++) { 
            if (pattern[j][j] != color) {
                win = false;
            }
        }
        if (win)
            return true;
    } { // 斜向横纵坐标等于2
         let win = true;
        for (let j = 0; j < 3; j++) {
            if (pattern[j][2 - j] != color) {
                win = false;
            }
        }
        if (win)
            return true;
    }
    return false;

}

function clone(pattern) {
    return JSON.parse(JSON.stringify(pattern)); // 拷贝
    // return Object.create(pattern);//一维数组时以pattern为原型
}

function willWin(pattern, color) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j])
                continue;
            let tmp = clone(pattern);
            tmp[i][j] = color;
            if (check(tmp, color)) {
                return [i, j]; 
            }
        }
    }
    return null;
}
//最好的落子策略
function bestChoice(pattern, color) {
    let p;
    if (p = willWin(pattern, color)) {
        return {
            point: p,
            result: 1  // -1 0 1
        }
    }
    let result = -2; // 初始值
    let point = null;
    outer: for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (pattern[i][j])
                continue;
            let tmp = clone(pattern);
            tmp[i][j] = color; 
            let r = bestChoice(tmp, 3 - color).result; // 损耗较小
            if (-r > result) {
                result = -r;
                point = [i, j];
            }
            if (result == 1) // 胜负剪枝
                break outer;
        }
    }
    return {
        point: point,
        result: point ? result : 0
    }
}
show(pattern);