import { Text } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);
const isIotBit = (meta) => meta.editor === '@emakefun/gui-iotbit';

export const blocks = (meta) => [
  notArduino(meta) && {
    id: 'init',
    text: (
      <Text
        id="blocks.matrixkeypad.init"
        defaultMessage="set pins SCL:[SCL] SDA:[SDA]"
      />
    ),
    inputs: {
      SCL: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? '22' : '2',
          }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      SDA: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? '23' : '3',
          }
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
        defaultValue: 'any',
        menu: [
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
          ['4', '4'],
          ['5', '5'],
          ['6', '6'],
          ['7', '7'],
          ['8', '8'],
          ['9', '9'],
          ['0', '0'],
          ['A', 'A'],
          ['B', 'B'],
          ['C', 'C'],
          ['D', 'D'],
          ['*', '*'],
          ['#', '#'],
          [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_ANY, 'any'],
        ],
      },
    },
    ino(block) {
      const key = this.valueToCode(block, 'KEY', this.ORDER_NONE).replace(/^"|"$/g, "'");
      this.definitions_['include_wire'] = '#include <Wire.h>';
      this.definitions_['variable_matrixkeypad'] = `MatrixKeypad matrixKeypad;`;
      this.definitions_['setup_wire'] = 'Wire.begin();';
      this.definitions_['setup_matrixkeypad'] = `matrixKeypad.Init();`;
      let code = `matrixKeypad.PressedKey(${key})`;
      if (/^['"]any['"]$/.test(key)) {
        code = `!matrixKeypad.PressedKey('\\0')`;
      }
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const key = this.valueToCode(block, 'KEY', this.ORDER_NONE);
      let code = `_matrixKeypad.pressed(${key})`;
      if (/^['"]any['"]$/.test(key)) {
        code = `not _matrixKeypad.pressed(None)`;
      }
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
      this.definitions_['include_wire'] = '#include <Wire.h>';
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
