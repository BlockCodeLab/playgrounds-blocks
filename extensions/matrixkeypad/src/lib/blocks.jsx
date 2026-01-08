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
        inputMode: true,
        defaultValue: '1',
        menu: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', '*', '#'],
      },
    },
    ino(block) {
      let key = block.getFieldValue('KEY') || '1';
      this.definitions_['variable_matrixkeypad'] = `MatrixKeypad matrixKeypad;`;
      this.definitions_['setup_matrixkeypad'] = `matrixKeypad.Init();`;
      const code = `matrixKeypad.PressedKey("${key}")`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'keyReleased',
    text: (
      <Text
        id="blocks.matrixkeypad.pressedKey"
        defaultMessage="pressed key"
      />
    ),
    output: 'string',
    ino(block) {
      this.definitions_['variable_matrixkeypad'] = `MatrixKeypad matrixKeypad;`;
      this.definitions_['setup_matrixkeypad'] = `matrixKeypad.Init();`;
      const code = `matrixKeypad.GetKey()`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
];
