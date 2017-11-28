// Utils
const el = (id) => window.document.getElementById(id)

// Generic compose function (Who needs lodash, am I right?)
const compose = (...fns) => fns.reduceRight((g, f) => (...args) => f(g(...args)))
const trace = (message) => f => {
  console.log(message,f)
  return f
}

export {
  el,
  compose,
  trace
}
