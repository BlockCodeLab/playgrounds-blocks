import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  meta.editor !== '@blockcode/gui-arduino' && {
    id: 'init',
    text: (
      <Text
        id="blocks.matrixkeypad.init"
        defaultMessage="set pins SCL[SCL] SDA[SDA]"
      />
    ),
    inputs: {
      SCL: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      SDA: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    mpy(block) {
      const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_ATOMIC);
      const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_ATOMIC);
      this.definitions_['matrixkeypad'] = `_matrixKeypad = matrixkeypad.MatrixKeypad(${scl}, ${sda})`;
      return '';
    },
  },
  '---',
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
      const key = block.getFieldValue('KEY') || '1';
      this.definitions_['variable_matrixkeypad'] = `MatrixKeypad matrixKeypad;`;
      this.definitions_['setup_wire'] = 'Wire.begin();';
      this.definitions_['setup_matrixkeypad'] = `matrixKeypad.Init();`;
      const code = `matrixKeypad.PressedKey("${key}")`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const key = block.getFieldValue('KEY') || '1';
      const code = `_matrixKeypad.pressed("${key}")`;
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
      this.definitions_['setup_wire'] = 'Wire.begin();';
      this.definitions_['setup_matrixkeypad'] = `matrixKeypad.Init();`;
      const code = `matrixKeypad.GetKey()`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const code = `_matrixKeypad.get_pressed_key()`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
];
