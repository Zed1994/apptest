import 'amfe-flexible/index.js';
// import { zs } from '@zyb-data/stats-pc';
// 导入公共样式
import '@yzfe/svgicon/lib/svgicon.css';
// 12px
document.body.style.fontSize = '0.09375rem';
// const urlReg = RegExp(/^.*(suanshubang|localhost).*$/);

// const environment = urlReg.test(window.location.host);

// zs.config({
//   zpID: 'ZHKT-ZKAT-C', // 测试业务线
//   plat: 'zkatPC', // 由大数据产品经理统一分配
//   debug: false, // 项目上线时需要更改此处为false
//   env: !environment ? 'production' : 'development', // 项目上线时需要更改此处为'production'
//   logUrl: !environment
//     ? 'https://autotrack.yunsizhixue.com/log/zhkt_h5'
//     : 'https://autotrack.yunsizhixue.com/log/zhkt_h5_test'
// });

// zs.init();

import('./App');
