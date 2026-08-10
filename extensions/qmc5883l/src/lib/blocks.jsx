import { Text } from '@blockcode/core';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);
const isIotBit = (meta) => meta.editor === '@emakefun/gui-iotbit';
const isIotBoard = (meta) => meta.boardType === 'ESP32_IOT_BOARD';

export const blocks = (meta) => [
  notArduino(meta) && {
    id: 'init',
    text: (
      <Text
        id="blocks.qmc5883l.init"
        defaultMessage="set QMC5883L pins SCL:[SCL] SDA:[SDA]"
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
      defs['qmc5883l'] = `_qmc5883l = qmc5883l.QMC5883L(${i2c})`;
      return '';
    },
  },
  {
    id: 'heading',
    text: (
      <Text
        id="blocks.qmc5883l.heading"
        defaultMessage="heading"
      />
    ),
    output: 'number',
    mpy(block) {
      const code = '_qmc5883l.heading()';
      return [code];
    },
    ino(block) {
      this.definitions_['include_qmc5883l'] = `#include <QMC5883LCompass.h>`;
      this.definitions_['variable_compass'] = `QMC5883LCompass compass;`;
      this.definitions_['setup_compass'] = `compass.init();`;
      this.definitions_['loop_compass'] = `compass.read();`;
      const code = `compass.getAzimuth()`;
      return [code];
    },
  },
  {
    id: 'yaw',
    text: (
      <Text
        id="blocks.qmc5883l.yaw"
        defaultMessage="yaw"
      />
    ),
    output: 'number',
    mpy(block) {
      const code = '_qmc5883l.get_yaw()';
      return [code];
    },
    ino(block) {
      this.definitions_['include_qmc5883l'] = `#include <QMC5883LCompass.h>`;
      this.definitions_['include_math'] = `#include <math.h>`;
      this.definitions_['variable_compass'] = `QMC5883LCompass compass;`;
      this.definitions_['setup_compass'] = `compass.init();`;
      this.definitions_['loop_compass'] = `compass.read();`;
      const code = `round(atan2(compass.getY(), compass.getX()) * 180.0 / 3.14159265358979323846)`;
      return [code];
    },
  },
  {
    id: 'xyz',
    text: (
      <Text
        id="blocks.qmc5883l.xyz"
        defaultMessage="[XYZ] value"
      />
    ),
    output: 'number',
    inputs: {
      XYZ: {
        menu: ['x', 'y', 'z'],
      },
    },
    mpy(block) {
      const xyz = block.getFieldValue('XYZ');
      const code = `_qmc5883l.read()[${xyz === 'x' ? 0 : xyz === 'y' ? 1 : 2}]`;
      return [code];
    },
    ino(block) {
      const xyz = block.getFieldValue('XYZ');
      this.definitions_['include_qmc5883l'] = `#include <QMC5883LCompass.h>`;
      this.definitions_['variable_compass'] = `QMC5883LCompass compass;`;
      this.definitions_['setup_compass'] = `compass.init();`;
      this.definitions_['loop_compass'] = `compass.read();`;
      const code = `compass.get${xyz.toUpperCase()}()`;
      return [code];
    },
  },
];
