import { Text } from '@blockcode/core';

const isIotBit = (meta) => meta.editor === '@blockcode/gui-iotbit';

export const blocks = (meta) => [
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
      PIN: isIotBit(meta)
        ? { menu: 'iotPWMPins' }
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
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const num = this.valueToCode(block, 'NUM', this.ORDER_NONE);
      const pinName = `_ledpixel${pin}`;
      this.definitions_[`init_${pinName}`] = `${pinName} = ledpixel.LedPixel(${pin}, ${num})`;
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
      PIN: isIotBit(meta)
        ? { menu: 'iotPWMPins' }
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
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
      const brightness = this.valueToCode(block, 'BRIGHTNESS', this.ORDER_NONE);
      const pos = this.getAdjusted(block, 'POS');

      const pinName = `_ledpixel${pin}`;
      let code = '';
      code += `${pinName}.set_led(${pos}, ${brightness}, ${color})\n`;

      const nextBlock = block.getNextBlock();
      if (nextBlock?.type.endsWith('-ws2812pixels_color')) {
        return code;
      }

      code += `${pinName}.write()\n`;
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
      PIN: isIotBit(meta)
        ? { menu: 'iotPWMPins' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const code = `_ledpixel${pin}.clear()\n`;
      return code;
    },
  },
  '---',
  {
    id: 'effectWait',
    text: (
      <Text
        id="blocks.ws2812pixels.effectWait"
        defaultMessage="start pin [PIN] [EFFECT] effect and wait"
      />
    ),
    inputs: {
      PIN: isIotBit(meta)
        ? { menu: 'iotPWMPins' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      EFFECT: {
        menu: 'effectOption',
      },
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const effect = block.getFieldValue('EFFECT');
      const code = `await _ledpixel${pin}.${effect}()\n`;
      return code;
    },
  },
  {
    id: 'effectColorWait',
    text: (
      <Text
        id="blocks.ws2812pixels.effectColorWait"
        defaultMessage="start pin [PIN] [COLOR] [EFFECT] effect and wait"
      />
    ),
    inputs: {
      PIN: isIotBit(meta)
        ? { menu: 'iotPWMPins' }
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
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
      const effect = block.getFieldValue('EFFECT');
      const code = `await _ledpixel${pin}.${effect}(${color})\n`;
      return code;
    },
  },
  '---',
  {
    id: 'effect',
    text: (
      <Text
        id="blocks.ws2812pixels.effect"
        defaultMessage="start pin [PIN] [EFFECT] effect"
      />
    ),
    inputs: {
      PIN: isIotBit(meta)
        ? { menu: 'iotPWMPins' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      EFFECT: {
        menu: 'effectOption',
      },
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const effect = block.getFieldValue('EFFECT');
      const code = `asyncio.create_task(_ledpixel${pin}.${effect}())\n`;
      return code;
    },
  },
  {
    id: 'effectColor',
    text: (
      <Text
        id="blocks.ws2812pixels.effectColor"
        defaultMessage="start pin [PIN] [COLOR] [EFFECT] effect"
      />
    ),
    inputs: {
      PIN: isIotBit(meta)
        ? { menu: 'iotPWMPins' }
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
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
      const effect = block.getFieldValue('EFFECT');
      const code = `asyncio.create_task(_ledpixel${pin}.${effect}(${color}))\n`;
      return code;
    },
  },
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
  iotPWMPins: {
    items: [
      ['P0', '33'],
      ['P1', '32'],
      // ['P2', '35'],
      // ['P3', '34'],
      // ['P4', '39'],
      ['P5', '0'],
      ['P6', '16'],
      ['P7', '17'],
      ['P8', '26'],
      ['P9', '25'],
      // ['P10', '36'],
      ['P11', '2'],
      // ['P12', ''],
      ['P13', '18'],
      ['P14', '19'],
      ['P15', '21'],
      ['P16', '5'],
      ['P19', '22'],
      ['P20', '23'],
      ['P23', '27'],
      ['P24', '14'],
      ['P25', '12'],
      ['P26', '13'],
      ['P27', '15'],
      ['P28', '4'],
    ],
  },
};
