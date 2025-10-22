import { Text } from '@blockcode/core';

const isArduino = (meta) => meta.editor === '@blockcode/gui-arduino';
const isNano = (meta) => ['ArduinoNano', 'BLENANO'].includes(meta.boardType);

export const blocks = (meta) => [
  {
    id: 'rawValue',
    text: (
      <Text
        id="blocks.ainput.rawValue"
        defaultMessage="pin [PIN] raw value"
      />
    ),
    output: 'number',
    inputs: {
      PIN: isArduino(meta)
        ? {
            menu: isNano(meta) ? 'NANO_ANALOG_PINS' : 'UNO_ANALOG_PINS',
          }
        : {
            type: 'integer',
            defaultValue: '1',
          },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `analogRead(${pin})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_adc'] = 'from machine import ADC';
      this.definitions_[pinName] = `${pinName} = ADC(Pin(${pin}))`;
      this.definitions_[`${pinName}_atten`] = `${pinName}.atten(ADC.ATTN_11DB)`;
      this.definitions_[`${pinName}_width`] = `${pinName}.width(ADC.WIDTH_10BIT)`;
      const code = `${pinName}.read()`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'percentage',
    text: (
      <Text
        id="blocks.ainput.percentage"
        defaultMessage="pin [PIN] percentage"
      />
    ),
    output: 'number',
    inputs: {
      PIN: isArduino(meta)
        ? {
            menu: isNano(meta) ? 'NANO_ANALOG_PINS' : 'UNO_ANALOG_PINS',
          }
        : {
            type: 'integer',
            defaultValue: '1',
          },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `round((analogRead(${pin}) / 1023.0f) * 100)`;
      return [code, this.ORDER_NONE];
    },
    mpy(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_adc'] = 'from machine import ADC';
      this.definitions_[pinName] = `${pinName} = ADC(Pin(${pin}))`;
      this.definitions_[`${pinName}_atten`] = `${pinName}.atten(ADC.ATTN_11DB)`;
      this.definitions_[`${pinName}_width`] = `${pinName}.width(ADC.WIDTH_10BIT)`;
      const code = `round((${pinName}.read() / 1023) * 100)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'joystick',
    text: (
      <Text
        id="blocks.ainput.joystick"
        defaultMessage="pin [PIN] joystick"
      />
    ),
    output: 'number',
    inputs: {
      PIN: isArduino(meta)
        ? {
            menu: isNano(meta) ? 'NANO_ANALOG_PINS' : 'UNO_ANALOG_PINS',
          }
        : {
            type: 'integer',
            defaultValue: '1',
          },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `round(((analogRead(${pin}) - 511) / 511.0f) * 100)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_adc'] = 'from machine import ADC';
      this.definitions_[pinName] = `${pinName} = ADC(Pin(${pin}))`;
      this.definitions_[`${pinName}_atten`] = `${pinName}.atten(ADC.ATTN_11DB)`;
      this.definitions_[`${pinName}_width`] = `${pinName}.width(ADC.WIDTH_10BIT)`;
      const code = `round(((${pinName}.read() - 511) / 511) * 100)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'voltage',
    text: (
      <Text
        id="blocks.ainput.voltage"
        defaultMessage="pin [PIN] voltage" //, reference [REF]"
      />
    ),
    output: 'number',
    inputs: {
      PIN: isArduino(meta)
        ? {
            menu: isNano(meta) ? 'NANO_ANALOG_PINS' : 'UNO_ANALOG_PINS',
          }
        : {
            type: 'integer',
            defaultValue: '1',
          },
      // REF: {
      //   defaultValue: isArduino(meta) ? '500' : '330',
      //   menu: [
      //     ['3.3V', '330'],
      //     ['5V', '500'],
      //   ],
      // },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      // const ref = block.getFieldValue('REF');
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `round((analogRead(${pin}) / 1023.0f) * 500) / 100.0f`; // 精度，小数点后两位
      return [code, this.ORDER_NONE];
    },
    mpy(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      // const ref = block.getFieldValue('REF');
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_adc'] = 'from machine import ADC';
      this.definitions_[pinName] = `${pinName} = ADC(Pin(${pin}))`;
      this.definitions_[`${pinName}_atten`] = `${pinName}.atten(ADC.ATTN_11DB)`;
      const code = `round(${pinName}.read_uv() / 1_000_000, 2)`; // 精度，小数点后两位
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
];

export const menus = {
  UNO_ANALOG_PINS: {
    // Arduino UNO 模拟读引脚
    items: [
      ['A0', 'A0'],
      ['A1', 'A1'],
      ['A2', 'A2'],
      ['A3', 'A3'],
      ['A4', 'A4'],
      ['A5', 'A5'],
    ],
  },
  NANO_ANALOG_PINS: {
    // Arduino Nano 模拟读引脚
    items: [
      ['A0', 'A0'],
      ['A1', 'A1'],
      ['A2', 'A2'],
      ['A3', 'A3'],
      ['A4', 'A4'],
      ['A5', 'A5'],
      ['A6', 'A6'],
      ['A7', 'A7'],
    ],
  },
};
