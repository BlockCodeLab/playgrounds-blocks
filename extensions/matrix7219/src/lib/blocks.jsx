import { batch } from '@preact/signals';
import { setMeta, addAsset, delAsset, openPromptModal, Text, translate } from '@blockcode/core';
import { createFontWithCStyle, createFontWithPythonStyle } from './font-creator';
import styles from './font-creator.module.css';

const isIotBit = (meta) => meta.editor === '@blockcode/gui-iotbit';

export const blocks = (meta) => [
  {
    button: 'FONT_CREATOR',
    text: (
      <Text
        id="blocks.matrix7219.fontCreator"
        defaultMessage="Font Creator"
      />
    ),
    onClick() {
      return new Promise((resolve) => {
        openPromptModal({
          title: (
            <Text
              id="blocks.matrix7219.fontCreator"
              defaultMessage="Font Creator"
            />
          ),
          label: (
            <Text
              id="blocks.matrix7219.fontCreatorLabel"
              defaultMessage="Enter the non-English characters to add to the fonts: (max {count})"
              count={127}
            />
          ),
          body: (
            <textarea
              id="matrix7219_font_creator"
              rows="5"
              maxLength="127"
              className={styles.textInput}
              placeholder={translate('blocks.matrix7219.fontCreatorPlaceholder', 'Enter characters...')}
            >
              {meta.users?.fonts?.trim() ?? ''}
            </textarea>
          ),
          onSubmit() {
            const isArduino = meta.editor === '@blockcode/gui-arduino';
            const fontMap = document.getElementById('matrix7219_font_creator').value;

            const fonts = fontMap
              ? isArduino
                ? createFontWithCStyle(fontMap)
                : createFontWithPythonStyle(fontMap)
              : {
                  map: [],
                  content: '',
                };

            batch(() => {
              setMeta({
                users: {
                  ...(meta.users ?? {}),
                  fonts: fonts.map.join(''),
                },
              });
              if (isArduino) {
                fontMap
                  ? addAsset({
                      id: 'user_fonts.h',
                      name: 'user_fonts',
                      type: 'text/x-c',
                      content: fonts.content,
                    })
                  : delAsset('user_fonts.h');
              } else {
                fontMap
                  ? addAsset({
                      id: '/lib/user_fonts/matrix7219',
                      name: 'user_fonts',
                      type: 'text/x-python',
                      content: fonts.content,
                    })
                  : delAsset('/lib/user_fonts/matrix7219');
              }
              resolve(true);
            });
          },
        });
      });
    },
  },
  {
    id: 'init',
    text: (
      <Text
        id="blocks.matrix7219.init"
        defaultMessage="set pins CLK[CLK] DIN[DIN] CS[CS]"
      />
    ),
    inputs: {
      CLK: isIotBit(meta)
        ? { menu: 'iotOutPins', defaultValue: 'P5' }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      DIN: isIotBit(meta)
        ? { menu: 'iotOutPins', defaultValue: 'P6' }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
      CS: isIotBit(meta)
        ? { menu: 'iotOutPins', defaultValue: 'P7' }
        : {
            type: 'positive_integer',
            defaultValue: 4,
          },
    },
    ino(block) {
      const clk = this.valueToCode(block, 'CLK', this.ORDER_NONE);
      const din = this.valueToCode(block, 'DIN', this.ORDER_NONE);
      const cs = this.valueToCode(block, 'CS', this.ORDER_NONE);
      const devices = this.definitions_['variable_matrix7219_devices']?.replace('// MAX7219 devices: ', '') || 1;
      delete this.definitions_['variable_matrix7219_devices'];
      this.definitions_['variable_matrix7219'] = `Matrix7219 _matrix7219(${clk}, ${din}, ${cs}, ${devices});`;
      return '';
    },
    mpy(block) {
      const clk = isIotBit(meta) ? block.getFieldValue('CLK') : this.valueToCode(block, 'CLK', this.ORDER_NONE);
      const din = isIotBit(meta) ? block.getFieldValue('DIN') : this.valueToCode(block, 'DIN', this.ORDER_NONE);
      const cs = isIotBit(meta) ? block.getFieldValue('CS') : this.valueToCode(block, 'CS', this.ORDER_NONE);
      const devices = this.definitions_['matrix7219_devices']?.replace('# MAX7219 devices: ', '') || 1;
      delete this.definitions_['matrix7219_devices'];
      this.definitions_['matrix7219'] = `_matrix7219 = matrix7219.Matrix7219(${clk}, ${din}, ${cs}, ${devices})`;
      return '';
    },
  },
  {
    id: 'devices',
    text: (
      <Text
        id="blocks.matrix7219.devices"
        defaultMessage="set matrix devices [NUM]"
      />
    ),
    inputs: {
      NUM: {
        type: 'positive_integer',
        defaultValue: '1',
      },
    },
    ino(block) {
      const devices = this.valueToCode(block, 'NUM', this.ORDER_NONE);

      if (this.definitions_['variable_matrix7219']) {
        this.definitions_['variable_matrix7219'] = this.definitions_['variable_matrix7219'].replace(
          /\d+\);$/,
          `${devices});`,
        );
      } else {
        this.definitions_['variable_matrix7219_devices'] = `// MAX7219 devices: ${devices}`;
      }

      return '';
    },
    mpy(block) {
      const devices = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      if (this.definitions_['matrix7219']) {
        this.definitions_['matrix7219'] = this.definitions_['matrix7219'].replace(/\d+\)$/, `${devices})`);
      } else {
        this.definitions_['matrix7219_devices'] = `# MAX7219 devices: ${devices}`;
      }
      return '';
    },
  },
  '---',
  {
    id: 'display',
    text: (
      <Text
        id="blocks.matrix7219.display"
        defaultMessage="display [MATRIX] on device [IDX]"
      />
    ),
    inputs: {
      MATRIX: {
        shadow: 'matrix88',
        defaultValue: '0000000001100110111111111111111111111111011111100011110000011000',
      },
      IDX: {
        type: 'positive_integer',
        defaultValue: 1,
      },
    },
    ino(block) {
      const idx = this.getAdjusted(block, 'IDX');
      const matrix = this.valueToCode(block, 'MATRIX', this.ORDER_NONE);
      const code = `_matrix7219.showMatrix(${idx}, (byte[]){${matrix}});\n`;
      return code;
    },
    mpy(block) {
      const idx = this.getAdjusted(block, 'IDX');
      const matrix = this.valueToCode(block, 'MATRIX', this.ORDER_NONE);
      let code = ``;
      code += `_matrix7219.show_matrix(${idx}, b"${matrix}")\n`;
      return code;
    },
  },
  {
    // 8x8点阵灯
    id: 'matrix88',
    shadow: true,
    output: 'string',
    inputs: {
      MATRIX: {
        type: 'matrix',
        width: 8,
        height: 8,
      },
    },
    ino(block) {
      const matrix = block.getFieldValue('MATRIX');
      const frame = [];
      for (let i = 0; i < 8; i++) {
        const bin = matrix.slice(i * 8, (i + 1) * 8);
        const hex = `00${parseInt(bin, 2).toString(16)}`.slice(-2);
        frame.push(hex);
      }
      return [`0x${frame.join(',0x')}`, this.ORDER_ATOMIC];
    },
    mpy(block) {
      const matrix = block.getFieldValue('MATRIX');
      const frame = [];
      for (let i = 0; i < 8; i++) {
        const bin = matrix.slice(i * 8, (i + 1) * 8);
        const hex = `00${parseInt(bin, 2).toString(16)}`.slice(-2);
        frame.push(hex);
      }
      return [`\\x${frame.join('\\x')}`, this.ORDER_ATOMIC];
    },
  },
  {
    id: 'text',
    text: (
      <Text
        id="blocks.matrix7219.text"
        defaultMessage="display [MSG]"
      />
    ),
    inputs: {
      MSG: {
        type: 'string',
        defaultValue: 'abc',
      },
    },
    ino(block) {
      const msg = this.valueToCode(block, 'MSG', this.ORDER_NONE);
      const text = msg.replace(/^['"]/, '').replace(/['"]$/, '');
      const textArr = text.split('').map((c) => `"${c === '"' ? `\\"` : c === '\\' ? '\\\\' : c}"`);

      // 使用字库
      if (/[^\x20-\x7E]/.test(text)) {
        delete this.definitions_['include_user_fonts'];

        // 使用用户字库
        if (meta.users?.fonts) {
          this.definitions_['include_user_fonts'] = '#include "user_fonts.h"';
          const code = `SHOW_TEXT(_matrix7219, ${textArr});\n`;
          return code;
        }

        // 自动生成字库
        // 非 ASCII 32~126 之间的字符
        let oldMap = '';
        if (this.definitions_['variable_user_fonts']) {
          const findStr = 'static char *USER_FONT_MAP[] = {"';
          oldMap = this.definitions_['variable_user_fonts'];
          oldMap = oldMap.slice(oldMap.indexOf(findStr) + findStr.length, oldMap.lastIndexOf('"};'));
          oldMap = oldMap.replaceAll('","', '');
        }
        const fonts = createFontWithCStyle(oldMap + text);
        this.definitions_['variable_user_fonts'] = fonts.content;
        const code = `SHOW_TEXT(_matrix7219, ${textArr});\n`;
        return code;
      }

      this.definitions_['include_user_fonts'] = '#include "fonts8x8.h"';
      const code = `SHOW_TEXT(_matrix7219, ${textArr});\n`;
      return code;
    },
    mpy(block) {
      const msg = this.valueToCode(block, 'MSG', this.ORDER_NONE);
      const text = msg.replace(/^['"]/, '').replace(/['"]$/, '');

      // 使用字库
      if (/[^\x20-\x7E]/.test(text)) {
        // 使用用户字库
        if (meta.users?.fonts) {
          this.definitions_['import_user_fonts'] = 'from user_fonts.matrix7219 import *';
          const code = `_matrix7219.show_text(${msg}, USER_FONTS, USER_FONT_MAP, USER_FONT_WIDTH_INDEX)\n`;
          return code;
        }

        // 自动生成字库
        // 非 ASCII 32~126 之间的字符
        let oldMap = '';
        if (this.definitions_['user_fonts']) {
          const findStr = 'USER_FONT_MAP = "';
          oldMap = this.definitions_['user_fonts'];
          oldMap = oldMap.slice(oldMap.indexOf(findStr) + findStr.length, oldMap.lastIndexOf('"'));
        }
        const fonts = createFontWithPythonStyle(oldMap + text);
        this.definitions_['user_fonts'] = fonts.content;
        const code = `_matrix7219.show_text(${msg}, USER_FONTS, USER_FONT_MAP, USER_FONT_WIDTH_INDEX)\n`;
        return code;
      }

      const code = `_matrix7219.show_text(${msg})\n`;
      return code;
    },
  },
  {
    id: 'clear',
    text: (
      <Text
        id="blocks.matrix7219.clear"
        defaultMessage="clear device [IDX]"
      />
    ),
    inputs: {
      IDX: {
        type: 'positive_integer',
        defaultValue: '1',
      },
    },
    ino(block) {
      const idx = this.getAdjusted(block, 'IDX');
      const code = `_matrix7219.clearDisplay(${idx});\n`;
      return code;
    },
    mpy(block) {
      const idx = this.getAdjusted(block, 'IDX');
      const code = `_matrix7219.clear_display(${idx})\n`;
      return code;
    },
  },
  {
    id: 'clearall',
    text: (
      <Text
        id="blocks.matrix7219.clearall"
        defaultMessage="clear all devices"
      />
    ),
    ino(block) {
      let code = '';
      code += 'for (int i=0; i< _matrix7219.getDeviceCount(); i++)\n';
      code += `  _matrix7219.clearDisplay(i);\n`;
      return code;
    },
    mpy(block) {
      const code = `_matrix7219.clear_display()\n`;
      return code;
    },
  },
  '---',
  // {
  //   id: 'rotate',
  //   text: (
  //     <Text
  //       id="blocks.matrix7219.rotate"
  //       defaultMessage="rotate device [IDX] to [ANGLE]"
  //     />
  //   ),
  //   inputs: {
  //     IDX: {
  //       type: 'positive_integer',
  //       defaultValue: 1,
  //     },
  //     ANGLE: {
  //       defaultValue: '0',
  //       menu: ['0', '90', '180', '270'],
  //     },
  //   },
  //   ino(block) {
  //     const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
  //     const code = ``;
  //     return code;
  //   },
  //   mpy(block) {
  //     const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
  //     const code = ``;
  //     return code;
  //   },
  // },
  {
    id: 'brightness',
    text: (
      <Text
        id="blocks.matrix7219.brightness"
        defaultMessage="set device [IDX] brightness [LEVEL]"
      />
    ),
    inputs: {
      IDX: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      LEVEL: {
        shadow: 'brightnessLevel',
        defaultValue: '8',
      },
    },
    ino(block) {
      const idx = this.getAdjusted(block, 'IDX');
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      const code = `_matrix7219.setIntensity(${idx}, ${level});\n`;
      return code;
    },
    mpy(block) {
      const idx = this.getAdjusted(block, 'IDX');
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      const code = `_matrix7219.set_intensity(${idx}, ${level})\n`;
      return code;
    },
  },
  {
    id: 'brightnessall',
    text: (
      <Text
        id="blocks.matrix7219.brightnessall"
        defaultMessage="set all devices brightness [LEVEL]"
      />
    ),
    inputs: {
      LEVEL: {
        shadow: 'brightnessLevel',
        defaultValue: '8',
      },
    },
    ino(block) {
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      let code = '';
      code += 'for (int i=0; i< _matrix7219.getDeviceCount(); i++)\n';
      code += `  _matrix7219.setIntensity(i, ${level});\n`;
      return code;
    },
    mpy(block) {
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      let code = '';
      code += 'for i in range(_matrix7219.get_device_count()):\n';
      code += `  _matrix7219.set_intensity(i, ${level})\n`;
      return code;
    },
  },
  {
    id: 'brightnessLevel',
    shadow: true,
    output: 'number',
    inputs: {
      LEVEL: {
        type: 'slider',
        defaultValue: 0,
        min: 0,
        max: 15,
      },
    },
    mpy(block) {
      const code = block.getFieldValue('LEVEL') || 0;
      return [code, this.ORDER_NONE];
    },
    ino(block) {
      const code = block.getFieldValue('LEVEL') || 0;
      return [code, this.ORDER_NONE];
    },
  },
];

export const menus = {
  iotOutPins: {
    items: [
      ['P0', '33'],
      ['P1', '32'],
      // ['P2', '35'],
      // ['P3', '34'],
      // ['P4', '39'],
      ['P5', '0'],
      ['P6', '16'],
      ['P7', '17'],
      ['P8', '26'],
      ['P9', '25'],
      // ['P10', '36'],
      ['P11', '2'],
      // ['P12', ''],
      ['P13', '18'],
      ['P14', '19'],
      ['P15', '21'],
      ['P16', '5'],
      ['P19', '22'],
      ['P20', '23'],
      ['P23', '27'],
      ['P24', '14'],
      ['P25', '12'],
      ['P26', '13'],
      ['P27', '15'],
      ['P28', '4'],
    ],
  },
};
