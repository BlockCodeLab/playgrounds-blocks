import { Text } from '@blockcode/core';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const blocks = (meta) => [
  isArduino(meta)
    ? {
        id: 'initDisplay',
        text: (
          <Text
            id="blocks.oled.initDisplay"
            defaultMessage="set oled [DRIVER] display [SIZE]"
          />
        ),
        inputs: {
          DRIVER: {
            defaultValue: 'SSD1306',
            menu: ['SSD1306', 'SH1106'],
          },
          SIZE: {
            defaultValue: '128X64',
            menu: [
              ['128×32', '128X32'],
              ['128×64', '128X64'],
            ],
          },
        },
        ino(block) {
          const driver = block.getFieldValue('DRIVER');
          const size = block.getFieldValue('SIZE');
          this.definitions_['include_u8g2lib'] = '#include <U8g2lib.h>';
          this.definitions_['variable_oled'] = `U8G2_${driver}_${size}_NONAME_F_HW_I2C oled(U8G2_R0);`;
          this.definitions_['setup_oled'] = 'oled.setBusClock(400000); oled.begin();';
          return '';
        },
      }
    : {
        id: 'initI2C',
        text: (
          <Text
            id="blocks.oled.initI2C"
            defaultMessage="set oled [DRIVER] SCL:[SCL] SDA:[SDA] display [SIZE]"
          />
        ),
        inputs: {
          DRIVER: {
            defaultValue: 'SSD1306',
            menu: ['SSD1306', 'SH1106'],
          },
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
          SIZE: {
            defaultValue: '128X64',
            menu: [
              ['128×32', '128X32'],
              ['128×64', '128X64'],
            ],
          },
        },
        mpy(block) {
          const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_NONE);
          const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_NONE);
          const driver = block.getFieldValue('DRIVER');
          const size = block.getFieldValue('SIZE');
          this.definitions_['oled'] = `_oled = oled.${driver}_I2C(${size.replace('X', ',')}, ${scl}, ${sda})`;
          return '';
        },
      },
  {
    id: 'brightness',
    text: (
      <Text
        id="blocks.oled.brightness"
        defaultMessage="set display brightness to [BRIGHTNESS] %"
      />
    ),
    inputs: {
      BRIGHTNESS: {
        shadow: 'brightnessSlider',
        defaultValue: 80,
      },
    },
    ino(block) {
      const brightness = this.valueToCode(block, 'BRIGHTNESS', this.ORDER_NONE);
      const code = `oled.setContrast(map(${brightness}, 0, 100, 0, 255));\n`;
      return code;
    },
    mpy(block) {
      const brightness = this.valueToCode(block, 'BRIGHTNESS', this.ORDER_NONE);
      const code = `_oled.contrast(round(${brightness} / 100 * 255))\n`;
      return code;
    },
  },
  {
    id: 'brightnessSlider',
    shadow: true,
    output: 'number',
    inputs: {
      BRIGHTNESS: {
        type: 'slider',
        defaultValue: 0,
        min: 0,
        max: 100,
      },
    },
    mpy(block) {
      const code = block.getFieldValue('BRIGHTNESS') || 0;
      return [code, this.ORDER_NONE];
    },
    ino(block) {
      const code = block.getFieldValue('BRIGHTNESS') || 0;
      return [code, this.ORDER_NONE];
    },
  },
  '---',
  isArduino(meta) && {
    id: 'pageBuffer',
    text: (
      <Text
        id="blocks.oled.pageBuffer"
        defaultMessage="page buffer display"
      />
    ),
    substack: true,
    ino(block) {
      if (this.definitions_['variable_oled']) {
        this.definitions_['variable_oled'] = this.definitions_['variable_oled'].replace('_F_', '_1_');
      }

      const branchCode = this.statementToCode(block, 'SUBSTACK') || '';
      let code = '';
      code += 'oled.firstPage();\n';
      code += 'do {\n';
      code += branchCode;
      code += '} while (oled.nextPage());\n';

      return code;
    },
  },
  {
    id: 'clearDisplay',
    text: (
      <Text
        id="blocks.oled.clearDisplay"
        defaultMessage="clear display"
      />
    ),
    ino(block) {
      const code = 'oled.clearBuffer();\n';
      return code;
    },
    mpy(block) {
      const code = '_oled.fill(0)\n';
      return code;
    },
  },
  {
    id: 'updateDisplay',
    text: (
      <Text
        id="blocks.oled.updateDisplay"
        defaultMessage="update display"
      />
    ),
    ino(block) {
      const code = 'oled.sendBuffer();\n';
      return code;
    },
    mpy(block) {
      const code = '_oled.show()\n';
      return code;
    },
  },
  '---',
  {
    id: 'drawText',
    text: (
      <Text
        id="blocks.oled.drawText"
        defaultMessage="display text [TEXT] at x:[X] y:[Y]"
      />
    ),
    inputs: {
      TEXT: {
        type: 'string',
        defaultValue: 'hello',
      },
      X: {
        type: 'integer',
        defaultValue: 0,
      },
      Y: {
        type: 'integer',
        defaultValue: 0,
      },
    },
    ino(block) {
      this.definitions_['setup_oledFont'] = 'oled.setFont(u8g2_font_crox1h_tf);';
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      let text = this.valueToCode(block, 'TEXT', this.ORDER_NONE);
      if (!/^".*"$/.test(text)) {
        text = `String(${text}).c_str()`;
      }
      const code = `oled.drawUTF8(${x}, ${y} + 12, ${text});\n`;
      return code;
    },
    mpy(block) {
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);
      const text = this.valueToCode(block, 'TEXT', this.ORDER_NONE);
      const code = `_oled.draw_text(${x}, ${y}, str(${text}))\n`;
      return code;
    },
  },
  {
    id: 'drawTextLine',
    text: (
      <Text
        id="blocks.oled.drawTextLine"
        defaultMessage="display text [TEXT] at line [LINE]"
      />
    ),
    inputs: {
      TEXT: {
        type: 'string',
        defaultValue: 'hello world',
      },
      LINE: {
        menu: [1, 2, 3, 4, 5],
      },
    },
    ino(block) {
      this.definitions_['setup_oledFont'] = 'oled.setFont(u8g2_font_crox1h_tf);';
      const line = parseInt(block.getFieldValue('LINE'));

      let text = this.valueToCode(block, 'TEXT', this.ORDER_NONE);
      if (!/^".*"$/.test(text)) {
        text = `String(${text}).c_str()`;
      }
      const code = `oled.drawUTF8(1, ${line * 12 + (line - 1) - 2}, ${text});\n`;
      return code;
    },
    mpy(block) {
      const line = parseInt(block.getFieldValue('LINE'));
      const text = this.valueToCode(block, 'TEXT', this.ORDER_NONE);
      const code = `_oled.draw_text(1, ${(line - 1) * 13}, str(${text}));\n`;
      return code;
    },
  },
  '---',
  {
    id: 'drawPixel',
    text: (
      <Text
        id="blocks.oled.drawPixel"
        defaultMessage="draw pixel x:[X] y:[Y]"
      />
    ),
    inputs: {
      X: {
        type: 'integer',
        defaultValue: 10,
      },
      Y: {
        type: 'integer',
        defaultValue: 10,
      },
    },
    ino(block) {
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `oled.drawPixel(${x}, ${y});\n`;
      return code;
    },
    mpy(block) {
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `_oled.pixel(${x}, ${y})\n`;
      return code;
    },
  },
  {
    id: 'drawLine',
    text: (
      <Text
        id="blocks.oled.drawLine"
        defaultMessage="draw line from x1:[X1] y1:[Y1] to x2:[X2] y2:[Y2]"
      />
    ),
    inputs: {
      X1: {
        type: 'integer',
        defaultValue: 0,
      },
      Y1: {
        type: 'integer',
        defaultValue: 0,
      },
      X2: {
        type: 'integer',
        defaultValue: 20,
      },
      Y2: {
        type: 'integer',
        defaultValue: 20,
      },
    },
    ino(block) {
      const x1 = this.valueToCode(block, 'X1', this.ORDER_NONE);
      const y1 = this.valueToCode(block, 'Y1', this.ORDER_NONE);
      const x2 = this.valueToCode(block, 'X2', this.ORDER_NONE);
      const y2 = this.valueToCode(block, 'Y2', this.ORDER_NONE);

      const code = `oled.drawLine(${x1}, ${y1}, ${x2}, ${y2});\n`;
      return code;
    },
    mpy(block) {
      const x1 = this.valueToCode(block, 'X1', this.ORDER_NONE);
      const y1 = this.valueToCode(block, 'Y1', this.ORDER_NONE);
      const x2 = this.valueToCode(block, 'X2', this.ORDER_NONE);
      const y2 = this.valueToCode(block, 'Y2', this.ORDER_NONE);

      const code = `_oled.line(${x1}, ${y1}, ${x2}, ${y2})\n`;
      return code;
    },
  },
  {
    id: 'drawEllipse',
    text: (
      <Text
        id="blocks.oled.drawEllipse"
        defaultMessage="draw ellipse with x-radius:[RX] and y-radius:[RY] at x:[X] y:[Y]"
      />
    ),
    inputs: {
      RX: {
        type: 'positive_integer',
        defaultValue: 20,
      },
      RY: {
        type: 'positive_integer',
        defaultValue: 10,
      },
      X: {
        type: 'integer',
        defaultValue: 0,
      },
      Y: {
        type: 'integer',
        defaultValue: 0,
      },
    },
    ino(block) {
      const rx = this.valueToCode(block, 'RX', this.ORDER_NONE);
      const ry = this.valueToCode(block, 'RY', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `oled.drawEllipse(${x}, ${y}, ${rx}, ${ry});\n`;
      return code;
    },
    mpy(block) {
      const rx = this.valueToCode(block, 'RX', this.ORDER_NONE);
      const ry = this.valueToCode(block, 'RY', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `_oled.ellipse(${x}, ${y}, ${rx}, ${ry})\n`;
      return code;
    },
  },
  {
    id: 'drawRect',
    text: (
      <Text
        id="blocks.oled.drawRect"
        defaultMessage="draw rect with width:[WIDTH] height:[HEIGHT] at x:[X] y:[Y]"
      />
    ),
    inputs: {
      WIDTH: {
        type: 'positive_integer',
        defaultValue: 20,
      },
      HEIGHT: {
        type: 'positive_integer',
        defaultValue: 10,
      },
      X: {
        type: 'integer',
        defaultValue: 0,
      },
      Y: {
        type: 'integer',
        defaultValue: 0,
      },
    },
    ino(block) {
      const width = this.valueToCode(block, 'WIDTH', this.ORDER_NONE);
      const height = this.valueToCode(block, 'HEIGHT', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `oled.drawFrame(${x}, ${y}, ${width}, ${height});\n`;
      return code;
    },
    mpy(block) {
      const width = this.valueToCode(block, 'WIDTH', this.ORDER_NONE);
      const height = this.valueToCode(block, 'HEIGHT', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `_oled.rect(${x}, ${y}, ${width}, ${height})\n`;
      return code;
    },
  },
  isArduino(meta) && {
    id: 'drawRoundRect',
    text: (
      <Text
        id="blocks.oled.drawRoundRect"
        defaultMessage="draw round rect with width:[WIDTH] height:[HEIGHT] radius:[R] at x:[X] y:[Y]"
      />
    ),
    inputs: {
      WIDTH: {
        type: 'positive_integer',
        defaultValue: 20,
      },
      HEIGHT: {
        type: 'positive_integer',
        defaultValue: 10,
      },
      R: {
        type: 'positive_integer',
        defaultValue: 5,
      },
      X: {
        type: 'integer',
        defaultValue: 0,
      },
      Y: {
        type: 'integer',
        defaultValue: 0,
      },
    },
    ino(block) {
      const width = this.valueToCode(block, 'WIDTH', this.ORDER_NONE);
      const height = this.valueToCode(block, 'HEIGHT', this.ORDER_NONE);
      const r = this.valueToCode(block, 'R', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `oled.drawRFrame(${x}, ${y}, ${width}, ${height}, ${r});\n`;
      return code;
    },
  },
  '---',
  isArduino(meta) && {
    id: 'fillEllipse',
    text: (
      <Text
        id="blocks.oled.fillEllipse"
        defaultMessage="fill ellipse with x-radius:[RX] and y-radius:[RY] at x:[X] y:[Y]"
      />
    ),
    inputs: {
      RX: {
        type: 'positive_integer',
        defaultValue: 20,
      },
      RY: {
        type: 'positive_integer',
        defaultValue: 10,
      },
      X: {
        type: 'integer',
        defaultValue: 0,
      },
      Y: {
        type: 'integer',
        defaultValue: 0,
      },
    },
    ino(block) {
      const rx = this.valueToCode(block, 'RX', this.ORDER_NONE);
      const ry = this.valueToCode(block, 'RY', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `oled.drawFilledEllipse(${x}, ${y}, ${rx}, ${ry});\n`;
      return code;
    },
  },
  {
    id: 'fillRect',
    text: (
      <Text
        id="blocks.oled.fillRect"
        defaultMessage="fill rect with width:[WIDTH] height:[HEIGHT] at x:[X] y:[Y]"
      />
    ),
    inputs: {
      WIDTH: {
        type: 'positive_integer',
        defaultValue: 20,
      },
      HEIGHT: {
        type: 'positive_integer',
        defaultValue: 10,
      },
      X: {
        type: 'integer',
        defaultValue: 0,
      },
      Y: {
        type: 'integer',
        defaultValue: 0,
      },
    },
    ino(block) {
      const width = this.valueToCode(block, 'WIDTH', this.ORDER_NONE);
      const height = this.valueToCode(block, 'HEIGHT', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `oled.drawBox(${x}, ${y}, ${width}, ${height});\n`;
      return code;
    },
    mpy(block) {
      const width = this.valueToCode(block, 'WIDTH', this.ORDER_NONE);
      const height = this.valueToCode(block, 'HEIGHT', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `_oled.fill_rect(${x}, ${y}, ${width}, ${height})\n`;
      return code;
    },
  },
  isArduino(meta) && {
    id: 'fillRoundRect',
    text: (
      <Text
        id="blocks.oled.fillRoundRect"
        defaultMessage="fill round rect with width:[WIDTH] height:[HEIGHT] radius:[R] at x:[X] y:[Y]"
      />
    ),
    inputs: {
      WIDTH: {
        type: 'positive_integer',
        defaultValue: 20,
      },
      HEIGHT: {
        type: 'positive_integer',
        defaultValue: 10,
      },
      R: {
        type: 'positive_integer',
        defaultValue: 5,
      },
      X: {
        type: 'integer',
        defaultValue: 0,
      },
      Y: {
        type: 'integer',
        defaultValue: 0,
      },
    },
    ino(block) {
      const width = this.valueToCode(block, 'WIDTH', this.ORDER_NONE);
      const height = this.valueToCode(block, 'HEIGHT', this.ORDER_NONE);
      const r = this.valueToCode(block, 'R', this.ORDER_NONE);
      const x = this.valueToCode(block, 'X', this.ORDER_NONE);
      const y = this.valueToCode(block, 'Y', this.ORDER_NONE);

      const code = `oled.drawRBox(${x}, ${y}, ${width}, ${height}, ${r});\n`;
      return code;
    },
  },
];
