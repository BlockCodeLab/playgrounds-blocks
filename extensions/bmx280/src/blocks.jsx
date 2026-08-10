import { Text } from '@blockcode/core';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);
const isIotBit = (meta) => meta.editor === '@emakefun/gui-iotbit';
const isIotBoard = (meta) => meta.boardType === 'ESP32_IOT_BOARD';

export const blocks = (meta) => [
  {
    id: 'addr',
    hidden: notArduino(meta),
    text: (
      <Text
        id="blocks.bmx280.addr"
        defaultMessage="set I2C address [ADDR]"
      />
    ),
    inputs: {
      ADDR: {
        menu: [
          ['0×76', '0x76'],
          ['0×77', '0x77'],
        ],
      },
    },
    ino(block) {
      const addr = block.getFieldValue('ADDR');
      this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
      this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
      this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C(${addr});`;
      return '';
    },
  },
  notArduino(meta) && {
    id: 'init',
    text: (
      <Text
        id="blocks.bmx280.init"
        defaultMessage="set BMx280 pins SCL:[SCL] SDA:[SDA] I2C address [ADDR]"
      />
    ),
    inputs: {
      SCL: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? 'P19' : isIotBoard(meta) ? '22' : '2',
          }
        : {
            type: 'integer',
            defaultValue: '2',
          },
      SDA: meta.boardPins
        ? {
            menu: meta.boardPins.all,
            defaultValue: isIotBit(meta) ? 'P20' : isIotBoard(meta) ? '21' : '3',
          }
        : {
            type: 'integer',
            defaultValue: '3',
          },
      ADDR: {
        menu: [
          ['0×76', '0x76'],
          ['0×77', '0x77'],
        ],
      },
    },
    mpy(_, args, defs) {
      const pins = meta.boardPins;
      const chan = pins?.i2c && pins.i2c.scl === args.SCL && pins.i2c.sda === args.SDA ? pins.i2c.channel : 1;
      const i2c = `i2c${chan}_${args.SCL}_${args.SDA}`;

      defs['import_pin'] = `from machine import Pin`;
      defs['import_i2c'] = `from machine import I2C`;
      defs[i2c] = `${i2c} = I2C(${chan}, scl=Pin(${args.SCL}), sda=Pin(${args.SDA}))`;
      defs['bmx280'] = `_bmx280 = bmx280.BMx280(${i2c}, ${args.ADDR})`;

      let bmxCode = '';
      bmxCode += 'def get_bmx280_value(mode=2):\n';
      bmxCode += '  _bmx280.read()\n';
      bmxCode += '  if mode == 1: return _bmx280.temperature\n';
      bmxCode += '  if mode == 2: return _bmx280.pressure\n';
      bmxCode += '  if mode == 3: return _bmx280.humidity\n';
      bmxCode += '  if mode == 4: return _bmx280.altitude\n';
      defs[`get_bmx280_value`] = bmxCode;

      return '';
    },
  },
  '---',
  {
    id: 'pressure',
    text: (
      <Text
        id="blocks.bmx280.pressure"
        defaultMessage="pressure(hPa)"
      />
    ),
    output: 'number',
    ino(block) {
      this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
      this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
      if (!this.definitions_[`setup_bmx280`]) {
        this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C();`;
      }

      let bmxCode = '';
      bmxCode += 'float getBMx280Value(int mode) {\n';
      bmxCode += '  float T, P_hPa, H;\n';
      bmxCode += '  _bmx280.read280(T, P_hPa, H);\n';
      bmxCode += '  return mode == 1 ? T : (mode == 2 ? P_hPa : (mode == 3 && _bmx280.hasHumidity() ? H : 0.0));\n';
      bmxCode += '}';
      this.definitions_[`declare_getBMx280Value`] = `float getBMx280Value(int mode = 2);`;
      this.definitions_[`getBMx280Value`] = bmxCode;

      return ['getBMx280Value()', this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      return ['get_bmx280_value()', this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'altitude',
    text: (
      <Text
        id="blocks.bmx280.altitude"
        defaultMessage="altitude"
      />
    ),
    output: 'number',
    ino(block) {
      this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
      this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
      if (!this.definitions_[`setup_bmx280`]) {
        this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C();`;
      }
      return ['_bmx280.readAltitude()', this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      this.definitions_[`get_bmx280_value`] = bmxCode;
      return ['get_bmx280_value(4)', this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'temperature',
    text: (
      <Text
        id="blocks.bmx280.temperature"
        defaultMessage="temperature"
      />
    ),
    output: 'number',
    ino(block) {
      this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
      this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
      if (!this.definitions_[`setup_bmx280`]) {
        this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C();`;
      }

      let bmxCode = '';
      bmxCode += 'float getBMx280Value(int mode) {\n';
      bmxCode += '  float T, P_hPa, H;\n';
      bmxCode += '  _bmx280.read280(T, P_hPa, H);\n';
      bmxCode += '  return mode == 1 ? T : (mode == 2 ? P_hPa : (mode == 3 && _bmx280.hasHumidity() ? H : 0.0));\n';
      bmxCode += '}';
      this.definitions_[`declare_getBMx280Value`] = `float getBMx280Value(int mode = 2);`;
      this.definitions_[`getBMx280Value`] = bmxCode;

      return ['getBMx280Value(1)', this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      return ['get_bmx280_value(1)', this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'humidity',
    text: (
      <Text
        id="blocks.bmx280.humidity"
        defaultMessage="humidity"
      />
    ),
    output: 'number',
    ino(block) {
      this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
      this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
      if (!this.definitions_[`setup_bmx280`]) {
        this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C();`;
      }

      let bmxCode = '';
      bmxCode += 'float getBMx280Value(int mode) {\n';
      bmxCode += '  float T, P_hPa, H;\n';
      bmxCode += '  _bmx280.read280(T, P_hPa, H);\n';
      bmxCode += '  return mode == 1 ? T : (mode == 2 ? P_hPa : (mode == 3 && _bmx280.hasHumidity() ? H : 0.0));\n';
      bmxCode += '}';
      this.definitions_[`declare_getBMx280Value`] = `float getBMx280Value(int mode = 2);`;
      this.definitions_[`getBMx280Value`] = bmxCode;

      return ['getBMx280Value(3)', this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      return ['get_bmx280_value(3)', this.ORDER_FUNCTION_CALL];
    },
  },
];
