const display = document.getElementById('display')
const buttons = document.getElementById('buttons')

buttons.addEventListener('click', (e) => {
  if (!e.target.matches('button')) return

  const type = e.target.dataset.type
  const value = e.target.value

  switch (type) {
    case 'number':
      handleNumber(value)
      break
    case 'operator':
      handleOperator(value)
      break
    case 'decimal':
      handleDecimal()
      break
    case 'clear':
      clearDisplay()
      break
    case 'backspace':
      deleteChar()
      break
    case 'equals':
      calculateResult()
      break
  }
})

function handleNumber (num) {
  if (display.value === '0') {
    display.value = num
  } else {
    display.value += num
  }
}

function handleOperator (operator) {
  const lastChar = display.value.slice(-1)
  const operators = '+-*/%'

  if (display.value === '' && operator !== '-') return

  if (operators.includes(lastChar)) {
    display.value = display.value.slice(0, -1) + operator
  } else {
    display.value += operator
  }
}

function handleDecimal () {
  const parts = display.value.split(/[-+*/%]/)
  const currentPart = parts[parts.length - 1]

  if (!currentPart.includes('.')) {
    display.value += '.'
  }
}

function clearDisplay () {
  display.value = ''
}

function deleteChar () {
  display.value = display.value.slice(0, -1)
}

function calculateResult () {
  const expression = display.value.replace(/×/g, '*')

  try {
    const result = parseExpression(expression)
    display.value = Number.isInteger(result) ? result : result.toFixed(2)
  } catch {
    display.value = 'Error'
    setTimeout(clearDisplay, 1000)
  }
}

function parseExpression (expr) {
  const tokens = []
  let current = ''
  let isNegative = false

  for (const char of expr) {
    if ('+-*/%'.includes(char)) {
      if (current === '' && char === '-') {
        isNegative = true
      } else {
        if (current !== '') {
          tokens.push(isNegative ? -parseFloat(current) : parseFloat(current))
          isNegative = false
        }
        tokens.push(char)
        current = ''
      }
    } else {
      current += char
    }
  }
  
  if (current !== '') {
    tokens.push(isNegative ? -parseFloat(current) : parseFloat(current))
  }

  const processOperations = (ops) => {
    let i = 1
    while (i < tokens.length) {
      if (ops.includes(tokens[i])) {
        const operation = tokens[i]
        const left = tokens[i - 1]
        const right = tokens[i + 1]
        let result

        switch (operation) {
          case '*': result = left * right 
            break
          case '/': 
          if (right === 0) throw new Error()
            result = left / right
            break
          case '%': result = left % right
            break
          case '+': result = left + right
            break
          case '-': result = left - right
            break
        }

        tokens.splice(i - 1, 3, result)
        i = 0
      }
      i += 2
    }
  }

  processOperations(['*', '/', '%'])
  processOperations(['+', '-'])

  return tokens[0]
}
