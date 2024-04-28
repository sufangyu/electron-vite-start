import {
  ANGULAR_DEVTOOLS,
  APOLLO_CLIENT_TOOLS,
  BACKBONE_DEBUGGER,
  EMBER_INSPECTOR,
  JQUERY_DEBUGGER,
  MOBX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  VUEJS_DEVTOOLS
} from '@tomjs/electron-devtools-installer';

export const extensionTypeMap = {
  /** Angular DevTools */
  ANGULAR_DEVTOOLS: ANGULAR_DEVTOOLS,
  /** Apollo Client Devtools */
  APOLLO_CLIENT_TOOLS: APOLLO_CLIENT_TOOLS,
  /** Backbone Debugger */
  BACKBONE_DEBUGGER: BACKBONE_DEBUGGER,
  /** Ember Inspector */
  EMBER_INSPECTOR: EMBER_INSPECTOR,
  /** jQuery Debugger */
  JQUERY_DEBUGGER: JQUERY_DEBUGGER,
  /** MobX DevTools */
  MOBX_DEVTOOLS: MOBX_DEVTOOLS,
  /** React Developer Tools */
  REACT_DEVELOPER_TOOLS: REACT_DEVELOPER_TOOLS,
  /** Redux DevTools */
  REDUX_DEVTOOLS: REDUX_DEVTOOLS,
  /** Vue.js DevTools */
  VUEJS_DEVTOOLS: VUEJS_DEVTOOLS
};
