// ...existing code...
const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let first = null;
let operator = null;
let waitingForSecond = false;

const opSymbols = {
  '+': '+',
  '-': '−',
  '*': '×',
  '/': '÷'
};

function updateDisplay(value) {
  display.value = String(value).slice(0, 20);
}

function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  if (isNaN(a) || isNaN(b)) return b;
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 'Error' : a / b;
    default: return b;
  }
}

keys.addEventListener('click', e => {
  const btn = e.target;
  if (!btn.classList.contains('btn')) return;

  const val = btn.getAttribute('data-value');
  const action = btn.getAttribute('data-action');

  if (val !== null) { // number or dot
    if (waitingForSecond) {
      updateDisplay(val === '.' ? '0.' : val);
      waitingForSecond = false;
    } else {
      if (val === '.' && display.value.includes('.')) return;
      updateDisplay(display.value === '0' && val !== '.' ? val : display.value + val);
    }
    return;
  }

  // actions
  if (action === 'clear') {
    updateDisplay('0');
    first = null;
    operator = null;
    waitingForSecond = false;
    return;
  }

  if (action === 'neg') {
    if (display.value && display.value !== '0') updateDisplay(String(parseFloat(display.value) * -1));
    return;
  }

  if (action === 'percent') {
    if (display.value) updateDisplay(String(parseFloat(display.value) / 100));
    return;
  }

  if (action === '=') {
    if (operator && first !== null && !waitingForSecond) {
      const result = calculate(first, display.value, operator);
      updateDisplay(result);
      first = null;
      operator = null;
      waitingForSecond = true;
    }
    return;
  }

  // operator (+ - * /)
  if (['+', '-', '*', '/'].includes(action)) {
    if (operator && !waitingForSecond) {
      // chain calculation
      const result = calculate(first, display.value, operator);
      updateDisplay(result);
      first = String(result);
    } else if (waitingForSecond) {
      // user is changing operator before entering second number
      operator = action;
      updateDisplay(first + ' ' + opSymbols[action]);
      return;
    } else {
      first = display.value;
    }
    operator = action;
    waitingForSecond = true;
    // show the first number with the operator symbol
    updateDisplay(first + ' ' + opSymbols[action]);
  }
});

// keyboard support
window.addEventListener('keydown', e => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    document.querySelector(`[data-value="${e.key}"]`)?.click();
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    document.querySelector(`.btn[data-action="${e.key}"]`)?.click();
  } else if (e.key === 'Enter' || e.key === '=') {
    document.querySelector('.btn[data-action="="]')?.click();
    e.preventDefault();
  } else if (e.key === 'Backspace') {
    // simple backspace
    if (!waitingForSecond) updateDisplay(display.value.slice(0, -1) || '0');
  } else if (e.key.toLowerCase() === 'c') {
    document.querySelector('.btn[data-action="clear"]')?.click();
  }
});
// ...existing code...