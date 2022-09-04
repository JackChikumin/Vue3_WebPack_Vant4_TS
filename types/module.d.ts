declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const Component: DefineComponent<{}, {}, any>;
  export default Component;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'virtual:*' {
  const result: any;
  export default result;
}

declare module '*.js';
