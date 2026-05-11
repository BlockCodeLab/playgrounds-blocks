import { Text } from '@blockcode/core';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const blocks = (meta) => [
  notArduino(meta) && {
    id: 'init',
    text: (
      <Text
        id="blocks.qmc5883l.init"
        defaultMessage="set pins SCL:[SCL] SDA:[SDA]"
      />
    ),
    inputs: {
      SCL: meta.boardPins
        ? { menu: meta.boardPins.all }
        : {
            type: 'integer',
            defaultValue: '2',
          },
      SDA: meta.boardPins
        ? { menu: meta.boardPins.all }
        : {
            type: 'integer',
            defaultValue: '3',
          },
    },
    mpy(block) {
      const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_NONE);
      const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_NONE);
      this.definitions_['import_i2c'] = `from machine import I2C`;
      this.definitions_['import_Pin'] = `from machine import Pin`;
      this.definitions_['qmc5883l'] = `_qmc5883l = qmc5883l.QMC5883L(I2C(1, scl=Pin(${scl}), sda=Pin(${sda})))`;
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
      const code = '_qmc5883l.heading()[0]';
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
      this.definitions_['include_qmc5883l'] = `#include <QMC5883LCompass.h>`;
      this.definitions_['variable_compass'] = `QMC5883LCompass compass;`;
      this.definitions_['setup_compass'] = `compass.init();`;
      this.definitions_['loop_compass'] = `compass.read();`;
      const code = `compass.get${xyz.toUpperCase()}()`;
      return [code];
    },
  },
];
