const { join } = require('path');
// 时间戳
const TimeStamp = new Date().getTime();
const Packages = require('./public/manifest.json');
const { defineConfig } = require('@vue/cli-service');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 压缩lodash,减小体积
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// 编译后文件压缩
const FileManagerPlugin = require('filemanager-webpack-plugin');

// 生产环境
const isProduction = Object.is(process.env.NODE_ENV, 'production');
// 是否为打包APP
const isApp = Object.is(process.env.VUE_APP_MODEL, 'true');

const resolve = (dir) => {
  return join(__dirname, dir);
};

// 获取文件名
const getFileNames = () => {
  return `${process.env.VUE_APP_SHORT_NAME}.${Packages.platform_code}.${Packages.version.name}.${TimeStamp}`;
};

// 编译生成文件目录
let BuildFile = `./m/m`;
// 发布资源压缩目录
let Compression = './m';
// APP资源推送压缩包名称
let AppOTA = `update_${Packages.platform_code}_V${Packages.version.name}_release.wgt`;
// Web发布资源压缩包名称
let WebZip = `${Packages.platform_code}.zip`;

const getExternals = () => {
  if (!isApp) {
    Compression = './m';
    return {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vant: 'Vant',
      'crypto-js': 'CryptoJS',
      vuex: 'Vuex',
    };
  } else {
    BuildFile = './app';
    Compression = './app';
    return {};
  }
};

// 基础编译配置
const externals = getExternals();

// 基础CDN
const JS_CDN = [];

// 网页 CDN
if (!isApp) {
  JS_CDN.splice(
    0,
    0,
    'https://cdn.jsdelivr.net/npm/vue@3.2.31/dist/vue.global.min.js',
    'https://cdn.jsdelivr.net/npm/vue-router@4.0.14/dist/vue-router.global.min.js',
    'https://cdn.jsdelivr.net/npm/vant@4.0.0-alpha.0/lib/vant.min.js',
    'https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.js',
    'https://cdn.jsdelivr.net/npm/vuex@4.0.2/dist/vuex.global.min.js',
  );
}

// 网页 css CDN
const CSS_CDN = !isApp ? ['https://cdn.jsdelivr.net/npm/vant@4.0.0-alpha.0/lib/index.css'] : [];

const cdn = {
  css: CSS_CDN,
  js: JS_CDN,
};

module.exports = defineConfig({
  transpileDependencies: true,
  // 文件路径
  publicPath: process.env.VUE_APP_PUBLIC_PATH ?? './',
  // 编译输出文件夹路劲或名称
  outputDir: BuildFile,
  // 静态文件目录
  assetsDir: 'assets',
  // 入口html文件
  indexPath: 'index.html',
  // 对文件名启用hash
  filenameHashing: true,
  // 检测代码
  lintOnSave: true,
  // 运行时编译
  runtimeCompiler: true,
  //生产环境是否构建map文件
  productionSourceMap: false,
  // 构建时开启多进程处理babel编译
  parallel: require('os').cpus().length > 1,
  // 配置
  configureWebpack: (config) => {
    const result = {
      externals: externals,
      output: {
        filename: `js/[name].${getFileNames()}.js`,
        chunkFilename: `js/[name].${getFileNames()}.js`,
      },
      plugins: [
        new CompressionWebpackPlugin({
          // 压缩输出的文件格式
          algorithm: process.env.VUE_APP_BUILD_COMPRESS,
          // 需要压缩的文件格式
          test: /\.(js|css|png|jpg|svg|gif)(\?.*)?$/i,
          // 超过设定值进行压缩 默认50kb
          threshold: 51200,
          // 压缩率
          minRatio: 1,
        }),
      ],
    };

    if (isProduction) {
      result.plugins.push(
        new FileManagerPlugin({
          events: {
            onEnd: {
              archive: [
                {
                  source: Compression,
                  destination: `${Compression}/${isApp ? AppOTA : WebZip}`,
                  format: 'zip',
                },
              ],
              copy: [
                { source: `${BuildFile}/${isApp ? AppOTA : WebZip}`, destination: Compression },
              ],
            },
          },
        }),
      );
    }

    return result;
  },
  chainWebpack: (config) => {
    // 配置文件路径
    config.resolve.alias
      .set(/@\//, resolve('src'))
      .set(/#\//, resolve('types'))
      // 处理i18n控制台报错
      .set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js');

    // cdn
    config.plugin('html').tap((args) => {
      args[0].cdn = cdn;
      return args;
    });

    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
    config.plugin('loadshReplace').use(new LodashModuleReplacementPlugin()); //优化lodash
  },
  // css配置
  css: {
    // 将css提取为一个独立的文件
    extract: {
      filename: `css/[name].${getFileNames()}.css`,
      chunkFilename: `css/[name].${getFileNames()}.css`,
    },
    // 是否生成map文件
    sourceMap: false,
  },
  // 请求代理配置
  devServer: {
    // 是否启用https
    // https: true,
    // 是否在启动后通过浏览器打开
    open: false,
    // 端口号
    port: new Date().getFullYear(),
    // 是否开启模块热更新
    // hotOnly: true,
    // 代理域名
    proxy: process.env.VUE_APP_PROXY_URL[0][1],
  },
});
