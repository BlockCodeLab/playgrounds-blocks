import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'whenKey',
    text: (
      <Text
        id="blocks.switchkey.whenKey"
        defaultMessage="when pin [PIN] [STATE]"
      />
    ),
    hat: true,
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.in }
        : {
            type: 'positive_integer',
            defaultValue: '1',
          },
      STATE: {
        menu: 'StateOption',
      },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const state = block.getFieldValue('STATE');

      const buttonName = `_1button_${pin}`;
      this.definitions_['include_onebutton'] = '#include <OneButton.h>';
      this.definitions_[`variable_${buttonName}`] = `OneButton ${buttonName}(${pin});`;

      const funcName = `${buttonName}_${state}`;
      const branchCode = this.statementToCode(block) || '';
      this.definitions_[`declare_${funcName}`] = `void ${funcName}();`;
      this.definitions_[funcName] = `void ${funcName}() {\n${branchCode}}`;
      this.definitions_[`setup_${funcName}`] = `${buttonName}.attach${state}(${funcName});`;

      // 定时器
      const timerName = 'msTimer_10';
      this.definitions_['include_mstimer2'] = '#include <MsTimer2.h>';
      this.definitions_[`declare_${timerName}`] = `void ${timerName}();`;
      this.definitions_[timerName] = `void ${timerName}() {\n  ${buttonName}.tick();\n}`;

      // 保证定时器在按键回调设置之后启动
      if (this.definitions_[`setup_${timerName}`]) {
        delete this.definitions_[`setup_${timerName}`];
        delete this.definitions_[`setup_${timerName}_start`];
      }
      this.definitions_[`setup_${timerName}`] = `MsTimer2::set(10, ${timerName});`;
      this.definitions_[`setup_${timerName}_start`] = 'MsTimer2::start();';
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const state = block
        .getFieldValue('STATE')
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase();

      const buttonName = `_1button_${pin}`;
      this.definitions_['import_onebutton'] = 'from onebutton import OneButton';
      this.definitions_[buttonName] = `${buttonName} = OneButton(${pin})`;

      const flagName = this.createName('_1button_flag');
      this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      // 定义按键回调函数
      let branchCode = this.statementToCode(block) || '';
      let code = '';
      code += 'while True:\n';
      code += `${this.INDENT}await ${flagName}.wait()\n`;
      code += branchCode;

      const funcName = this.createName(`${buttonName}_${state}`);
      branchCode = this.prefixLines(code, this.INDENT);
      branchCode = this.addEventTrap(branchCode, '1button_callback');
      code = '@_tasks__.append\n';
      code += branchCode;
      code += `${buttonName}.on_${state}(lambda: ${flagName}.set())\n`;
      this.definitions_[funcName] = code;
    },
  },
  {
    id: 'keyState',
    text: (
      <Text
        id="blocks.switchkey.keyState"
        defaultMessage="pin [PIN] is pressed?"
      />
    ),
    output: 'boolean',
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.in }
        : {
            type: 'positive_integer',
            defaultValue: '1',
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const code = `(digitalRead(${pin}) == LOW)`;
      return [code, this.ORDER_ATOMIC];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const buttonName = `_1button_${pin}`;
      this.definitions_['import_onebutton'] = 'from onebutton import OneButton';
      this.definitions_[buttonName] = `${buttonName} = OneButton(${pin})`;
      const code = `${buttonName}.is_pressed()`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  // '---',
  // {
  //   id: 'adcKeyPressed',
  //   text: (
  //     <Text
  //       id="blocks.switchkey.adcKeyPressed"
  //       defaultMessage="pin [PIN] adc keyboard [KEY] key is pressed?"
  //     />
  //   ),
  //   output: 'boolean',
  //   inputs: {
  //     PIN: meta.boardPins
  //       ? { menu: meta.boardPins.adc }
  //       : {
  //           type: 'positive_integer',
  //           defaultValue: '1',
  //         },
  //     KEY: {
  //       type: 'string',
  //       defaultValue: 'a',
  //       menu: ['a', 'b', 'c', 'd', 'e'],
  //     },
  //   },
  // },
];

export const menus = {
  StateOption: {
    items: [
      [
        <Text
          id="blocks.switchkey.keyClick"
          defaultMessage="click"
        />,
        'Click',
      ],
      [
        <Text
          id="blocks.switchkey.keyDoubleClick"
          defaultMessage="doubel click"
        />,
        'DoubleClick',
      ],
      [
        <Text
          id="blocks.switchkey.keyLongPressed"
          defaultMessage="long pressed"
        />,
        'LongPressStart',
      ],
      [
        <Text
          id="blocks.switchkey.keyDuringLongPressed"
          defaultMessage="long pressed (during)"
        />,
        'DuringLongPress',
      ],
    ],
  },
};
