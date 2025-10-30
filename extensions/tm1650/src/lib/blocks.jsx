import { Text } from '@blockcode/core';

const notArduino = (meta) => meta.editor !== '@blockcode/gui-arduino';

const autoInitArduino = (gen) => {
  gen.definitions_['include_tm1650'] = '#include <TM1650.h>';
  gen.definitions_['variable_digit1650'] = `TM1650 _digit1650;`;
  gen.definitions_['setup_wire'] = 'Wire.begin();';
  gen.definitions_['setup_digit1650'] = '_digit1650.init();';
  gen.definitions_['setup_digit1650_bright'] = '_digit1650.setBrightness(4);';
};

export const blocks = (meta) =>
  []
    .concat(
      notArduino(meta) && {
        id: 'init',
        text: (
          <Text
            id="blocks.tm1650.init"
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
          const clk = this.valueToCode(block, 'SCL', this.ORDER_NONE);
          const dio = this.valueToCode(block, 'SDA', this.ORDER_NONE);
          this.definitions_['digit1650'] = `_digit1650 = decimal1650.Decimal(${clk}, ${dio})`;
          return '';
        },
      },
      // {
      //   id: 'addr',
      //   text: (
      //     <Text
      //       id="blocks.tm1650.addr"
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
            id="blocks.tm1650.display"
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
          numCode += 'void tm1650DisplayNumber(float num) {\n';
          numCode += '  if (num < -999.5) num = -999.0;\n';
          numCode += '  if (num > 9999.5) num = 9999.0;\n';
          numCode += '  char buffer[15];\n';
          numCode += '  dtostrf(num, 0, 3, buffer);\n';
          numCode += '  int len = 0;\n';
          numCode += '  int total = strlen(buffer);\n';
          numCode += "  char *dot = strchr(buffer, '.');\n";
          numCode += '  if (dot != NULL) {\n';
          numCode += '    char *frac = dot + 1;\n';
          numCode += '    len = strlen(frac);\n';
          numCode += '    total--;\n';
          numCode += "    while (len > 0 && frac[len - 1] == '0') {\n";
          numCode += '      len--; total--;\n';
          numCode += '    }\n';
          numCode += '    if (total > 4) len = 4 - (total - len);\n';
          numCode += '  }\n';
          numCode += '  sprintf(buffer, "%4d", round(num * pow(10, len)));\n';
          numCode += '  _digit1650.displayString(&buffer[0]);\n';
          numCode += '  _digit1650.setDot(3 - len, len > 0);\n';
          numCode += '}\n';
          this.definitions_['declare_tm1650DisplayNumber'] = 'void tm1650DisplayNumber(float number);';
          this.definitions_['tm1650DisplayNumber'] = numCode;

          const code = `tm1650DisplayNumber(${num});\n`;
          return code;
        },
        mpy(block) {
          const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
          const code = `_digit1650.show_number(${num})\n`;
          return code;
        },
      },
      // {
      //   id: 'digit',
      //   text: (
      //     <Text
      //       id="blocks.tm1650.digit"
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
      //     const code = `_digit1650.show_digit_number(${pos}, ${digit})\n`;
      //     return code;
      //   },
      // },
      {
        id: 'clear',
        text: (
          <Text
            id="blocks.tm1650.clear"
            defaultMessage="clear display"
          />
        ),
        ino(block) {
          autoInitArduino(this);
          return '_digit1650.clear();\n';
        },
        mpy(block) {
          return '_digit1650.clear()\n';
        },
      },
      '---',
      {
        id: 'brightness',
        text: (
          <Text
            id="blocks.tm1650.brightness"
            defaultMessage="set brightness [LEVEL]"
          />
        ),
        inputs: {
          LEVEL: {
            shadow: 'brightnessLevel',
            defaultValue: '7',
          },
        },
        ino(block) {
          autoInitArduino(this);
          const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
          const code = `_digit1650.setBrightness(${level});\n`;
          return code;
        },
        mpy(block) {
          const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
          const code = `_digit1650.brightness(${level})\n`;
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
            max: 7,
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
    )
    .filter(Boolean);
