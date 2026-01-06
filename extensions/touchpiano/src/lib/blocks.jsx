import { Text } from '@blockcode/core';

export const blocks = [
  // {
  //   id: 'init',
  //   text: (
  //     <Text
  //       id="blocks.touchpiano.init"
  //       defaultMessage="init pins CLK:[CLK] DIO:[DIO]"
  //     />
  //   ),
  //   inputs: {
  //     CLK: {
  //       type: 'positive_integer',
  //       defaultValue: '2',
  //     },
  //     DIO: {
  //       type: 'positive_integer',
  //       defaultValue: '3',
  //     },
  //   },
  // },
  {
    id: 'keyPressed',
    text: (
      <Text
        id="blocks.touchpiano.keyPressed"
        defaultMessage="key [KEY] is pressed?"
      />
    ),
    output: 'boolean',
    inputs: {
      KEY: {
        type: 'integer',
        inputMode: true,
        defaultValue: '1',
        menu: ['1', '2', '3', '4', '5', '6', '7', '8'],
      },
    },
    ino(block) {
      const key = this.valueToCode(block, 'KEY', this.ORDER_NONE);
      this.definitions_['variable_touchpiano'] = `TouchPiano touchPiano;`;
      const code = `touchPiano.PressedKey(${key})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'pressedKey',
    text: (
      <Text
        id="blocks.touchpiano.pressedKey"
        defaultMessage="pressed key"
      />
    ),
    output: 'number',
    ino(block) {
      this.definitions_['variable_touchpiano'] = `TouchPiano touchPiano;`;
      const code = 'touchPiano.GetKey()';
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'pressedKeyName',
    text: (
      <Text
        id="blocks.touchpiano.pressedKeyName"
        defaultMessage="pressed key name"
      />
    ),
    output: 'number',
    ino(block) {
      this.definitions_['variable_touchpiano'] = `TouchPiano touchPiano;`;
      const code = 'touchPiano.GetKeyName()';
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
];
