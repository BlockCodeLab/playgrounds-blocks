import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  meta.editor !== '@blockcode/gui-arduino' && {
    id: 'i2c',
    text: (
      <Text
        id="blocks.dm11motor.i2c"
        defaultMessage="set pins SCL:[SCL] SDA:[SDA]"
      />
    ),
    inputs: {
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
    },
    mpy(block) {
      const scl = meta.boardPins ? block.getFieldValue('SCL') : this.valueToCode(block, 'SCL', this.ORDER_NONE);
      const sda = meta.boardPins ? block.getFieldValue('SDA') : this.valueToCode(block, 'SDA', this.ORDER_NONE);
      if (this.definitions_['dm11motor_addr']) {
        const addr = this.definitions_['dm11motor_addr'].replace('# DM11 addr: ', '');
        this.definitions_['dm11motor'] = `dm11Motor = dm11.DM11(${scl}, ${sda}, ${addr})`;
        delete this.definitions_['dm11motor_addr'];
      } else {
        this.definitions_['dm11motor'] = `dm11Motor = dm11.DM11(${scl}, ${sda})`;
      }
      return '';
    },
  },
  {
    id: 'addr',
    text: (
      <Text
        id="blocks.dm11motor.addr"
        defaultMessage="set I2C address [ADDR]"
      />
    ),
    inputs: {
      ADDR: {
        menu: [
          ['0×15', '0x15'],
          ['0×16', '0x16'],
          ['0×17', '0x17'],
          ['0×18', '0x18'],
          ['0×19', '0x19'],
          ['0×1A', '0x1A'],
          ['0×1B', '0x1B'],
          ['0×1C', '0x1C'],
        ],
      },
    },
    ino(block) {
      const addr = block.getFieldValue('ADDR');
      this.definitions_['variable_dm11motor'] = 'em::Dm11 dm11Motor;';
      this.definitions_['setup_dm11motor'] = `dm11Motor.Init(${addr});`;
      return '';
    },
    mpy(block) {
      const addr = block.getFieldValue('ADDR');
      if (this.definitions_['dm11motor']) {
        this.definitions_['dm11motor'] = this.definitions_['dm11motor'].replace(/(\d+)\)$/, `$1, ${addr})`);
      } else {
        this.definitions_['dm11motor_addr'] = `# DM11 addr: ${addr}`;
      }
      return '';
    },
  },
  {
    id: 'run',
    text: (
      <Text
        id="blocks.dm11motor.run"
        defaultMessage="set [MOTOR] motor to [SPEED]% [DIR] speed"
      />
    ),
    inputs: {
      MOTOR: {
        menu: [
          ['M0', 'm0'],
          ['M1', 'm1'],
          [
            <Text
              id="blocks.dm11motor.all"
              defaultMessage="all"
            />,
            'all',
          ],
        ],
      },
      DIR: {
        inputMode: true,
        defaultValue: '1',
        type: 'number',
        menu: [
          [
            <Text
              id="blocks.dm11motor.forward"
              defaultMessage="forward"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.dm11motor.reverse"
              defaultMessage="reverse"
            />,
            '-1',
          ],
        ],
      },
      SPEED: {
        shadow: 'speed',
        defaultValue: 100,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = this.valueToCode(block, 'DIR', this.ORDER_NONE);
      const speed = this.valueToCode(block, 'SPEED', this.ORDER_NONE);
      this.definitions_['variable_dm11motor'] = 'em::Dm11 dm11Motor;';
      if (!this.definitions_['setup_dm11motor']) {
        this.definitions_['setup_dm11motor'] = 'dm11Motor.Init();';
      }
      const speed0 = dir > 0 ? 0 : `(int)(((float)${speed} * 4095) / 100)`;
      const speed1 = dir > 0 ? `(int)(((float)${speed} * 4095) / 100)` : 0;
      let code = '';
      if (motor === 'm0' || motor === 'all') {
        code += `dm11Motor.PwmDuty(em::Dm11::kPwmChannel0, ${speed0});\n`;
        code += `dm11Motor.PwmDuty(em::Dm11::kPwmChannel1, ${speed1});\n`;
      }
      if (motor === 'm1' || motor === 'all') {
        code += `dm11Motor.PwmDuty(em::Dm11::kPwmChannel2, ${speed0});\n`;
        code += `dm11Motor.PwmDuty(em::Dm11::kPwmChannel3, ${speed1});\n`;
      }
      return code;
    },
    mpy(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = this.valueToCode(block, 'DIR', this.ORDER_NONE);
      const speed = this.valueToCode(block, 'SPEED', this.ORDER_NONE);
      const speed0 = dir > 0 ? 0 : `round(${speed} * 4095 / 100)`;
      const speed1 = dir > 0 ? `round(${speed} * 4095 / 100)` : 0;
      let code = '';
      if (motor === 'm0' || motor === 'all') {
        code += `dm11Motor.set_pwm_duty(0, ${speed0});\n`;
        code += `dm11Motor.set_pwm_duty(1, ${speed1});\n`;
      }
      if (motor === 'm1' || motor === 'all') {
        code += `dm11Motor.set_pwm_duty(2, ${speed0});\n`;
        code += `dm11Motor.set_pwm_duty(3, ${speed1});\n`;
      }
      return code;
    },
  },
  {
    id: 'stop',
    text: (
      <Text
        id="blocks.dm11motor.stop"
        defaultMessage="stop [MOTOR] motor"
      />
    ),
    inputs: {
      MOTOR: {
        menu: [
          [
            <Text
              id="blocks.dm11motor.all"
              defaultMessage="all"
            />,
            'all',
          ],
          ['M0', 'm0'],
          ['M1', 'm1'],
        ],
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      this.definitions_['variable_dm11motor'] = 'em::Dm11 dm11Motor;';
      if (!this.definitions_['setup_dm11motor']) {
        this.definitions_['setup_dm11motor'] = 'dm11Motor.Init();';
      }
      let code = '';
      if (motor === 'm0' || motor === 'all') {
        code += `dm11Motor.PwmDuty(em::Dm11::kPwmChannel0, 4095);\n`;
        code += `dm11Motor.PwmDuty(em::Dm11::kPwmChannel1, 4095);\n`;
      }
      if (motor === 'm1' || motor === 'all') {
        code += `dm11Motor.PwmDuty(em::Dm11::kPwmChannel2, 4095);\n`;
        code += `dm11Motor.PwmDuty(em::Dm11::kPwmChannel3, 4095);\n`;
      }
      return code;
    },
    mpy(block) {
      const motor = block.getFieldValue('MOTOR');
      let code = '';
      if (motor === 'm0' || motor === 'all') {
        code += `dm11Motor.set_pwm_duty(0, 4095);\n`;
        code += `dm11Motor.set_pwm_duty(1, 4095);\n`;
      }
      if (motor === 'm1' || motor === 'all') {
        code += `dm11Motor.set_pwm_duty(2, 4095);\n`;
        code += `dm11Motor.set_pwm_duty(3, 4095);\n`;
      }
      return code;
    },
  },
  {
    id: 'speed',
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
      return [code, this.ORDER_NONE];
    },
    ino(block) {
      const code = block.getFieldValue('SPEED') || 0;
      return [code, this.ORDER_NONE];
    },
  },
];

export const menus = {
  Motors: {
    menu: [
      ['M0', 'm0'],
      ['M1', 'm1'],
      [
        <Text
          id="blocks.dm11motor.all"
          defaultMessage="all"
        />,
        'all',
      ],
    ],
  },
};
