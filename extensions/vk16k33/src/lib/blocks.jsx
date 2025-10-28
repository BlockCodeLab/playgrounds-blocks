import { Text } from '@blockcode/core';

const notArduino = (meta) => meta.editor !== '@blockcode/gui-arduino';

export const blocks = (meta) =>
  []
    .concat(
      notArduino(meta) && [
        {
          id: 'init',
          text: (
            <Text
              id="blocks.vk16k33.init"
              defaultMessage="set pin SCL[SCL] pin SDA[SDA]"
            />
          ),
          inputs: {
            SCL: {
              type: 'integer',
              defaultValue: '2',
            },
            SDA: {
              type: 'integer',
              defaultValue: '3',
            },
          },
          mpy(block) {
            const scl = this.valueToCode(block, 'SCL', this.ORDER_NONE);
            const sda = this.valueToCode(block, 'SDA', this.ORDER_NONE);
            this.definitions_['digit_display'] = `_digit_display = vk16k33.Vk16k33(${scl}, ${sda})`;
            return '';
          },
        },
        // {
        //   id: 'addr',
        //   text: (
        //     <Text
        //       id="blocks.vk16k33.addr"
        //       defaultMessage="set I2C address [ADDR]"
        //     />
        //   ),
        //   inputs: {
        //     ADDR: {
        //       type: 'integer',
        //       defaultValue: '112',
        //     },
        //   },
        // },
        '---',
      ],
      {
        id: 'display',
        text: (
          <Text
            id="blocks.vk16k33.display"
            defaultMessage="display number [NUM]"
          />
        ),
        inputs: {
          NUM: {
            type: 'number',
            defaultValue: 100,
          },
        },
        ino(block) {
          const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
          this.definitions_['variable_digitDisplay'] = 'DigitDisplay _digitDisplay;';
          this.definitions_['setup_digitDisplay'] = '_digitDisplay.Setup();';
          const code = `_digitDisplay.ShowNumber(${num});\n`;
          return code;
        },
        mpy(block) {
          const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
          const code = `_digit_display.show_number(${num})\n`;
          return code;
        },
      },
      {
        id: 'digit',
        text: (
          <Text
            id="blocks.vk16k33.digit"
            defaultMessage="set digit [DIGIT] at [POS]"
          />
        ),
        inputs: {
          DIGIT: {
            type: 'integer',
            defaultValue: '1',
          },
          POS: {
            type: 'integer',
            inputMode: true,
            defaultValue: '1',
            menu: ['1', '2', '3', '4'],
          },
        },
        ino(block) {
          const digit = this.valueToCode(block, 'DIGIT', this.ORDER_NONE);
          const pos = this.valueToCode(block, 'POS', this.ORDER_NONE);
          this.definitions_['variable_digitDisplay'] = 'DigitDisplay _digitDisplay;';
          this.definitions_['setup_digitDisplay'] = '_digitDisplay.Setup();';
          const code = `_digitDisplay.ShowDigitNumber(${pos}, ${digit});\n`;
          return code;
        },
        mpy(block) {
          const digit = this.valueToCode(block, 'DIGIT', this.ORDER_NONE);
          const pos = this.valueToCode(block, 'POS', this.ORDER_NONE);
          const code = `_digit_display.show_digit_number(${pos}, ${digit})\n`;
          return code;
        },
      },
      {
        id: 'clear',
        text: (
          <Text
            id="blocks.vk16k33.clear"
            defaultMessage="clear display"
          />
        ),
        ino(block) {
          this.definitions_['variable_digitDisplay'] = 'DigitDisplay _digitDisplay;';
          this.definitions_['setup_digitDisplay'] = '_digitDisplay.Setup();';
          return '_digitDisplay.Clear();\n';
        },
        mpy(block) {
          return '_digit_display.clear()\n';
        },
      },
      '---',
      {
        id: 'brightness',
        text: (
          <Text
            id="blocks.vk16k33.brightness"
            defaultMessage="set brightness [LEVEL]"
          />
        ),
        inputs: {
          LEVEL: {
            shadow: 'brightnessLevel',
            defaultValue: '9',
          },
        },
        ino(block) {
          const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
          this.definitions_['variable_digitDisplay'] = 'DigitDisplay _digitDisplay;';
          this.definitions_['setup_digitDisplay'] = '_digitDisplay.Setup();';
          const code = `_digitDisplay.SetBrightness(${level});\n`;
          return code;
        },
        mpy(block) {
          const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
          const code = `_digit_display.brightness(${level})\n`;
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
          const code = block.getFieldValue('LEVEL') || 0;
          return [code, this.ORDER_NONE];
        },
        ino(block) {
          const code = block.getFieldValue('LEVEL') || 0;
          return [code, this.ORDER_NONE];
        },
      },
      {
        id: 'colon',
        text: (
          <Text
            id="blocks.vk16k33.colon"
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
                  id="blocks.vk16k33.state.on"
                  defaultMessage="on"
                />,
                '1',
              ],
              [
                <Text
                  id="blocks.vk16k33.state.off"
                  defaultMessage="off"
                />,
                '0',
              ],
            ],
          },
        },
        ino(block) {
          const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
          this.definitions_['variable_digitDisplay'] = 'DigitDisplay _digitDisplay;';
          this.definitions_['setup_digitDisplay'] = '_digitDisplay.Setup();';
          const code = `_digitDisplay.ShowColon(${state == 1});\n`;
          return code;
        },
        mpy(block) {
          const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
          const code = `_digit_display.show_colon(${state})\n`;
          return code;
        },
      },
      {
        id: 'frequency',
        text: (
          <Text
            id="blocks.vk16k33.frequency"
            defaultMessage="set blink frequency [FREQ]"
          />
        ),
        inputs: {
          FREQ: {
            type: 'integer',
            defaultValue: '0',
            menu: [
              ['2Hz', '1'],
              ['1Hz', '2'],
              ['0.5Hz', '3'],
              [
                <Text
                  id="blocks.vk16k33.state.off"
                  defaultMessage="off"
                />,
                '0',
              ],
            ],
          },
        },
        ino(block) {
          const freq = block.getFieldValue('FREQ') || 0;
          this.definitions_['variable_digitDisplay'] = 'DigitDisplay _digitDisplay;';
          this.definitions_['setup_digitDisplay'] = '_digitDisplay.Setup();';
          const code = `_digitDisplay.SetBlinkRate(${freq});\n`;
          return code;
        },
        mpy(block) {
          const freq = block.getFieldValue('FREQ') || 0;
          const code = `_digit_display.blink_rate(${freq})\n`;
          return code;
        },
      },
    )
    .filter(Boolean);
