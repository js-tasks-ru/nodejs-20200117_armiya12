function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Аргументы не являются числами');
  }
  return a + b;
}

module.exports = sum;
