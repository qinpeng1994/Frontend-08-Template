/**
 * 1、正则表达式表示词法分析
 * */   
// 圆括号表示捕获
let regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g  
let dictionary = ['Number', 'Whitespaces', 'LineTerminator', '*', '/', '+', '-']

function tokenize(source) {
  let  result = null
  while(true) {
    result = regexp.exec(source)
    if (!result) break
    for (var i = 1; i <= dictionary.length; i++) {
      if (result[i])
        console.log(dictionary[i-1])
        // Number  Whitespaces +  Whitespaces  Number Whitespaces * Whitespaces Number
    }
  }
}

tokenize('1024 + 10 * 25')