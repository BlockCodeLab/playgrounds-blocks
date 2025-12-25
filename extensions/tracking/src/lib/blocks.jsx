import { Text } from '@blockcode/core';

const notArduino = (meta) => meta.editor !== '@blockcode/gui-arduino';
const isIotBit = (meta) => meta.editor === '@blockcode/gui-iotbit';

const autoInitArduino = (gen) => {
  gen.definitions_['variable_5tracker'] = `FiveLineTracker _5tracker;`;
  gen.definitions_['setup_wire'] = 'Wire.begin();';
  gen.definitions_['setup_5tracker'] = '_5tracker.Initialize();';
};

export const blocks = (meta) =>
  [
    // {
    //   id: 'tracking',
    //   text: (
    //     <Text
    //       id="blocks.tracking.tracking"
    //       defaultMessage="pin [PIN] sensing black line?"
    //     />
    //   ),
    //   output: 'boolean',
    //   inputs: {
    //     PIN: {
    //       type: 'integer',
    //       defaultValue: '1',
    //     },
    //   },
    //   ino(block) {
    //     const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
    //     this.definitions_[`setup_${pin}`] = `pinMode(${pin}, INPUT);`;
    //     const code = `(digitalRead(${pin}) == LOW)`;
    //     return [code, this.ORDER_FUNCTION_CALL];
    //   },
    //   mpy(block) {
    //     const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
    //     const pinName = `pin_${pin}`;
    //     this.definitions_['import_pin'] = 'from machine import Pin';
    //     this.definitions_[pinName] = `${pinName} = Pin(${pin}, Pin.IN)`;
    //     const code = `(${pinName}.value() == 0)`;
    //     return [code, this.ORDER_FUNCTION_CALL];
    //   },
    // },
    // {
    //   id: 'value',
    //   text: (
    //     <Text
    //       id="blocks.tracking.value"
    //       defaultMessage="pin [PIN] sensing value"
    //     />
    //   ),
    //   output: 'number',
    //   inputs: {
    //     PIN: isUno
    //       ? { menu: 'unoAnalogPins' }
    //       : isNano
    //         ? { menu: 'nanoAnalogPins' }
    //         : {
    //             type: 'integer',
    //             defaultValue: '1',
    //           },
    //   },
    //   ino(block) {
    //     const pin = block.getFieldValue('PIN');
    //     this.definitions_[`setup_${pin}`] = `pinMode(${pin}, INPUT);`;
    //     const code = `analogRead(${pin})`;
    //     return [code, this.ORDER_FUNCTION_CALL];
    //   },
    // },
    // {
    //   id: 'threshold',
    //   text: (
    //     <Text
    //       id="blocks.tracking.threshold"
    //       defaultMessage="set pin [PIN] sensing value min [NUM1] max [NUM2]"
    //     />
    //   ),
    //   inputs: {
    //     PIN: isUno
    //       ? { menu: 'unoAnalogPins' }
    //       : isNano
    //         ? { menu: 'nanoAnalogPins' }
    //         : {
    //             type: 'integer',
    //             defaultValue: '1',
    //           },
    //     NUM1: {
    //       type: 'integer',
    //       defaultValue: '10',
    //     },
    //     NUM2: {
    //       type: 'integer',
    //       defaultValue: '100',
    //     },
    //   },
    // },
    // '---',
    notArduino(meta) && {
      id: 'init5',
      text: (
        <Text
          id="blocks.tracking.init5"
          defaultMessage="set 5-channel tracker pins SCL:[SCL] SDA:[SDA]"
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
        this.definitions_['5tracker'] = `_5tracker = five_line_tracker.FiveLineTracker(${scl}, ${sda})`;
        return '';
      },
    },
    // {
    //   id: 'addr5p',
    //   text: (
    //     <Text
    //       id="blocks.tracking.addr5p"
    //       defaultMessage="set 5-channel tracker I2C address [ADDR]"
    //     />
    //   ),
    //   inputs: {
    //     ADDR: {
    //       type: 'integer',
    //       defaultValue: '50',
    //     },
    //   },
    // },
    {
      id: 'threshold5',
      text: (
        <Text
          id="blocks.tracking.threshold5"
          defaultMessage="set channel [CHAN] sensing value min [NUM1] max [NUM2]"
        />
      ),
      inputs: {
        CHAN: {
          menu: 'channels',
        },
        NUM1: {
          type: 'integer',
          defaultValue: '800',
        },
        NUM2: {
          type: 'integer',
          defaultValue: '850',
        },
      },
      ino(block) {
        autoInitArduino(this);
        const chan = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
        const num1 = this.valueToCode(block, 'NUM1', this.ORDER_NONE);
        const num2 = this.valueToCode(block, 'NUM2', this.ORDER_NONE);
        let code = '';
        code += `_5tracker.LowThreshold(${chan}, min(${num1}, ${num2}));\n`;
        code += `_5tracker.HighThreshold(${chan}, max(${num1}, ${num2}));\n`;
        return code;
      },
      mpy(block) {
        const chan = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
        const num1 = this.valueToCode(block, 'NUM1', this.ORDER_NONE);
        const num2 = this.valueToCode(block, 'NUM2', this.ORDER_NONE);
        let code = '';
        code += `_5tracker.low_threshold(${chan}, min(${num1}, ${num2}))\n`;
        code += `_5tracker.high_threshold(${chan}, max(${num1}, ${num2}))\n`;
        return code;
      },
    },
    {
      id: 'tracking5',
      text: (
        <Text
          id="blocks.tracking.tracking5"
          defaultMessage="channel [CHAN] sensing black line?"
        />
      ),
      output: 'boolean',
      inputs: {
        CHAN: {
          menu: 'channels',
        },
      },
      ino(block) {
        autoInitArduino(this);
        const chan = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
        const code = `(_5tracker.DigitalValue(${chan}) == 0)`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const chan = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
        const code = `(_5tracker.digital_value(${chan}) == 0)`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'value5',
      text: (
        <Text
          id="blocks.tracking.value5"
          defaultMessage="channel [CHAN] sensing value"
        />
      ),
      output: 'number',
      inputs: {
        CHAN: {
          menu: 'channels',
        },
      },
      ino(block) {
        autoInitArduino(this);
        const chan = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
        const code = `_5tracker.AnalogValue(${chan})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const chan = this.valueToCode(block, 'CHAN', this.ORDER_NONE);
        const code = `_5tracker.analog_value(${chan})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ].filter(Boolean);

export const menus = {
  channels: {
    type: 'integer',
    inputMode: true,
    defaultValue: '0',
    items: [
      ['1', '0'],
      ['2', '1'],
      ['3', '2'],
      ['4', '3'],
      ['5', '4'],
    ],
  },
};
