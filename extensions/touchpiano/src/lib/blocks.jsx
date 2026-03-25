import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.touchpiano.init"
        defaultMessage="init pins CLK:[CLK] DIO:[DIO]"
      />
    ),
    inputs: {
      CLK: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      DIO: meta.boardPins
        ? { menu: meta.boardPins.in }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
    },
    ino(block) {
      const clk = meta.boardPins ? block.getFieldValue('CLK') : this.valueToCode(block, 'CLK', this.ORDER_NONE);
      const dio = meta.boardPins ? block.getFieldValue('DIO') : this.valueToCode(block, 'DIO', this.ORDER_NONE);
      this.definitions_[`variable_touchpiano`] = `TouchPiano touchPiano(${clk}, ${dio});`;
      return '';
    },
    mpy(block) {
      const clk = meta.boardPins ? block.getFieldValue('CLK') : this.valueToCode(block, 'CLK', this.ORDER_NONE);
      const dio = meta.boardPins ? block.getFieldValue('DIO') : this.valueToCode(block, 'DIO', this.ORDER_NONE);
      this.definitions_['touchpiano'] = `touchPiano = touchpiano.TouchPiano(${clk}, ${dio})`;
      return '';
    },
  },
  '---',
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
      const code = `touchPiano.PressedKey(${key})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const key = this.valueToCode(block, 'KEY', this.ORDER_NONE);
      const code = `touchPiano.pressed_key(${key})`;
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
      if (!this.definitions_['variable_touchpiano']) {
        this.definitions_['variable_touchpiano'] = `TouchPiano touchPiano;`;
      }
      const code = 'touchPiano.GetKey()';
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const code = 'touchPiano.get_key()';
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
      const code = 'touchPiano.GetKeyName()';
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const code = 'touchPiano.get_key_name()';
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
];
