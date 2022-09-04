import { genMessage } from '../helper';
import enUS from 'vant/es/locale/lang/en-US';
const modulesFiles = require.context('./en', true, /\.ts$/);

const modules: any = {};

modulesFiles.keys().forEach((key) => {
  modules[key] = modulesFiles(key) || {};
});

// const modules = import.meta.globEager('./en/**/*.ts');
export default {
  message: {
    ...genMessage(modules, 'en'),
    ...enUS,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};
