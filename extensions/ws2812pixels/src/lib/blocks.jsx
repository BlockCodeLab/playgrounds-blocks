import { changeCase } from '@blockcode/utils';
import { Text } from '@blockcode/core';

const isArduino = (meta) => meta.editor === '@blockcode/gui-arduino';
const notArduino = (meta) => meta.editor !== '@blockcode/gui-arduino';

export const blocks = (meta) =>
  [
    // [TODO] 彩灯点阵图案编辑器
    // {
    //   button: 'LED_PIXELS_CREATOR',
    // },
    {
      id: 'init',
      text: (
        <Text
          id="blocks.ws2812pixels.init"
          defaultMessage="set pin [PIN] leds [NUM]"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
        NUM: {
          type: 'positive_integer',
          defaultValue: 1,
        },
      },
      mpy(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
        const pinName = `ledpixel_${pin}`;
        this.definitions_['import_pin'] = 'from machine import Pin';
        this.definitions_['import_ledpixel'] = 'from ledpixel import LedPixel';
        this.definitions_[`init_${pinName}`] = `${pinName} = LedPixel(Pin(${pin}), ${num})`;
        return '';
      },
      ino(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
        const pinName = `ledpixel_${pin}`;
        this.definitions_[`variable_${pinName}`] = `LedPixel<${pin}, ${num}> ${pinName};`;
        this.definitions_[`setup_${pinName}`] = `${pinName}.begin();`;
        return '';
      },
    },
    '---',
    {
      id: 'color',
      text: (
        <Text
          id="blocks.ws2812pixels.led"
          defaultMessage="set pin [PIN] led [POS] color [COLOR] brightness[BRIGHTNESS]"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
        POS: {
          type: 'positive_integer',
          defaultValue: 1,
        },
        COLOR: {
          type: 'color',
        },
        BRIGHTNESS: {
          shadow: 'brightnessSlider',
          defaultValue: 10,
        },
      },
      mpy(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
        const brightness = this.valueToCode(block, 'BRIGHTNESS', this.ORDER_NONE);
        const pos = this.getAdjusted(block, 'POS');

        const pinName = `ledpixel_${pin}`;
        let code = '';
        code += `${pinName}.set_led(${pos}, ${brightness}, ${color})\n`;

        const nextBlock = block.getNextBlock();
        if (nextBlock?.type.endsWith('-ws2812pixels_color')) {
          return code;
        }

        code += `${pinName}.write()\n`;
        return code;
      },
      ino(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
        const brightness = this.valueToCode(block, 'BRIGHTNESS', this.ORDER_NONE);
        const pos = this.getAdjusted(block, 'POS');

        const pinName = `ledpixel_${pin}`;
        let code = '';
        code += `${pinName}.setPixel(${pos}, ${brightness}, ${color});\n`;

        const nextBlock = block.getNextBlock();
        if (nextBlock?.type.endsWith('-ws2812pixels_color')) {
          return code;
        }

        code += `${pinName}.show();\n`;
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
          max: 10,
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
    {
      id: 'close',
      text: (
        <Text
          id="blocks.ws2812pixels.close"
          defaultMessage="close pin [PIN] leds"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
      },
      mpy(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const code = `ledpixel_${pin}.clear()\n`;
        return code;
      },
      ino(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const code = `ledpixel_${pin}.clear();\n`;
        return code;
      },
    },
    '---',
    notArduino(meta) && {
      id: 'effectWait',
      text: (
        <Text
          id="blocks.ws2812pixels.effectWait"
          defaultMessage="pin [PIN] start [EFFECT] effect and wait"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
        EFFECT: {
          menu: 'effectOption',
        },
      },
      mpy(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const effect = block.getFieldValue('EFFECT');
        const code = `await ledpixel_${pin}.${effect}()\n`;
        return code;
      },
    },
    notArduino(meta) && {
      id: 'effectColorWait',
      text: (
        <Text
          id="blocks.ws2812pixels.effectColorWait"
          defaultMessage="pin [PIN] start [COLOR] [EFFECT] effect and wait"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
        COLOR: {
          type: 'color',
        },
        EFFECT: {
          menu: 'effectColorOption',
        },
      },
      mpy(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
        const effect = block.getFieldValue('EFFECT');
        const code = `await ledpixel_${pin}.${effect}(${color})\n`;
        return code;
      },
    },
    '---',
    notArduino(meta) && {
      id: 'effect',
      text: (
        <Text
          id="blocks.ws2812pixels.effect"
          defaultMessage="pin [PIN] start [EFFECT] effect"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
        EFFECT: {
          menu: 'effectOption',
        },
      },
      mpy(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const effect = block.getFieldValue('EFFECT');
        const code = `asyncio.create_task(ledpixel_${pin}.${effect}())\n`;
        return code;
      },
    },
    notArduino(meta) && {
      id: 'effectColor',
      text: (
        <Text
          id="blocks.ws2812pixels.effectColor"
          defaultMessage="pin [PIN] start [COLOR] [EFFECT] effect"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
        COLOR: {
          type: 'color',
        },
        EFFECT: {
          menu: 'effectColorOption',
        },
      },
      mpy(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
        const effect = block.getFieldValue('EFFECT');
        const code = `asyncio.create_task(ledpixel_${pin}.${effect}(${color}))\n`;
        return code;
      },
    },
    isArduino(meta) && {
      id: 'effect',
      text: (
        <Text
          id="blocks.ws2812pixels.effectStep"
          defaultMessage="pin [PIN] [EFFECT] effect"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
        EFFECT: {
          menu: 'arduinoEffectOption',
        },
      },
      ino(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const effect = changeCase.camelCase(block.getFieldValue('EFFECT'));
        const code = `ledpixel_${pin}.${effect}();\n`;
        return code;
      },
    },
    isArduino(meta) && {
      id: 'effectColor',
      text: (
        <Text
          id="blocks.ws2812pixels.effectStepColor"
          defaultMessage="pin [PIN] [COLOR] [EFFECT] effect"
        />
      ),
      inputs: {
        PIN: meta.boardPins
          ? { menu: meta.boardPins.out }
          : {
              type: 'positive_integer',
              defaultValue: 1,
            },
        COLOR: {
          type: 'color',
        },
        EFFECT: {
          menu: 'effectColorOption',
        },
      },
      ino(block) {
        const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
        const effect = changeCase.camelCase(block.getFieldValue('EFFECT'));
        const code = `ledpixel_${pin}.${effect}(${color});\n`;
        return code;
      },
    },
  ].filter(Boolean);

const arduinoStepEffects = [
  [
    <Text
      id="blocks.ws2812pixels.effect.chase"
      defaultMessage="chase"
    />,
    'chase',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.twinkle"
      defaultMessage="twinkle"
    />,
    'twinkle',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.sparkle"
      defaultMessage="sparkle"
    />,
    'sparkle',
  ],
];

const effects = [
  [
    <Text
      id="blocks.ws2812pixels.effect.chase"
      defaultMessage="chase"
    />,
    'chase',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.twinkle"
      defaultMessage="twinkle"
    />,
    'twinkle',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.sparkle"
      defaultMessage="sparkle"
    />,
    'sparkle',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.breathing"
      defaultMessage="breathing"
    />,
    'breathing',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.scanner"
      defaultMessage="scanner"
    />,
    'scanner',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.waterfall"
      defaultMessage="waterfall"
    />,
    'waterfall',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.whirlpool"
      defaultMessage="whirlpool"
    />,
    'whirlpool',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.spot"
      defaultMessage="light spot"
    />,
    'light_spot',
  ],
  [
    <Text
      id="blocks.ws2812pixels.effect.wheel"
      defaultMessage="light wheel"
    />,
    'light_wheel',
  ],
];

export const menus = {
  effectOption: {
    items: [
      [
        <Text
          id="blocks.ws2812pixels.effect.rainbow"
          defaultMessage="rainbow cycle"
        />,
        'rainbow_cycle',
      ],
      ...effects,
    ],
  },
  effectColorOption: {
    items: effects,
  },
  arduinoEffectOption: {
    items: [
      [
        <Text
          id="blocks.ws2812pixels.effect.rainbow"
          defaultMessage="rainbow cycle"
        />,
        'rainbow_cycle',
      ],
      ...arduinoStepEffects,
    ],
  },
};
