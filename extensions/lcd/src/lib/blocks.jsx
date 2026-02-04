import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.lcd.init"
        defaultMessage="set lcd display [SIZE] address [ADDR]"
      />
    ),
    inputs: {
      SIZE: {
        defaultValue: '16,2',
        menu: [
          ['0801', '8,1'],
          ['0802', '8,2'],
          ['1601', '16,1'],
          ['1602', '16,2'],
          ['1604', '16,4'],
          ['2002', '20,2'],
          ['2004', '20,4'],
          ['2402', '24,2'],
          ['4002', '40,2'],
          ['4004', '40,4'],
        ],
      },
      ADDR: {
        menu: [
          ['0×27', '0x27'],
          ['0×26', '0x26'],
          ['0×25', '0x25'],
          ['0×24', '0x24'],
          ['0×23', '0x23'],
          ['0×22', '0x22'],
          ['0×21', '0x21'],
          ['0×20', '0x20'],
        ],
      },
    },
    ino(block) {
      const size = block.getFieldValue('SIZE');
      const addr = block.getFieldValue('ADDR');
      this.definitions_['include_lcdi2c'] = '#include <LCDI2C_Generic.h>';
      this.definitions_['variable_lcd'] = `LCDI2C_Generic lcd(${addr}, ${size});`;
      this.definitions_['setup_lcd'] = 'lcd.init();';
      return '';
    },
  },
  {
    id: 'backlight',
    text: (
      <Text
        id="blocks.lcd.backlight"
        defaultMessage="set backlight [STATE]"
      />
    ),
    inputs: {
      STATE: {
        inputMode: true,
        type: 'integer',
        defaultValue: '1',
        menu: [
          [
            <Text
              id="blocks.lcd.stateOn"
              defaultMessage="on"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.lcd.stateOff"
              defaultMessage="off"
            />,
            '0',
          ],
        ],
      },
    },
    ino(block) {
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      const code = `lcd.setBacklight(${state});\n`;
      return code;
    },
  },
  '---',
  {
    id: 'text',
    text: (
      <Text
        id="blocks.lcd.text"
        defaultMessage="display [TEXT] delay [SEC] second"
      />
    ),
    inputs: {
      TEXT: {
        type: 'string',
        defaultValue: 'Hello World',
      },
      SEC: {
        type: 'positive_integer',
        defaultValue: '1',
      },
    },
    ino(block) {
      const text = this.valueToCode(block, 'TEXT', this.ORDER_NONE);
      const delay = this.valueToCode(block, 'SEC', this.ORDER_NONE);
      let code = '';
      code += 'lcd.home();\n';
      code += `lcd.print(${text}, ${delay});\n`;
      return code;
    },
  },
  {
    id: 'textLine',
    text: (
      <Text
        id="blocks.lcd.textLine"
        defaultMessage="display [TEXT] at line [LINE]"
      />
    ),
    inputs: {
      TEXT: {
        type: 'string',
        defaultValue: 'Hello',
      },
      LINE: {
        menu: [1, 2, 3, 4],
      },
    },
    ino(block) {
      const text = this.valueToCode(block, 'TEXT', this.ORDER_NONE);
      const line = block.getFieldValue('LINE');
      let code = '';
      code += `lcd.setCursor(0, ${line - 1});\n`;
      code += `lcd.println(${text});\n`;
      return code;
    },
  },
  {
    id: 'textXY',
    text: (
      <Text
        id="blocks.lcd.textXY"
        defaultMessage="display [TEXT] at row:[ROW] col:[COL]"
      />
    ),
    inputs: {
      TEXT: {
        type: 'string',
        defaultValue: 'Hello',
      },
      ROW: {
        type: 'positive_integer',
        defaultValue: '1',
      },
      COL: {
        type: 'positive_integer',
        defaultValue: '1',
      },
    },
    ino(block) {
      const text = this.valueToCode(block, 'TEXT', this.ORDER_NONE);
      const row = this.getAdjusted(block, 'ROW');
      const col = this.getAdjusted(block, 'COL');
      let code = '';
      code += `lcd.setCursor(${col}, ${row});\n`;
      code += `lcd.println(${text});\n`;
      return code;
    },
  },
  {
    id: 'clear',
    text: (
      <Text
        id="blocks.lcd.clear"
        defaultMessage="clear"
      />
    ),
    ino(block) {
      const code = 'lcd.clear();\n';
      return code;
    },
  },
];
