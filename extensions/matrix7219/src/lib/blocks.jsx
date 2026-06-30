import { batch } from '@preact/signals';
import { setMeta, addAsset, delAsset, openPromptModal, Text, translate } from '@blockcode/core';
import { createFontWithCStyle, createFontWithPythonStyle } from './font-creator';
import styles from './font-creator.module.css';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

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
            const fontMap = document.getElementById('matrix7219_font_creator').value;

            const fonts = fontMap
              ? isArduino(meta)
                ? `#pragma once\n#include <Arduino.h>\n${createFontWithCStyle(fontMap)}`
                : createFontWithPythonStyle(fontMap)
              : {
                  map: [],
                  content: '',
                };

            batch(() => {
              setMeta({
                users: {
                  ...meta.users,
                  fonts: fonts.map.join(''),
                },
              });
              if (isArduino(meta)) {
                if (fontMap) {
                  addAsset({
                    id: 'user_fonts.h',
                    name: 'user_fonts',
                    type: 'text/x-c',
                    content: fonts.content,
                  });
                } else {
                  delAsset('user_fonts.h');
                }
              } else {
                if (fontMap) {
                  addAsset({
                    id: '/lib/user_fonts/matrix7219',
                    name: 'user_fonts',
                    type: 'text/x-python',
                    content: fonts.content,
                  });
                } else {
                  delAsset('/lib/user_fonts/matrix7219');
                }
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
        defaultMessage="set #[ID] device pins CLK:[CLK] CS:[CS] DIN:[DIN]"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
      CLK: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      DIN: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
      CS: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 4,
          },
    },
    ino(block) {
      const id = block.getFieldValue('ID');
      const clk = meta.boardPins ? block.getFieldValue('CLK') : this.valueToCode(block, 'CLK', this.ORDER_NONE);
      const din = meta.boardPins ? block.getFieldValue('DIN') : this.valueToCode(block, 'DIN', this.ORDER_NONE);
      const cs = meta.boardPins ? block.getFieldValue('CS') : this.valueToCode(block, 'CS', this.ORDER_NONE);
      const devices =
        this.definitions_[`variable_matrix7219_${id}_screens`]?.replace(`// MAX7219 ${id} screens: `, '') || 1;
      delete this.definitions_[`variable_matrix7219_${id}_screens`];
      this.definitions_[`variable_matrix7219_${id}`] =
        `Matrix7219 _matrix7219_${id}(${din}, ${clk}, ${cs}, ${devices});`;
      return '';
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const clk = meta.boardPins ? block.getFieldValue('CLK') : this.valueToCode(block, 'CLK', this.ORDER_NONE);
      const din = meta.boardPins ? block.getFieldValue('DIN') : this.valueToCode(block, 'DIN', this.ORDER_NONE);
      const cs = meta.boardPins ? block.getFieldValue('CS') : this.valueToCode(block, 'CS', this.ORDER_NONE);
      const devices = this.definitions_[`matrix7219_${id}_screens`]?.replace(`# MAX7219 ${id} screens: `, '') || 1;
      delete this.definitions_[`matrix7219_${id}_screens`];
      this.definitions_[`matrix7219_${id}`] =
        `_matrix7219_${id} = matrix7219.Matrix7219(${din}, ${clk}, ${cs}, ${devices})`;
      return '';
    },
  },
  {
    id: 'devices',
    text: (
      <Text
        id="blocks.matrix7219.devices"
        defaultMessage="set #[ID] device matrix screens [NUM]"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
      NUM: {
        type: 'positive_integer',
        defaultValue: '1',
      },
    },
    ino(block) {
      const id = block.getFieldValue('ID');
      const devices = this.valueToCode(block, 'NUM', this.ORDER_NONE);

      if (this.definitions_[`variable_matrix7219_${id}`]) {
        this.definitions_[`variable_matrix7219_${id}`] = this.definitions_[`variable_matrix7219_${id}`].replace(
          /\d+\);$/,
          `${devices});`,
        );
      } else {
        this.definitions_[`variable_matrix7219_${id}_screens`] = `// MAX7219 ${id} screens: ${devices}`;
      }

      return '';
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const devices = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      if (this.definitions_[`matrix7219_${id}`]) {
        this.definitions_[`matrix7219_${id}`] = this.definitions_[`matrix7219_${id}`].replace(/\d+\)$/, `${devices})`);
      } else {
        this.definitions_[`matrix7219_${id}_screens`] = `# MAX7219 ${id} screens: ${devices}`;
      }
      return '';
    },
  },
  '---',
  {
    id: 'pixel',
    text: (
      <Text
        id="blocks.matrix7219.pixel"
        defaultMessage="[STATE] [ID] device [IDX] screen at x:[X] y:[Y] pixel"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
      IDX: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      X: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      Y: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      STATE: {
        menu: 'LedStates',
      },
    },
    ino(block) {
      const id = block.getFieldValue('ID');
      const idx = this.getAdjusted(block, 'IDX');
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      const code = `_matrix7219_${id}.setLed(${idx}, ${y}, ${x}, ${state});\n`;
      return code;
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const idx = this.getAdjusted(block, 'IDX');
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);
      const code = `_matrix7219_${id}.set_led(${idx}, ${y}, ${x}, ${state})\n`;
      return code;
    },
  },
  {
    id: 'display',
    text: (
      <Text
        id="blocks.matrix7219.display"
        defaultMessage="display [MATRIX] on #[ID] device [IDX] screen"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
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
      const id = block.getFieldValue('ID');
      const idx = this.getAdjusted(block, 'IDX');
      const matrix = this.valueToCode(block, 'MATRIX', this.ORDER_NONE);
      const code = `_matrix7219_${id}.showMatrix(${idx}, (byte[]){${matrix}});\n`;
      return code;
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const idx = this.getAdjusted(block, 'IDX');
      const matrix = this.valueToCode(block, 'MATRIX', this.ORDER_NONE);
      const code = `_matrix7219_${id}.show_matrix(${idx}, b"${matrix}")\n`;
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
      const id = block.getFieldValue('ID');
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
      const id = block.getFieldValue('ID');
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
        defaultMessage="display [MSG] on #[ID] device"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
      MSG: {
        type: 'string',
        defaultValue: 'abc',
      },
    },
    ino(block) {
      const id = block.getFieldValue('ID');
      const msg = this.valueToCode(block, 'MSG', this.ORDER_NONE);
      const text = msg.replace(/^['"]/, '').replace(/['"]$/, '');
      const textArr = text.split('').map((c) => `"${c === '"' ? `\\"` : c === '\\' ? '\\\\' : c}"`);

      // 使用字库
      if (/[^\x20-\x7E]/.test(text)) {
        delete this.definitions_['include_user_fonts'];

        // 使用用户字库
        if (meta.users?.fonts) {
          this.definitions_['include_user_fonts'] = '#include "user_fonts.h"';
          const code = `SHOW_TEXT(_matrix7219_${id}, ${textArr});\n`;
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
        const code = `SHOW_TEXT(_matrix7219_${id}, ${textArr});\n`;
        return code;
      }

      this.definitions_['include_user_fonts'] = '#include "fonts8x8.h"';
      const code = `SHOW_TEXT(_matrix7219_${id}, ${textArr});\n`;
      return code;
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const msg = this.valueToCode(block, 'MSG', this.ORDER_NONE);
      const text = msg.replace(/^['"]/, '').replace(/['"]$/, '');

      // 使用字库
      if (/[^\x20-\x7E]/.test(text)) {
        // 使用用户字库
        if (meta.users?.fonts) {
          this.definitions_['import_user_fonts'] = 'from user_fonts.matrix7219 import *';
          const code = `_matrix7219_${id}.show_text(${msg}, USER_FONTS, USER_FONT_MAP, USER_FONT_WIDTH_INDEX)\n`;
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
        const code = `_matrix7219_${id}.show_text(${msg}, USER_FONTS, USER_FONT_MAP, USER_FONT_WIDTH_INDEX)\n`;
        return code;
      }

      const code = `_matrix7219_${id}.show_text(${msg})\n`;
      return code;
    },
  },
  {
    id: 'clear',
    text: (
      <Text
        id="blocks.matrix7219.clear"
        defaultMessage="clear [IDX] screen on #[ID] device"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
      IDX: {
        type: 'positive_integer',
        defaultValue: '1',
      },
    },
    ino(block) {
      const id = block.getFieldValue('ID');
      const idx = this.getAdjusted(block, 'IDX');
      const code = `_matrix7219_${id}.clearDisplay(${idx});\n`;
      return code;
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const idx = this.getAdjusted(block, 'IDX');
      const code = `_matrix7219_${id}.clear_display(${idx})\n`;
      return code;
    },
  },
  {
    id: 'clearall',
    text: (
      <Text
        id="blocks.matrix7219.clearall"
        defaultMessage="clear all screens on #[ID] device"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
    },
    ino(block) {
      const id = block.getFieldValue('ID');
      let code = '';
      code += 'for (int i=0; i< _matrix7219_${id}.getDeviceCount(); i++)\n';
      code += `  _matrix7219_${id}.clearDisplay(i);\n`;
      return code;
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const code = `_matrix7219_${id}.clear_display()\n`;
      return code;
    },
  },
  '---',
  // {
  //   id: 'rotate',
  //   text: (
  //     <Text
  //       id="blocks.matrix7219.rotate"
  //       defaultMessage="rotate #[ID] device [IDX] screen to [ANGLE]"
  //     />
  //   ),
  //   inputs: {
  //     ID: {
  //       menu: 'IDs',
  //     },
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
        defaultMessage="set #[ID] device [IDX] screen brightness [LEVEL]"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
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
      const id = block.getFieldValue('ID');
      const idx = this.getAdjusted(block, 'IDX');
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      const code = `_matrix7219_${id}.setIntensity(${idx}, ${level});\n`;
      return code;
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const idx = this.getAdjusted(block, 'IDX');
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      const code = `_matrix7219_${id}.set_intensity(${idx}, ${level})\n`;
      return code;
    },
  },
  {
    id: 'brightnessall',
    text: (
      <Text
        id="blocks.matrix7219.brightnessall"
        defaultMessage="set #[ID] device all screens brightness [LEVEL]"
      />
    ),
    inputs: {
      ID: {
        menu: 'IDs',
      },
      LEVEL: {
        shadow: 'brightnessLevel',
        defaultValue: '8',
      },
    },
    ino(block) {
      const id = block.getFieldValue('ID');
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      let code = '';
      code += 'for (int i=0; i< _matrix7219_${id}.getDeviceCount(); i++)\n';
      code += `  _matrix7219_${id}.setIntensity(i, ${level});\n`;
      return code;
    },
    mpy(block) {
      const id = block.getFieldValue('ID');
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      let code = '';
      code += 'for i in range(_matrix7219_${id}.get_device_count()):\n';
      code += `  _matrix7219_${id}.set_intensity(i, ${level})\n`;
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
      const id = block.getFieldValue('ID');
      const code = block.getFieldValue('LEVEL') || 0;
      return [code, this.ORDER_NONE];
    },
    ino(block) {
      const id = block.getFieldValue('ID');
      const code = block.getFieldValue('LEVEL') || 0;
      return [code, this.ORDER_NONE];
    },
  },
];

export const menus = {
  IDs: {
    items: [
      ['#1', '1'],
      ['#2', '2'],
    ],
  },
  LedStates: {
    type: 'integer',
    inputMode: true,
    defaultValue: '1',
    items: [
      [
        <Text
          id="blocks.matrix7219.stateOn"
          defaultMessage="on"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.matrix7219.stateOff"
          defaultMessage="off"
        />,
        '0',
      ],
    ],
  },
};
