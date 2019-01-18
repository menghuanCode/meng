let curry = function (fn) {
  let len = fn.length
  return function _c(...x) {
    return len <= x.length ? fn.apply(this, x)
      : function (...y) {
          return _c(...x.concat(y))
      }
  }
}

let add = curry(function (x, y) {
  return x + y
})

