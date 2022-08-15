const EXTENSIONS = require('./extensions')

const BUILTIN_FUNCTIONS = {
    ...EXTENSIONS.IO,
    ...EXTENSIONS.FUNCTIONS,
    ...EXTENSIONS.OPERATORS,
    ...EXTENSIONS.FS,
}

const l = module.exports = ((code, variables = {}) => {
    /* line seperator and QoL */
    let lines = code.replaceAll('\n    ', '')
    /* fix indentation issues with line breaks */
    .replaceAll(/\^ *\n/g, '^').replaceAll(/ {0,1}\^ {0,1}/g, '^')
    /* break the lines */
    .split('^')
    /* filter out empty lines */
    .filter(e => e.replaceAll(' ', '') !== '')

    let chain = []
    for (let i = 0; i < lines.length; i++) {
        /* line stuff */
        let line = lines[i]
        if(chain) line = line.replaceAll('<|>', () => {
            return chain.length === 1 ? chain[0] : chain.pop().value
        })
        let command = line.split(' ')[0]
        let args = line.substring(command.length + 1)
        let result = undefined

        /* find wtf to do */
        if (BUILTIN_FUNCTIONS[command]) {
            result = BUILTIN_FUNCTIONS[command](args, variables, i)
        } else if (variables['dev_' + command]) {
            result = variables['dev_' + command](args, variables, i)
        } else {
            console.log('Command not found: ' + command + ' at line ' + i + ': ' + line)
        }

        /* reset chaining and check return types */
        chain = []

        /* result parsing from functions */
        if(result) {
            result.forEach((g) => {
                switch(g.type) {
                    case 'variable':
                        variables[g.name] = g.value
                        break
                    case 'line':
                        i = g.value
                        break
                    case 'chain':
                        chain.push(g.value)
                        break
                    default:
                        console.log('Unknown function result type: ' + g.type + ' at line ' + i + ': ' + line)
                        break
                }
            })
        }
    }
})