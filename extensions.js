const fs = require('fs')
const path = require('path')
const MODULES = module.exports = {
    IO: {
        'log': (l, ...args) => {
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
        'dev': (l, ...args) => {
            let name = args[0].split(' ')[0]
            let newText = args[0].substring(name.length + 1).replaceAll(/ {0,1}@ {0,1}/g, '@').split('@').join(' ^ ')
            return [
                {
                    type: 'variable',
                    name: 'dev_' + name,
                    value: () => {
                        return [
                            {
                                type: 'merge',
                                value: l(newText, args[1])
                            }
                        ]
                    }
                }
            ]
        },
        'find': (l, ...args) => {
            let name = args[0]
            let l_code = fs.readFileSync(path.join(process.cwd(), name), 'utf8')
            return [
                {
                    type: 'variable',
                    name: 'dev_' + name.split('/').pop().replaceAll('.l', ''),
                    value: () => {
                        return [
                            {
                                type: 'merge',
                                value: l(l_code, args[1])
                            }
                        ]
                    }
                }
            ]
        }
    },
    OPERATORS: {
        'tryint': (l, ...args) => {
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
        'add': (l, ...args) => {
            let _args = args[0].replaceAll(/ {0,1}\+ {0,1}/g, '+').split('+').map(e => MODULES.OPERATORS.tryint(e)[0].value)
            return [
                {
                    type: 'chain',
                    value: _args[0] + _args[1]
                }
            ]
        },
        'subtract': (l, ...args) => {
            let _args = args[0].replaceAll(/ {0,1}\- {0,1}/g, '-').split('-').map(e => MODULES.OPERATORS.tryint(e)[0].value)
            return [
                {
                    type: 'chain',
                    value: _args[0] - _args[1]
                }
            ]
        },
        'multiply': (l, ...args) => {
            let _args = args[0].replaceAll(/ {0,1}\* {0,1}/g, '*').split('*').map(e => MODULES.OPERATORS.tryint(e)[0].value)
            return [
                {
                    type: 'chain',
                    value: _args[0] * _args[1]
                }
            ]
        },
        'divide': (l, ...args) => {
            let _args = args[0].replaceAll(/ {0,1}\/ {0,1}/g, '/').split('/').map(e => MODULES.OPERATORS.tryint(e)[0].value)
            return [
                {
                    type: 'chain',
                    value: _args[0] / _args[1]
                }
            ]
        }
    },
    FS: {
        'book': (l, ...args) => {
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
    }
}