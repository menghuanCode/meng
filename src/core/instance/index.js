function Vue(options) {
  if (process.env.NODE_ENV !== 'production' &&
  !(this instanceof Vue)) {
    console.warn('Vue is a constructot and should be called with the `new` keyword')
  }

  this._init(options)
}

export default Vue
