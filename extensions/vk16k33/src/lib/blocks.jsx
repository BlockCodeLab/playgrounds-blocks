import { Text } from '@blockcode/core';

const notArduino = (meta) => meta.editor !== '@blockcode/gui-arduino';
const isIotBit = (meta) => meta.editor === '@blockcode/gui-iotbit';

const autoInitArduino = (gen) => {
  gen.definitions_['include_ht16k33'] = '#include <HT16K33.h>';
  gen.definitions_['variable_digit16k33'] = `HT16K33 _digit16k33(0x70);`;
  gen.definitions_['setup_wire'] = 'Wire.begin();';
  gen.definitions_['setup_digit16k33'] = '_digit16k33.begin();';
};

export const blocks = (meta) =>
  [
    notArduino(meta) && {
      id: 'init',
      text: (
        <Text
          id="blocks.vk16k33.init"
          defaultMessage="set pins SCL[SCL] SDA[SDA]"
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
        const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_NONE);
        const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_NONE);
        this.definitions_['digit16k33'] = `_digit16k33 = decimal16k33.Decimal(${scl}, ${sda})`;
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
    //       menu: [
    //         ['0×70', '0x70'],
    //         ['0×77', '0x77'],
    //       ],
    //     },
    //   },
    // },
    '---',
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
        autoInitArduino(this);
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);

        let numCode = '';
        numCode += 'void ht16k33DisplayNumber(float number) {\n';
        numCode += '  _digit16k33.setDigits(1);\n';
        numCode += '  _digit16k33.displayColon(0);\n';
        numCode += '  char buffer[15];\n';
        numCode += '  dtostrf(number, 0, 3, buffer);\n';
        numCode += "  char *dot = strchr(buffer, '.');\n";
        numCode += '  if (dot == NULL) {\n';
        numCode += '    _digit16k33.displayInt((int)number);\n';
        numCode += '    return;\n';
        numCode += '  }\n';
        numCode += '  char *frac = dot + 1;\n';
        numCode += '  int len = strlen(frac);\n';
        numCode += "  while (len > 0 && frac[len - 1] == '0') {\n";
        numCode += '    len--;\n';
        numCode += '  }\n';
        numCode += '  len > 0 ? _digit16k33.displayFloat(number, len) : _digit16k33.displayInt((int)number);\n';
        numCode += '}\n';
        this.definitions_['declare_ht16k33DisplayNumber'] = 'void ht16k33DisplayNumber(float number);';
        this.definitions_['ht16k33DisplayNumber'] = numCode;

        const code = `ht16k33DisplayNumber(${num});\n`;
        return code;
      },
      mpy(block) {
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
        const code = `_digit16k33.show_number(${num})\n`;
        return code;
      },
    },
    {
      id: 'time',
      text: (
        <Text
          id="blocks.vk16k33.time"
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
        autoInitArduino(this);
        const hour = this.valueToCode(block, 'HH', this.ORDER_NONE);
        const minute = this.valueToCode(block, 'MM', this.ORDER_NONE);
        let code = '';
        code += '_digit16k33.suppressLeadingZeroPlaces(0);\n';
        code += `_digit16k33.displayTime(${hour}, ${minute});\n`;
        return code;
      },
      mpy(block) {
        const hour = this.valueToCode(block, 'HH', this.ORDER_NONE);
        const minute = this.valueToCode(block, 'MM', this.ORDER_NONE);
        const code = `_digit16k33.show_time(${hour}, ${minute})\n`;
        return code;
      },
    },
    // {
    //   id: 'digit',
    //   text: (
    //     <Text
    //       id="blocks.vk16k33.digit"
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
    //     const code = `_digit16k33.show_digit_number(${pos}, ${digit})\n`;
    //     return code;
    //   },
    // },
    {
      id: 'clear',
      text: (
        <Text
          id="blocks.vk16k33.clear"
          defaultMessage="clear display"
        />
      ),
      ino(block) {
        autoInitArduino(this);
        return '_digit16k33.displayClear();\n';
      },
      mpy(block) {
        return '_digit16k33.clear()\n';
      },
    },
    '---',
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
        autoInitArduino(this);
        const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
        const code = `_digit16k33.displayColon(${state});\n`;
        return code;
      },
      mpy(block) {
        const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
        const code = `_digit16k33.show_colon(${state})\n`;
        return code;
      },
    },
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
        autoInitArduino(this);
        const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
        const code = `_digit16k33.setBrightness(${level});\n`;
        return code;
      },
      mpy(block) {
        const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
        const code = `_digit16k33.brightness(${level})\n`;
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
        autoInitArduino(this);
        const freq = block.getFieldValue('FREQ') || 0;
        const code = `_digit16k33.setBlink(${freq});\n`;
        return code;
      },
      mpy(block) {
        const freq = block.getFieldValue('FREQ') || 0;
        const code = `_digit16k33.blink_rate(${freq})\n`;
        return code;
      },
    },
  ].filter(Boolean);
