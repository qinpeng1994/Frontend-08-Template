/**
 * 词法分析，完善词法分析，正则表达式和其捕获关系
 * */ 
let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g  
let dictionary = ['Number', 'Whitespaces', 'LineTerminator', '*', '/', '+', '-']

function* tokenize(source){
    let result = null;
    let lastIndex = 0; // 判断匹配等
    while(true){
        lastIndex = regexp.lastIndex;
        result = regexp.exec(source);
        if(!result) 
            break;
        //取出来的lastIndex和新生成的lastIndex去做一个比较，如果长度超了，就说明里面有不认识的字符/格式
        if(regexp.lastIndex - lastIndex > result[0].length)
            break;

        //定义一个token的变量
        let token = {
            type:null,
            value:null
        } 
        //0是整个的正则，从1开始到1234567的范围里，匹配到哪一种输入元素，就打印出对应dictionary
        for(var i = 1; i <= dictionary.length; i++){
            if(result[i])
                //类型存下来
                token.type = dictionary[i - 1];
        }
        token.value = result[0];  //值存下来
        yield token;  //使用yield返回一个序列
    }
    yield { // 完善 终结符
        type:"EOF"
    }
}

//  LL语法分析
let source = [];

for(let token of tokenize("10 * 25")){
    if(token.type !== "Whitespace" && token.type !== "LineTerminator")
    source.push(token);
}

function Expression(token){
    if (source[0].type === 'Expression') {
        return source;
    }
    if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF') {
        let node = {
            type: 'Expression',
            children: [source.shift(), source.shift()],
        }
        source.unshift(node);
        return node;
    }
    AdditiveExpression(source);
    return Expression(source);
}

function AdditiveExpression(source){
    if (source[0].type === 'MultiplicativeExpression') {
        let node = {
            type: 'AdditiveExpression',
            children: [source[0]],
        }
        source[0] = node;
        return AdditiveExpression(source);
    }
    if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
        let node = {
            type: "AdditiveExpression",
            operator: '+',
            children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source); // 处理非终结符
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }
    if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '-') {
        let node = {
            type: "AdditiveExpression",
            operator: '-',
            children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }
    if (source[0].type === 'AdditiveExpression') {
        return source[0];
    }

    MultiplicativeExpression(source); // 先调
    return AdditiveExpression(source);
}
// "10 * 25"
function MultiplicativeExpression(source){
    // console.log(source);
    // numbner时
    if (source[0].type === 'Number') {
        let node = {
            type: "MultiplicativeExpression",
            children: [source[0]],
        }
        source[0] = node;
        return MultiplicativeExpression(source); // 递归
    }
    // *
    if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === '*') {
        let node = {
            type: "MultiplicativeExpression",
            operator: '*',
            children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }
    // /
    if (source[0].type === "MultiplicativeExpression" && source[1] && source[1].type === '/') {
        let node = {
            type: "MultiplicativeExpression",
            operator: '/',
            children: [],
        }
        node.children.push(source.shift());
        node.children.push(source.shift());
        node.children.push(source.shift());
        source.unshift(node);
        return MultiplicativeExpression(source);
    }
    if (source[0].type === "MultiplicativeExpression") {
        return source[0]; // 递归结束
    }
    return MultiplicativeExpression(source); // 不执行

}

// MultiplicativeExpression("10 * 25");
// 0: {type: "Number", value: "10"}
// 1: {type: "Whitespaces", value: " "}
// 2: {type: "*", value: "*"}
// 3: {type: "Whitespaces", value: " "}
// 4: {type: "Number", value: "25"}
// 5: {type: "EOF"}
// length: 6

// AdditiveExpression("10 * 25")