import mqtt from './mqtt.py';

// 打包 umqtt.simple 到设备端的 lib/umqtt/simple.py，
// 避免依赖固件是否内置该库（以及版本差异，如 password= / pswd= 参数）。
export const files = [
  {
    common: true,
    name: 'umqtt/simple.py',
    uri: mqtt,
  },
];
