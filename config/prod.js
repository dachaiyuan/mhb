var path = require('path');

module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  alias: {
    "~": path.resolve(__dirname, '..',"src"),
  },
  defineConstants: {
  },
  weapp: {
    compile: {
      exclude: ['src/components/f2-canvas']
    }
  },
  h5: {}
}
