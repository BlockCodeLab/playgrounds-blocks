import { Text } from '@blockcode/core';

const isIotBit = (meta) => meta.editor === '@blockcode/gui-iotbit';

export const blocks = (meta) => [
  {
    id: 'ledState',
    text: (
      <Text
        id="blocks.leds.ledState"
        defaultMessage="pin [PIN] LED [STATE]"
      />
    ),
    inputs: {
      PIN: isIotBit(meta)
        ? { menu: 'IotOutPins' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      STATE: {
        menu: 'LedStates',
      },
    },
    ino(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, OUTPUT);`;
      const code = `digitalWrite(${pin}, ${state == 1 ? 'HIGH' : 'LOW'});\n`;
      return code;
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_pwm'] = 'from machine import PWM';
      this.definitions_[pinName] = `${pinName} = PWM(Pin(${pin}), freq=1000)`;
      const code = `${pinName}.duty(${state == 1 ? 1023 : 0})\n`;
      return code;
    },
  },
  {
    id: 'toggleLed',
    text: (
      <Text
        id="blocks.leds.toggleLed"
        defaultMessage="toggle pin [PIN] LED state"
      />
    ),
    inputs: {
      PIN: isIotBit(meta)
        ? { menu: 'IotOutPins' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const state = this.valueToCode(block, 'STATE', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, OUTPUT);`;
      const code = `digitalWrite(${pin}, digitalRead(${pin}) ? LOW : HIGH);\n`;
      return code;
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_pwm'] = 'from machine import PWM';
      this.definitions_[pinName] = `${pinName} = PWM(Pin(${pin}), freq=1000)`;
      const code = `${pinName}.duty(0 if ${pinName}.duty() else 1023)\n`;
      return code;
    },
  },
  {
    id: 'brightness',
    text: (
      <Text
        id="blocks.leds.brightness"
        defaultMessage="set pin [PIN] LED brightness [LEVEL]"
      />
    ),
    inputs: {
      PIN: isIotBit(meta)
        ? { menu: 'IotOutPins' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      LEVEL: {
        shadow: 'brightnessLevel',
        defaultValue: '10',
      },
    },
    ino(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, OUTPUT);`;
      const code = `analogWrite(${pin}, round(${level} * 12.75f));\n`;
      return code;
    },
    mpy(block) {
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const level = this.valueToCode(block, 'LEVEL', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_pwm'] = 'from machine import PWM';
      this.definitions_[pinName] = `${pinName} = PWM(Pin(${pin}), freq=1000)`;
      const code = `${pinName}.duty(round(${level} * 51.15))\n`;
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
        max: 20,
      },
    },
    ino(block) {
      const code = block.getFieldValue('LEVEL') || 0;
      return [code, this.ORDER_NONE];
    },
    mpy(block) {
      const code = block.getFieldValue('LEVEL') || 0;
      return [code, this.ORDER_NONE];
    },
  },
  '---',
  {
    id: 'trafficLedsInit',
    text: (
      <Text
        id="blocks.leds.trafficLeds.init"
        defaultMessage="set traffic leds pins green [G] yellow [Y] red [R] "
      />
    ),
    inputs: {
      G: isIotBit(meta)
        ? { menu: 'IotOutPins', defaultValue: 'P5' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      Y: isIotBit(meta)
        ? { menu: 'IotOutPins', defaultValue: 'P6' }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      R: isIotBit(meta)
        ? { menu: 'IotOutPins', defaultValue: 'P7' }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    ino(block) {
      const pinR = isIotBit(meta) ? block.getFieldValue('R') : this.valueToCode(block, 'R', this.ORDER_NONE);
      const pinY = isIotBit(meta) ? block.getFieldValue('Y') : this.valueToCode(block, 'Y', this.ORDER_NONE);
      const pinG = isIotBit(meta) ? block.getFieldValue('G') : this.valueToCode(block, 'G', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pinR}`] = `pinMode(${pinR}, OUTPUT);`;
      this.definitions_[`setup_pin_${pinY}`] = `pinMode(${pinY}, OUTPUT);`;
      this.definitions_[`setup_pin_${pinG}`] = `pinMode(${pinG}, OUTPUT);`;

      // 设置交通灯辅助函数
      let code = '';
      code += 'void setTrafficLeds(bool g, bool y, bool r) {\n';
      code += `  digitalWrite(${pinR}, r);\n`;
      code += `  digitalWrite(${pinY}, y);\n`;
      code += `  digitalWrite(${pinG}, g);\n`;
      code += '}';
      this.definitions_[`declare_setTrafficLeds`] = `void setTrafficLeds(bool g, bool y, bool r);`;
      this.definitions_[`setTrafficLeds`] = code;

      return '';
    },
    mpy(block) {
      const pinR = this.valueToCode(block, 'R', this.ORDER_NONE);
      const pinY = this.valueToCode(block, 'Y', this.ORDER_NONE);
      const pinG = this.valueToCode(block, 'G', this.ORDER_NONE);
      const pinRName = `pin_${pinR}`;
      const pinYName = `pin_${pinY}`;
      const pinGName = `pin_${pinG}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_pwm'] = 'from machine import PWM';
      this.definitions_[pinRName] = `${pinRName} = PWM(Pin(${pinR}), freq=1000)`;
      this.definitions_[pinYName] = `${pinYName} = PWM(Pin(${pinY}), freq=1000)`;
      this.definitions_[pinGName] = `${pinGName} = PWM(Pin(${pinG}), freq=1000)`;

      // 设置交通灯辅助函数
      let code = '';
      code += 'def set_traffic_leds(g, y, r):\n';
      code += `  ${pinRName}.duty(1023 if r else 0)\n`;
      code += `  ${pinYName}.duty(1023 if y else 0)\n`;
      code += `  ${pinGName}.duty(1023 if g else 0)\n`;
      this.definitions_['set_traffic_leds'] = code;

      return '';
    },
  },
  {
    id: 'trafficLedsColor',
    text: (
      <Text
        id="blocks.leds.trafficLeds.color"
        defaultMessage="set traffic leds [G] green [Y] yellow [R] red"
      />
    ),
    inputs: {
      R: {
        menu: 'LedStates',
      },
      Y: {
        menu: 'LedStates',
      },
      G: {
        menu: 'LedStates',
      },
    },
    ino(block) {
      const stateR = this.valueToCode(block, 'R', this.ORDER_NONE);
      const stateY = this.valueToCode(block, 'Y', this.ORDER_NONE);
      const stateG = this.valueToCode(block, 'G', this.ORDER_NONE);
      let code = 'setTrafficLeds(';
      code += `${stateG == 1 ? 'HIGH' : 'LOW'}, `;
      code += `${stateY == 1 ? 'HIGH' : 'LOW'}, `;
      code += `${stateR == 1 ? 'HIGH' : 'LOW'});\n`;
      return code;
    },
    mpy(block) {
      const stateR = this.valueToCode(block, 'R', this.ORDER_NONE);
      const stateY = this.valueToCode(block, 'Y', this.ORDER_NONE);
      const stateG = this.valueToCode(block, 'G', this.ORDER_NONE);
      let code = 'set_traffic_leds(';
      code += `${stateG == 1 ? 'True' : 'False'}, `;
      code += `${stateY == 1 ? 'True' : 'False'}, `;
      code += `${stateR == 1 ? 'True' : 'False'})\n`;
      return code;
    },
  },
  '---',
  {
    id: 'rgbLedInit',
    text: (
      <Text
        id="blocks.leds.rgbLed.init"
        defaultMessage="set RGB LED pins red [R] green [G] blue [B]"
      />
    ),
    inputs: {
      R: isIotBit(meta)
        ? { menu: 'IotOutPins', defaultValue: 'P5' }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      G: isIotBit(meta)
        ? { menu: 'IotOutPins', defaultValue: 'P6' }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      B: isIotBit(meta)
        ? { menu: 'IotOutPins', defaultValue: 'P7' }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    ino(block) {
      const pinR = this.valueToCode(block, 'R', this.ORDER_NONE);
      const pinG = this.valueToCode(block, 'G', this.ORDER_NONE);
      const pinB = this.valueToCode(block, 'B', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pinR}`] = `pinMode(${pinR}, OUTPUT);`;
      this.definitions_[`setup_pin_${pinG}`] = `pinMode(${pinG}, OUTPUT);`;
      this.definitions_[`setup_pin_${pinB}`] = `pinMode(${pinB}, OUTPUT);`;

      // 设置颜色辅助函数
      let code = '';
      code += 'void setRGBLed(int rgb[]) {\n';
      code += `  analogWrite(${pinR}, rgb[0]);\n`;
      code += `  analogWrite(${pinG}, rgb[1]);\n`;
      code += `  analogWrite(${pinB}, rgb[2]);\n`;
      code += '}';

      this.definitions_[`declare_setRGBLed`] = `void setRGBLed(int rgb[]);`;
      this.definitions_[`setRGBLed`] = code;

      return '';
    },
    mpy(block) {
      const pinR = isIotBit(meta) ? block.getFieldValue('R') : this.valueToCode(block, 'R', this.ORDER_NONE);
      const pinG = isIotBit(meta) ? block.getFieldValue('G') : this.valueToCode(block, 'G', this.ORDER_NONE);
      const pinB = isIotBit(meta) ? block.getFieldValue('B') : this.valueToCode(block, 'B', this.ORDER_NONE);
      const pinRName = `pin_${pinR}`;
      const pinGName = `pin_${pinG}`;
      const pinBName = `pin_${pinB}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_pwm'] = 'from machine import PWM';
      this.definitions_[pinRName] = `${pinRName} = PWM(Pin(${pinR}), freq=1000)`;
      this.definitions_[pinGName] = `${pinGName} = PWM(Pin(${pinG}), freq=1000)`;
      this.definitions_[pinBName] = `${pinBName} = PWM(Pin(${pinB}), freq=1000)`;

      // 设置颜色辅助函数
      let code = '';
      code += 'def set_rgb_led(rgb):\n';
      code += `  ${pinRName}.duty(round(rgb[0] / 255 * 1023))\n`;
      code += `  ${pinGName}.duty(round(rgb[1] / 255 * 1023))\n`;
      code += `  ${pinBName}.duty(round(rgb[2] / 255 * 1023))\n`;
      this.definitions_['set_rgb_led'] = code;

      return '';
    },
  },
  {
    id: 'rgbLedColor',
    text: (
      <Text
        id="blocks.leds.rgbLed.color"
        defaultMessage="set RGB LED color [COLOR]"
      />
    ),
    inputs: {
      COLOR: {
        type: 'color',
      },
    },
    ino(block) {
      const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
      const code = `{ int rgb[3]=${color}; setRGBLed(rgb); }\n`;
      return code;
    },
    mpy(block) {
      const color = this.valueToCode(block, 'COLOR', this.ORDER_NONE);
      const code = `set_rgb_led(${color})\n`;
      return code;
    },
  },
  {
    id: 'rgbLedOff',
    text: (
      <Text
        id="blocks.leds.rgbLed.off"
        defaultMessage="turn off RGB LED"
      />
    ),
    ino(block) {
      const code = `{ int rgb[3]={0}; setRGBLed(rgb); }\n`;
      return code;
    },
    mpy(block) {
      const code = 'set_rgb_led((0,0,0))\n';
      return code;
    },
  },
];

export const menus = {
  LedStates: {
    type: 'integer',
    inputMode: true,
    defaultValue: '1',
    items: [
      [
        <Text
          id="blocks.leds.state.on"
          defaultMessage="on"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.leds.state.off"
          defaultMessage="off"
        />,
        '0',
      ],
    ],
  },
  IotOutPins: {
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
