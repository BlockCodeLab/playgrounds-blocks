import { Text } from '@blockcode/core';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);
const isIotBit = (meta) => meta.editor === '@emakefun/gui-iotbit';
const isIotBoard = (meta) => meta.boardType === 'ESP32_IOT_BOARD';

export const blocks = (meta) => [
  notArduino(meta) && {
    id: 'init',
    text: (
      <Text
        id="blocks.mpu6050.init"
        defaultMessage="set pins SCL:[SCL] SDA:[SDA]"
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
    },
    mpy(_, args, defs) {
      const pins = meta.boardPins;
      const chan = pins?.i2c && pins.i2c.scl === args.SCL && pins.i2c.sda === args.SDA ? pins.i2c.channel : 1;
      const i2c = `i2c${chan}_${args.SCL}_${args.SDA}`;

      defs['import_pin'] = `from machine import Pin`;
      defs['import_i2c'] = `from machine import I2C`;
      defs[i2c] = `${i2c} = I2C(${chan}, scl=Pin(${args.SCL}), sda=Pin(${args.SDA}))`;
      this.definitions_['mpu6050'] = `_mpu6050 = mpu6050.MPU6050(${i2c})`;
      return '';
    },
  },
  {
    id: 'acceleration',
    text: (
      <Text
        id="blocks.mpu6050.acceleration"
        defaultMessage="acceleration [XYZ]"
      />
    ),
    output: 'number',
    inputs: {
      XYZ: {
        menu: ['x', 'y', 'z'],
      },
    },
    mpy(_, args) {
      const code = `_mpu6050.read()["a"][${args.XYZ === 'x' ? 0 : args.XYZ === 'y' ? 1 : 2}]`;
      return [code];
    },
    ino(_, args, defs) {
      defs['variable_mpu6050'] = `Mpu6050 mpu6050;`;
      defs['setup_mpu6050'] = `mpu6050.Setup();`;
      defs['loop_mpu6050'] = `mpu6050.UpdateMotionInfo();`;
      const code = `mpu6050.GetAcceleration().${args.XYZ}`;
      return [code];
    },
  },
  {
    id: 'gravity',
    text: (
      <Text
        id="blocks.mpu6050.gravity"
        defaultMessage="gravity [XYZ]"
      />
    ),
    output: 'number',
    inputs: {
      XYZ: {
        menu: ['x', 'y', 'z'],
      },
    },
    mpy(_, args) {
      const code = `_mpu6050.read()["g"][${args.XYZ === 'x' ? 0 : args.XYZ === 'y' ? 1 : 2}]`;
      return [code];
    },
    ino(_, args, defs) {
      defs['variable_mpu6050'] = `Mpu6050 mpu6050;`;
      defs['setup_mpu6050'] = `mpu6050.Setup();`;
      defs['loop_mpu6050'] = `mpu6050.UpdateMotionInfo();`;
      const code = `mpu6050.GetGravity().${args.XYZ}`;
      return [code];
    },
  },
  {
    id: 'pitch',
    text: (
      <Text
        id="blocks.mpu6050.pitch"
        defaultMessage="pitch"
      />
    ),
    output: 'number',
    mpy() {
      const code = `_mpu6050.get_pitch()`;
      return [code];
    },
    ino(_, args, defs) {
      defs['variable_mpu6050'] = `Mpu6050 mpu6050;`;
      defs['setup_mpu6050'] = `mpu6050.Setup();`;
      defs['loop_mpu6050'] = `mpu6050.UpdateMotionInfo();`;
      const code = `mpu6050.GetEuler().pitch`;
      return [code];
    },
  },
  {
    id: 'roll',
    text: (
      <Text
        id="blocks.mpu6050.roll"
        defaultMessage="roll"
      />
    ),
    output: 'number',
    mpy() {
      const code = `_mpu6050.get_roll()`;
      return [code];
    },
    ino(_, args, defs) {
      defs['variable_mpu6050'] = `Mpu6050 mpu6050;`;
      defs['setup_mpu6050'] = `mpu6050.Setup();`;
      defs['loop_mpu6050'] = `mpu6050.UpdateMotionInfo();`;
      const code = `mpu6050.GetEuler().roll`;
      return [code];
    },
  },
];
