import { Text } from '@blockcode/core';

export const blocks = [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.tm1637.init"
        defaultMessage="set pins CLK[CLK] DIO[DIO]"
      />
    ),
    inputs: {
      CLK: {
        type: 'integer',
        defaultValue: '2',
      },
      DIO: {
        type: 'integer',
        defaultValue: '3',
      },
    },
    ino(block) {
      const clk = this.valueToCode(block, 'CLK', this.ORDER_NONE);
      const dio = this.valueToCode(block, 'DIO', this.ORDER_NONE);
      this.definitions_['include_tm1637'] = '#include <GyverTM1637.h>';
      this.definitions_['variable_digit1637'] = `GyverTM1637 _digit1637(${clk}, ${dio});`;
      this.definitions_['setup_digit1637_1'] = '_digit1637.clear();';
      this.definitions_['setup_digit1637_2'] = '_digit1637.brightness(4);';
      return '';
    },
    mpy(block) {
      const clk = this.valueToCode(block, 'CLK', this.ORDER_NONE);
      const dio = this.valueToCode(block, 'DIO', this.ORDER_NONE);
      this.definitions_['import_tm1637'] = 'from tm1637 import TM1637';
      this.definitions_['digit1637'] = `_digit1637 = TM1637(${clk}, ${dio})`;
      return '';
    },
  },
  '---',
  {
    id: 'display',
    text: (
      <Text
        id="blocks.tm1637.display"
        defaultMessage="display number [NUM]"
      />
    ),
    inputs: {
      NUM: {
        type: 'integer',
        defaultValue: 100,
      },
    },
    ino(block) {
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      let code = '';
      code += '_digit1637.point(false, false);\n';
      code += `_digit1637.displayInt(${num});\n`;
      return code;
    },
    mpy(block) {
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const code = `_digit1637.number(${num})\n`;
      return code;
    },
  },
  {
    id: 'time',
    text: (
      <Text
        id="blocks.tm1637.time"
        defaultMessage="set time [HH]:[MM]"
      />
    ),
    inputs: {
      HH: {
        type: 'integer',
        defaultValue: '0',
      },
      MM: {
        type: 'integer',
        defaultValue: '0',
      },
    },
    ino(block) {
      const hour = this.valueToCode(block, 'HH', this.ORDER_NONE);
      const minute = this.valueToCode(block, 'MM', this.ORDER_NONE);
      let code = '';
      code += '_digit1637.point(true, false);\n';
      code += `_digit1637.displayClock(${hour} % 100, ${minute} % 100);\n`;
      code += `if (${hour} < 10) _digit1637.display(0, 0);\n`;
      return code;
    },
    mpy(block) {
      const hour = this.valueToCode(block, 'HH', this.ORDER_NONE);
      const minute = this.valueToCode(block, 'MM', this.ORDER_NONE);
      const code = `_digit1637.numbers(${hour}, ${minute})\n`;
      return code;
    },
  },
  // {
  //   id: 'digit',
  //   text: (
  //     <Text
  //       id="blocks.tm1637.digit"
  //       defaultMessage="set digit [DIGIT] at [POS]"
  //     />
  //   ),
  //   inputs: {
  //     DIGIT: {
  //       type: 'integer',
  //       defaultValue: '1',
  //     },
  //     POS: {
  //       type: 'integer',
  //       inputMode: true,
  //       defaultValue: '1',
  //       menu: ['1', '2', '3', '4'],
  //     },
  //   },
  //   ino(block) {
  //     const digit = this.valueToCode(block, 'DIGIT', this.ORDER_NONE);
  //     const pos = this.valueToCode(block, 'POS', this.ORDER_NONE);
  //     return '';
  //   },
  //   mpy(block) {
  //     const digit = this.valueToCode(block, 'DIGIT', this.ORDER_NONE);
  //     const pos = this.valueToCode(block, 'POS', this.ORDER_NONE);
  //     return '';
  //   },
  // },
  {
    id: 'clear',
    text: (
      <Text
        id="blocks.tm1637.clear"
        defaultMessage="clear display"
      />
    ),
    ino(block) {
      return '_digit1637.clear();\n';
    },
    mpy(block) {
      return '_digit1637.clear()\n';
    },
  },
  '---',
  {
    id: 'colon',
    text: (
      <Text
        id="blocks.tm1637.colon"
        defaultMessage="set colon [STATE]"
      />
    ),
    inputs: {
      STATE: {
        type: 'integer',
        inputMode: true,
        defaultValue: '1',
        menu: [
          [
            <Text
              id="blocks.tm1637.state.on"
              defaultMessage="on"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.tm1637.state.off"
              defaultMessage="off"
            />,
            '0',
          ],
        ],
      },
    },
    ino(block) {
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      const code = `_digit1637.point(${state == 1});\n`;
      return code;
    },
    mpy(block) {
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      const code = `_digit1637.colon(${state})\n`;
      return code;
    },
  },
  {
    id: 'brightness',
    text: (
      <Text
        id="blocks.tm1637.brightness"
        defaultMessage="set brightness [LEVEL]"
      />
    ),
    inputs: {
      LEVEL: {
        shadow: 'brightnessLevel',
        defaultValue: '7',
      },
    },
    ino(block) {
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      const code = `_digit1637.brightness(${level});\n`;
      return code;
    },
    mpy(block) {
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      const code = `_digit1637.brightness(${level})\n`;
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
        max: 7,
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
