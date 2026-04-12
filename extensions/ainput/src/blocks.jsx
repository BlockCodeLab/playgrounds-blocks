import { Text } from '@blockcode/core';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

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
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.adc,
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `analogRead(${pin})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
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
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.adc,
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `round((analogRead(${pin}) / 1023.0f) * 100)`;
      return [code, this.ORDER_NONE];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
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
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.adc,
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `round(((analogRead(${pin}) - 511) / 511.0f) * 100)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
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
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.adc,
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
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
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      // const ref = block.getFieldValue('REF');
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `round((analogRead(${pin}) / 1023.0f) * 500) / 100.0f`; // 精度，小数点后两位
      return [code, this.ORDER_NONE];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
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
  '---',
  {
    id: 'high',
    text: (
      <Text
        id="blocks.ainput.high"
        defaultMessage="pin [PIN] is hight?"
      />
    ),
    output: 'boolean',
    inputs: {
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.in,
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `(digitalRead(${pin}) == HIGH)`;
      return [code, this.ORDER_NONE];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_[pinName] = `${pinName} = Pin(${pin}, Pin.IN)`;
      const code = `(${pinName}.value() == 1)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'low',
    text: (
      <Text
        id="blocks.ainput.low"
        defaultMessage="pin [PIN] is low?"
      />
    ),
    output: 'boolean',
    inputs: {
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.in,
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `(digitalRead(${pin}) == LOW)`;
      return [code, this.ORDER_NONE];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `pin_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_[pinName] = `${pinName} = Pin(${pin}, Pin.IN)`;
      const code = `(${pinName}.value() == 0)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
];
