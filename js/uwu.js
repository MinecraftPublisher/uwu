const EXTENSIONS = require('./extensions')

console._log = console.log
console.log = (...args) => {
    const MAPPED = args.map(arg => {
        try {
            if(typeof arg === typeof {}) {
                return JSON.stringify(arg)
            } else {
                return arg.toString()
            }
        } catch (e) {
            return arg.toString()
        }
    })
    console._log(MAPPED.join(', ').replaceAll('\n', '\x1B[30m\x1B[47m\\n\x1B[49m\x1B[39m'))
    if(MAPPED.join(', ').replaceAll('\n', '') !== MAPPED.join(', ')) console.warn('|_ WARNING: Nyewwinye chawactews awe pwesent. *notices buldge*')
}

const BUILTIN_FUNCTIONS = EXTENSIONS.LIST()

const uwu = module.exports = ((code, variables = {}, version = false, uwufier) => {
    if(version) {
        console.log('u-using ' + __filename.split('/').pop().split('.js')[0] + ' as intewpwetew (・`ω´・)')
        console.log('---------')
    }
    /* line seperator and QoL */
    let lines = code.replaceAll('\n    ', ' ')
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
        while(line.startsWith(' ') || line.startsWith('\n')) line = line.substring(1)
        if(chain) line = line.replaceAll('<|>', () => {
            return chain.length === 1 ? chain[0] : chain.pop().value
        }).replaceAll(/<var:.+>/g, ((match) => {
            return variables[match.substring(5, match.length - 1)]
        }))
        let command = line.split(' ')[0]
        let args = line.substring(command.length + 1)
        let result = undefined

        /* find wtf to do */
        if (BUILTIN_FUNCTIONS[command]) {
            result = BUILTIN_FUNCTIONS[command](uwu, args, variables, i, uwufier)
        } else if (variables['dev_' + command]) {
            result = variables['dev_' + command](uwu, args, variables, i, uwufier)
        } else {
            console.log('Command nyot found: ' + command + ' at winye ' + i + ': ' + line)
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
                    case 'merge':
                        variables = {...variables, ...g.value}
                        break
                    default:
                        console.log('Unknyown function w-wesuwt type: ' + g.type + ' at winye ' + i + ': ' + line)
                        break
                }
            })
        }
    }

    return variables
})