const path = require(`path`)

module.exports = {
  configureWebpack: {
    resolve: {
        symlinks: false,
        alias: {
            vue: path.resolve(`./node_modules/vue`)
        }
    }
  },
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ]
}
