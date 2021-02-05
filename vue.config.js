module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: {
            '/api':{
                target: 'http://mall-pre.springboot.cn',
                changeOrigin: true,
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    },
    //按需加载 productionSourceMap: true代表在本地开发时 暴露源码方便调试  在打包时设为false,在线上环境不会暴露源码
    productionSourceMap: true,
    //防止一次性加载所有文件
    chainWebpack: (config) => {
        config.plugins.delete('prefetch');
    }
}