import { changeCase } from '@blockcode/utils';
import { Text } from '@blockcode/core';

export const blocks = (meta) =>
  [
    meta.editor === '@blockcode/gui-arduino' && {
      id: 'eventPolling',
      text: (
        <Text
          id="blocks.switchkey.eventPolling"
          defaultMessage="manual event polling"
        />
      ),
      ino(block) {
        const funcName = '_1buttonTicks';
        this.definitions_[`declare_${funcName}`] = `void ${funcName}();`;
        this.definitions_[funcName] = `void ${funcName}() {\n}`;

        const code = '_1buttonTicks();\n';
        return code;
      },
    },
    '---',
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

        // 加入事件定时器
        if (this.definitions_['_1buttonTicks']) {
          this.definitions_['_1buttonTicks'] = this.definitions_['_1buttonTicks'].replace(
            '\n}',
            `\n  ${buttonName}.tick();\n}`,
          );
        } else {
          this.definitions_[`tick_${buttonName}`] = `${buttonName}.tick();`;
        }

        // 绑定按键
        this.definitions_['include_onebutton'] = '#include <OneButton.h>';
        this.definitions_[`variable_${buttonName}`] = `OneButton ${buttonName}(${pin});`;

        const funcName = `${buttonName}_${state}`;
        const branchCode = this.statementToCode(block) || '';
        this.definitions_[`declare_${funcName}`] = `void ${funcName}();`;
        this.definitions_[funcName] = `void ${funcName}() {\n${branchCode}}`;
        this.definitions_[`setup_${funcName}`] = `${buttonName}.attach${state}(${funcName});`;
      },
      mpy(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const state = changeCase.snakeCase(block.getFieldValue('STATE'));

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
  ].filter(Boolean);

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
