import { Text } from '@blockcode/core';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);
const isIotBit = (meta) => meta.editor === '@emakefun/gui-iotbit';
const isIotBoard = (meta) => meta.boardType === 'ESP32_IOT_BOARD';

export const blocks = (meta) => [
  {
    id: 'addr',
    hidden: notArduino(meta),
    text: (
      <Text
        id="blocks.dm11motor.addr"
        defaultMessage="set DM11 I2C address [ADDR]"
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
  },
  notArduino(meta) && {
    id: 'i2c',
    text: (
      <Text
        id="blocks.dm11motor.i2c"
        defaultMessage="set DM11 pins SCL:[SCL] SDA:[SDA] I2C address [ADDR]"
      />
    ),
    inputs: {
      SCL: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? 'P19' : isIotBoard(meta) ? '22' : '2',
          }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      SDA: meta.boardPins
        ? {
            menu: meta.boardPins.all,
            defaultValue: isIotBit(meta) ? 'P20' : isIotBoard(meta) ? '21' : '3',
          }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
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
    mpy(_, args, defs) {
      const pins = meta.boardPins;
      const chan = pins?.i2c && pins.i2c.scl === args.SCL && pins.i2c.sda === args.SDA ? pins.i2c.channel : 1;
      const i2c = `i2c${chan}_${args.SCL}_${args.SDA}`;

      defs['import_pin'] = `from machine import Pin`;
      defs['import_i2c'] = `from machine import I2C`;
      defs[i2c] = `${i2c} = I2C(${chan}, scl=Pin(${args.SCL}), sda=Pin(${args.SDA}))`;
      defs['dm11motor'] = `dm11Motor = dm11.DM11(${i2c}, ${args.ADDR})`;
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
