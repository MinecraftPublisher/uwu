const fs = require('fs')
const path = require('path')
const MODULES = module.exports = {
    LIST: () => {
        return {
            ...MODULES.IO,
            ...MODULES.FUNCTIONS,
            ...MODULES.OPERATORS,
            ...MODULES.FS,
            ...MODULES.VARIABLES,
            ...MODULES.JOKE,
        }
    },
    IO: {
        'log': (uwu, ...args) => {
            console.log(args[0])
            return [
                {
                    type: 'chain',
                    value: args[0]
                }
            ]
        },
        'clear': () => {
            console.clear()
        }
    },
    FUNCTIONS: {
        'dev': (uwu, ...args) => {
            let name = args[0].split(' ')[0]
            let newText = args[0].substring(name.length + 1).replaceAll(/ {0,1}@ {0,1}/g, '@').split('@').join(' ^ ')
            return [
                {
                    type: 'variable',
                    name: 'dev_' + name,
                    value: (uwu, args, variables) => {
                        return [
                            {
                                type: 'merge',
                                value: uwu(newText, variables)
                            }
                        ]
                    }
                }
            ]
        },
        'find': (uwu, ...args) => {
            let name = args[0]
            let uwu_code = fs.readFileSync(path.join(process.cwd(), name), 'utf8')
            return [
                {
                    type: 'variable',
                    name: 'dev_' + name.split('/').pop().replaceAll('.l', ''),
                    value: (uwu, args, variables) => {
                        return [
                            {
                                type: 'merge',
                                value: uwu(uwu_code, variables)
                            }
                        ]
                    }
                }
            ]
        },
        'chain': (uwu, ...args) => {
            return [
                {
                    type: 'chain',
                    value: args[0]
                }
            ]
        },
        'eval': (uwu, ...args) => {
            return [
                {
                    type: 'chain',
                    value: uwu(args[0].replaceAll(/ {0,1}@ {0,1}/g, '@').split('@').join(' ^ '), args[1])
                }
            ]
        }
    },
    OPERATORS: {
        'tryint': (uwu, ...args) => {
            let value = parseInt(args[0])
            if (isNaN(value)) {
                return [
                    {
                        type: 'chain',
                        value: args[0]
                    }
                ]
            } else {
                return [
                    {
                        type: 'chain',
                        value: value
                    }
                ]
            }
        },
        'add': (uwu, ...args) => {
            let _args = args[0].replaceAll(/ {0,1}\+ {0,1}/g, '+').split('+').map(e => MODULES.OPERATORS.tryint(l, e)[0].value)
            return [
                {
                    type: 'chain',
                    value: _args[0] + _args[1]
                }
            ]
        },
        'subtract': (uwu, ...args) => {
            let _args = args[0].replaceAll(/ {0,1}\- {0,1}/g, '-').split('-').map(e => MODULES.OPERATORS.tryint(l, e)[0].value)
            return [
                {
                    type: 'chain',
                    value: _args[0] - _args[1]
                }
            ]
        },
        'multiply': (uwu, ...args) => {
            let _args = args[0].replaceAll(/ {0,1}\* {0,1}/g, '*').split('*').map(e => MODULES.OPERATORS.tryint(l, e)[0].value)
            return [
                {
                    type: 'chain',
                    value: _args[0] * _args[1]
                }
            ]
        },
        'divide': (uwu, ...args) => {
            let _args = args[0].replaceAll(/ {0,1}\/ {0,1}/g, '/').split('/').map(e => MODULES.OPERATORS.tryint(l, e)[0].value)
            return [
                {
                    type: 'chain',
                    value: _args[0] / _args[1]
                }
            ]
        }
    },
    FS: {
        'book': (uwu, ...args) => {
            let operation = args[0].split(' ')[0]
            let data = args[0].substring(operation.length + 1).replaceAll(/ {0,1}\@ {0,1}/g, '@').split('@')
            switch (operation) {
                case 'read':
                    return [
                        {
                            type: 'chain',
                            value: fs.readFileSync(path.join(process.cwd(), data[0]), 'utf8')
                        }
                    ]
                case 'write':
                    fs.writeFileSync(path.join(process.cwd(), data[0]), data[1])
                    break
                case 'append':
                    fs.appendFileSync(path.join(process.cwd(), data[0]), data[1])
                    break
                case 'delete':
                    fs.unlinkSync(path.join(process.cwd(), data[0]))
                    break
                default:
                    console.log('Invalid book operation ' + operation + ' at line ' + args[1] + ': ' + args[0])
                    break
            }
        }
    },
    VARIABLES: {
        'var': (uwu, ...args) => {
            let name = args[0].replaceAll(/ {0,1}@ {0,1}/g, '@').split('@')[0]
            let newText = args[0].substring(name.length + 1).replaceAll(/ {0,1}\@ {0,1}/g, '@').split('@')[1]
            return [
                {
                    type: 'variable',
                    name: name,
                    value: newText
                }
            ]
        },
        'get': (uwu, ...args) => {
            return [
                {
                    type: 'chain',
                    value: args[1][args[0]]
                }
            ]
        },
        'delete': (uwu, ...args) => {
            delete args[1][args[0]]
            return [
                {
                    type: 'chain',
                    value: args[1]
                }
            ]
        }
    },
    JOKE: {
        'uwu': (uwu, ...args) => {
            console.log('uwu')
            return [
                {
                    type: 'chain',
                    value: 'uwu'
                }
            ]
        }
    }
}