import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.motor.init"
        defaultMessage="set [MOTOR] pins IN1:[IN1] IN2:[IN2]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'Motor',
      },
      IN1: meta.boardPins
        ? {
            menu: meta.boardPins.pwm,
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      IN2: meta.boardPins
        ? {
            menu: meta.boardPins.pwm,
          }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const in1 = meta.boardPins ? block.getFieldValue('IN1') : this.valueToCode(block, 'IN1', this.ORDER_NONE);
      const in2 = meta.boardPins ? block.getFieldValue('IN2') : this.valueToCode(block, 'IN2', this.ORDER_NONE);
      this.definitions_[`variable_${motor}`] = `uint8_t _${motor}[] = {${in1}, ${in2}};`;
      this.definitions_[`setup_pin_${in1}`] = `pinMode(_${motor}[0], OUTPUT);`;
      this.definitions_[`setup_pin_${in2}`] = `pinMode(_${motor}[1], OUTPUT);`;
      return '';
    },
    mpy(block) {
      const motor = block.getFieldValue('MOTOR');
      const in1 = meta.boardPins ? block.getFieldValue('IN1') : this.valueToCode(block, 'IN1', this.ORDER_NONE);
      const in2 = meta.boardPins ? block.getFieldValue('IN2') : this.valueToCode(block, 'IN2', this.ORDER_NONE);
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_pwm'] = 'from machine import PWM';
      this.definitions_[`motor_${motor}`] = `_${motor} = (PWM(Pin(${in1}), freq=1000), PWM(Pin(${in2}), freq=1000))`;
      return '';
    },
  },
  {
    id: 'run',
    text: (
      <Text
        id="blocks.motor.run"
        defaultMessage="set [MOTOR] to [SPEED] % [DIR] speed"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'Motor',
      },
      SPEED: {
        shadow: 'speedvalue',
      },
      DIR: {
        type: 'number',
        inputMode: true,
        defaultValue: '1',
        menu: [
          [
            <Text
              id="blocks.motor.forward"
              defaultMessage="forward"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.motor.reverse"
              defaultMessage="reverse"
            />,
            '-1',
          ],
        ],
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = this.valueToCode(block, 'DIR', this.ORDER_NONE);
      const speed = this.valueToCode(block, 'SPEED', this.ORDER_NONE);

      let code = '';
      if (dir > 0) {
        code += `analogWrite(_${motor}[0], round((float)${speed} * ${255 / 100}));\n`;
        code += `analogWrite(_${motor}[1], 0);\n`;
      } else {
        code += `analogWrite(_${motor}[0], 0);\n`;
        code += `analogWrite(_${motor}[1], round((float)${speed} * ${255 / 100}));\n`;
      }
      return code;
    },
    mpy(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = this.valueToCode(block, 'DIR', this.ORDER_NONE);
      const speed = this.valueToCode(block, 'SPEED', this.ORDER_NONE);

      let code = '';
      if (dir > 0) {
        code += `_${motor}[0].duty(round(${speed} * ${1023 / 100}))\n`;
        code += `_${motor}[1].duty(0)\n`;
      } else {
        code += `_${motor}[0].duty(0)\n`;
        code += `_${motor}[1].duty(round(${speed} * ${1023 / 100}))\n`;
      }
      return code;
    },
  },
  {
    id: 'stop',
    text: (
      <Text
        id="blocks.motor.stop"
        defaultMessage="stop [MOTOR]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'Motor',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      let code = '';
      code += `analogWrite(_${motor}[0], 255);\n`;
      code += `analogWrite(_${motor}[1], 255);\n`;
      return code;
    },
    mpy(block) {
      const motor = block.getFieldValue('MOTOR');
      let code = '';
      code += `_${motor}[0].duty(255)\n`;
      code += `_${motor}[1].duty(255)\n`;
      return code;
    },
  },
  // 内嵌积木
  {
    id: 'speedvalue',
    shadow: true,
    output: 'number',
    inputs: {
      SPEED: {
        type: 'slider',
        defaultValue: 100,
        min: 0,
        max: 100,
      },
    },
    mpy(block) {
      const code = block.getFieldValue('SPEED') || 0;
      return [code];
    },
    ino(block) {
      const code = block.getFieldValue('SPEED') || 0;
      return [code];
    },
  },
];

export const menus = {
  Motor: {
    items: ['M1', 'M2', 'M3', 'M4'],
  },
};
