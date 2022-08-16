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
require(require('fs').existsSync('./l.min.js') ? './l.min' : './l')
    (require('fs').readFileSync(
        process.argv[2] 
        || th("BRUH!!!! NO FILE EXIST!!!!!"),
        'utf-8'), 
        {}, 
        true
);;
console.log('---------');;
console.log('took: ' + ((+new Date()) - startTime) + 'ms');;