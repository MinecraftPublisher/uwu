const fs = require('fs')
console.log('using build.js bundler')
const requireTree = ((file = './uwu.js') => {
    const TEMPLATE = `(() => { __TEXT__ ;; return module.exports; })();;`
    return fs.readFileSync(file, 'utf8').replaceAll(/require\("\.\/[^"]+"\)/g, ((match) => {
        const BUILD = requireTree((match.replaceAll('require("', '').replaceAll('")', '') + '.js').replaceAll('.js.js', '.js')) + ';;'
        return TEMPLATE.replaceAll('__TEXT__', BUILD)
    })).replaceAll(/require\('\.\/[^']+'\)/g, ((match) => {
        const BUILD = requireTree((match.replaceAll('require(\'', '').replaceAll('\')', '') + '.js').replaceAll('.js.js', '.js')) + ';;'
        return TEMPLATE.replaceAll('__TEXT__', BUILD)
    }))
})

fs.writeFileSync('./uwu.min.js', requireTree())