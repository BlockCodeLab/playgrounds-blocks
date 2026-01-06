import { Text } from '@blockcode/core';

export const blocks = [
  // {
  //   id: 'init',
  //   text: (
  //     <Text
  //       id="blocks.matrixkeypad.init"
  //       defaultMessage="set pins SCL[SCL] SDA[SDA]"
  //     />
  //   ),
  //   inputs: {
  //     SCL: {
  //       type: 'positive_integer',
  //       defaultValue: '2',
  //     },
  //     SDA: {
  //       type: 'positive_integer',
  //       defaultValue: '3',
  //     },
  //   },
  // },
  {
    id: 'keyPressed',
    text: (
      <Text
        id="blocks.matrixkeypad.keyPressed"
        defaultMessage="key [KEY] is pressed?"
      />
    ),
    output: 'boolean',
    inputs: {
      KEY: {
        menu: 'Keys',
      },
    },
    ino(block) {
      let key = block.getFieldValue('KEY') || '1';
      if (key === '*') key = 'Asterisk';
      if (key === '#') key = 'NumberSign';
      this.definitions_['variable_matrixkeypad'] = `MatrixKeypad matrixKeypad;`;
      this.definitions_['setup_matrixkeypad'] = `matrixKeypad.Init();`;
      const code = `matrixKeypad.Pressed(MatrixKeypad::kKey${key})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'keyPressing',
    text: (
      <Text
        id="blocks.matrixkeypad.keyPressing"
        defaultMessage="key [KEY] is pressing?"
      />
    ),
    output: 'boolean',
    inputs: {
      KEY: {
        menu: 'Keys',
      },
    },
    ino(block) {
      let key = block.getFieldValue('KEY') || '1';
      if (key === '*') key = 'Asterisk';
      if (key === '#') key = 'NumberSign';
      this.definitions_['variable_matrixkeypad'] = `MatrixKeypad matrixKeypad;`;
      this.definitions_['setup_matrixkeypad'] = `matrixKeypad.Init();`;
      const code = `matrixKeypad.Pressing(MatrixKeypad::kKey${key})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'keyReleased',
    text: (
      <Text
        id="blocks.matrixkeypad.keyReleased"
        defaultMessage="key [KEY] is released?"
      />
    ),
    output: 'boolean',
    inputs: {
      KEY: {
        menu: 'Keys',
      },
    },
    ino(block) {
      let key = block.getFieldValue('KEY') || '1';
      if (key === '*') key = 'Asterisk';
      if (key === '#') key = 'NumberSign';
      this.definitions_['variable_matrixkeypad'] = `MatrixKeypad matrixKeypad;`;
      this.definitions_['setup_matrixkeypad'] = `matrixKeypad.Init();`;
      const code = `matrixKeypad.Released(MatrixKeypad::kKey${key})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
];

export const menus = {
  Keys: {
    items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', '*', '#'],
  },
};
