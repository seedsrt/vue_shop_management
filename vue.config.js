module.exports = {
    // 部署应用包时的基本 URL,用法和 webpack 本身的 output.publicPath 一致
    publicPath: './',
    // webpack相关配置
    chainWebpack: config => {
        //发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            config.set('externals', {
                'vue': 'Vue',
                'vue-router': 'VueRouter',
                'axios': 'axios',
                'lodash': '_',
                'echarts': 'echarts',
                'npeogress': 'NProgress',
                'vue-quill-editor': 'VueQuillEditor',
                'vue': 'Vue',
                'element-ui': 'ELEMENT',
                'element-ui': 'element-ui',
                'element-ui': 'ELEMENT',
                'moment': 'moment'
            })

            //新增自定义属性
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        //开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            //新增自定义属性
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })


    },
}