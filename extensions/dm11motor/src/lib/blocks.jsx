import { Text } from '@blockcode/core';

export const blocks = (meta) => [
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
          ['0×19', '0x19'],
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
