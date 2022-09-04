import { genMessage } from '../helper';
import zhCN from 'vant/es/locale/lang/zh-CN';

const modulesFiles = require.context('./zh-CN', true, /\.ts$/);

const modules: any = {};

modulesFiles.keys().forEach((key) => {
  modules[key] = modulesFiles(key) || {};
});
//const modules = import.meta.globEager('./zh-CN/**/*.ts');
export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    ...zhCN,
  },
};
