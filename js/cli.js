#!/usr/bin/env node
/* YIPEE!!! */
const startTime = +new Date();;
(
    require('fs').existsSync('./build.js') ? require('./build') && console.log('---------') : ''
);;
const th = ((str) => { 
    console.error(str);;
    console.log('---------');;
    process.exit(69);;
});;
require(require('fs').existsSync('./uwu.min.js') ? './uwu.min' : './uwu')
    (require('fs').readFileSync(
        process.argv[2] 
        || th("I can't find the x3 intewpwetew (・`ω´・) daddy~ Couwd you show me the x3 w-way t-to find i-it in the x3 bedwoom?!!"),
        'utf-8'), 
        {}, 
        true
);;
console.log('---------');;
console.log('T-T-Took: ' + ((+new Date()) - startTime) + ' miwiseconds');;