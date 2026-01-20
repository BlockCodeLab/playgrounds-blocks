import { MathUtils } from '@blockcode/utils';
import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'addr',
    text: (
      <Text
        id="blocks.md40motor.addr"
        defaultMessage="set I2C address [ADDR]"
      />
    ),
    inputs: {
      ADDR: {
        menu: [
          ['0×16', '0x16'],
          ['0×17', '0x17'],
          ['0×18', '0x18'],
          ['0×1A', '0x1A'],
        ],
      },
    },
    ino(block) {
      const addr = block.getFieldValue('ADDR');
      this.definitions_['variable_md40motor'] = `Md40 md40Motor(${addr});`;
      this.definitions_['setup_md40motor'] = `md40Motor.Init();`;
      return '';
    },
  },
  '---',
  {
    id: 'init',
    text: (
      <Text
        id="blocks.md40motor.init"
        defaultMessage="set [MOTOR] encoder motor to ratio [RATIO] [PULSE] ppr and [PHASE] phase leads"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
      },
      RATIO: {
        type: 'positive_integer',
        defaultValue: 90,
      },
      PULSE: {
        type: 'positive_integer',
        defaultValue: 12,
      },
      PHASE: {
        menu: ['A', 'B'],
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const ratio = this.valueToCode(block, 'RATIO');
      const pulse = this.valueToCode(block, 'PULSE');
      const phase = block.getFieldValue('PHASE');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      for (const id of motors) {
        this.definitions_[`setup_md40motor_${id}`] =
          `md40Motor[${id}].SetEncoderMode(${pulse}, ${ratio}, Md40::Motor::PhaseRelation::k${phase}PhaseLeads);`;
      }
      return '';
    },
  },
  {
    id: 'setspeed',
    text: (
      <Text
        id="blocks.md40motor.setspeed"
        defaultMessage="set [MOTOR] encoder motor to [SPEED]% [DIR] speed"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotorsAll',
      },
      DIR: {
        menu: 'RotationDirection',
      },
      SPEED: {
        shadow: 'speedvalue',
        defaultValue: 100,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = this.valueToCode(block, 'DIR');
      const speed = this.valueToCode(block, 'SPEED');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        if (!this.definitions_[`setup_md40motor_${id}`]) {
          if (!this.definitions_[`setup_md40motor_${id}`]) {
            this.definitions_[`setup_md40motor_${id}`] =
              `md40Motor[${id}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
          }
        }
        code += `md40Motor[${id}].RunPwmDuty(round((float)${speed} * ${(1023 * dir) / 100}));\n`;
      }
      return code;
    },
  },
  {
    id: 'setrpm',
    text: (
      <Text
        id="blocks.md40motor.setrpm"
        defaultMessage="set [MOTOR] encoder motor to [DIR] at [RPM] rpm"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotorsAll',
      },
      DIR: {
        menu: 'RotationDirection',
      },
      RPM: {
        type: 'positive_integer',
        defaultValue: 100,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = this.valueToCode(block, 'DIR');
      const rpm = this.valueToCode(block, 'RPM');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        if (!this.definitions_[`setup_md40motor_${id}`]) {
          this.definitions_[`setup_md40motor_${id}`] =
            `md40Motor[${id}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
        }
        code += `md40Motor[${id}].RunSpeed(${rpm * dir});\n`;
      }
      return code;
    },
  },
  {
    id: 'setrotate',
    text: (
      <Text
        id="blocks.md40motor.setrotate"
        defaultMessage="rotate [MOTOR] encoder motor to [DEGREE]° at [RPM] rpm"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotorsAll',
      },
      DEGREE: {
        type: 'integer',
        defaultValue: 15,
      },
      RPM: {
        type: 'positive_integer',
        defaultValue: 100,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const degree = this.valueToCode(block, 'DEGREE');
      const rpm = this.valueToCode(block, 'RPM');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        if (!this.definitions_[`setup_md40motor_${id}`]) {
          this.definitions_[`setup_md40motor_${id}`] =
            `md40Motor[${id}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
        }
        code += `md40Motor[${id}].Move(${degree}, ${rpm});\n`;
      }
      return code;
    },
  },
  {
    id: 'setangle',
    text: (
      <Text
        id="blocks.md40motor.setangle"
        defaultMessage="set [MOTOR] encoder motor to [ANGLE]° at [RPM] rpm"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotorsAll',
      },
      ANGLE: {
        type: 'integer',
        defaultValue: 90,
      },
      RPM: {
        type: 'positive_integer',
        defaultValue: 100,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const angle = this.valueToCode(block, 'ANGLE');
      const rpm = this.valueToCode(block, 'RPM');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        if (!this.definitions_[`setup_md40motor_${id}`]) {
          this.definitions_[`setup_md40motor_${id}`] =
            `md40Motor[${id}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
        }
        code += `md40Motor[${id}].MoveTo(${angle}, ${rpm});\n`;
      }
      return code;
    },
  },
  {
    id: 'reset',
    text: (
      <Text
        id="blocks.md40motor.reset"
        defaultMessage="reset [MOTOR] encoder motor"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        if (!this.definitions_[`setup_md40motor_${id}`]) {
          this.definitions_[`setup_md40motor_${id}`] =
            `md40Motor[${id}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
        }
        code += `md40Motor[${id}].Reset();\n`;
      }
      return code;
    },
  },
  {
    id: 'shutdown',
    text: (
      <Text
        id="blocks.md40motor.shutdown"
        defaultMessage="stop [MOTOR] encoder motor"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'AllEncoderMotors',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        if (!this.definitions_[`setup_md40motor_${id}`]) {
          this.definitions_[`setup_md40motor_${id}`] =
            `md40Motor[${id}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
        }
        code += `md40Motor[${id}].Stop();\n`;
      }
      return code;
    },
  },
  '---',
  {
    id: 'setpidangle',
    text: (
      <Text
        id="blocks.md40motor.setpidangle"
        defaultMessage="set [MOTOR] encoder motor to P:[P] I:[I] D:[D] for angle pid controller"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotorsAll',
      },
      P: {
        type: 'number',
        defaultValue: 10.0,
      },
      I: {
        type: 'number',
        defaultValue: 1.0,
      },
      D: {
        type: 'number',
        defaultValue: 1.0,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const pValue = this.valueToCode(block, 'P');
      const iValue = this.valueToCode(block, 'I');
      const dValue = this.valueToCode(block, 'D');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        if (!this.definitions_[`setup_md40motor_${id}`]) {
          this.definitions_[`setup_md40motor_${id}`] =
            `md40Motor[${id}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
        }
        code += `md40Motor[${id}].set_position_pid_p(${MathUtils.float(pValue)});\n`;
        code += `md40Motor[${id}].set_position_pid_i(${MathUtils.float(iValue)});\n`;
        code += `md40Motor[${id}].set_position_pid_d(${MathUtils.float(dValue)});\n`;
      }
      return code;
    },
  },
  {
    id: 'setpidspeed',
    text: (
      <Text
        id="blocks.md40motor.setpidspeed"
        defaultMessage="set [MOTOR] encoder motor to P:[P] I:[I] D:[D] for speed pid controller"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotorsAll',
      },
      P: {
        type: 'number',
        defaultValue: 1.5,
      },
      I: {
        type: 'number',
        defaultValue: 1.5,
      },
      D: {
        type: 'number',
        defaultValue: 1.0,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const pValue = this.valueToCode(block, 'P');
      const iValue = this.valueToCode(block, 'I');
      const dValue = this.valueToCode(block, 'D');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        if (!this.definitions_[`setup_md40motor_${id}`]) {
          this.definitions_[`setup_md40motor_${id}`] =
            `md40Motor[${id}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
        }
        code += `md40Motor[${id}].set_speed_pid_p(${MathUtils.float(pValue)});\n`;
        code += `md40Motor[${id}].set_speed_pid_i(${MathUtils.float(iValue)});\n`;
        code += `md40Motor[${id}].set_speed_pid_d(${MathUtils.float(dValue)});\n`;
      }
      return code;
    },
  },
  {
    id: 'pidangle',
    text: (
      <Text
        id="blocks.md40motor.pidangle"
        defaultMessage="encoder motor [MOTOR] angle pid controller [PID] value"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
      PID: {
        menu: ['P', 'I', 'D'],
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const pid = block.getFieldValue('PID');
      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      if (!this.definitions_[`setup_md40motor_${motor}`]) {
        this.definitions_[`setup_md40motor_${motor}`] =
          `md40Motor[${motor}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
      }
      const code = `md40Motor[${motor}].position_pid_${pid.toLowerCase()}()`;
      return [code];
    },
  },
  {
    id: 'pidspeed',
    text: (
      <Text
        id="blocks.md40motor.pidspeed"
        defaultMessage="encoder motor [MOTOR] speed pid controller [PID] value"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
      PID: {
        menu: ['P', 'I', 'D'],
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const pid = block.getFieldValue('PID');
      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      if (!this.definitions_[`setup_md40motor_${motor}`]) {
        this.definitions_[`setup_md40motor_${motor}`] =
          `md40Motor[${motor}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
      }
      const code = `md40Motor[${motor}].speed_pid_${pid.toLowerCase()}()`;
      return [code];
    },
  },
  {
    id: 'speed',
    text: (
      <Text
        id="blocks.md40motor.speed"
        defaultMessage="encoder motor [MOTOR] speed(%)"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      if (!this.definitions_[`setup_md40motor_${motor}`]) {
        this.definitions_[`setup_md40motor_${motor}`] =
          `md40Motor[${motor}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
      }
      const code = `(md40Motor[${motor}].pwm_duty() / 1023)`;
      return [code];
    },
  },
  {
    id: 'rpm',
    text: (
      <Text
        id="blocks.md40motor.rpm"
        defaultMessage="encoder motor [MOTOR] rpm"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      if (!this.definitions_[`setup_md40motor_${motor}`]) {
        this.definitions_[`setup_md40motor_${motor}`] =
          `md40Motor[${motor}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
      }
      const code = `md40Motor[${motor}].speed()`;
      return [code];
    },
  },
  {
    id: 'angle',
    text: (
      <Text
        id="blocks.md40motor.angle"
        defaultMessage="encoder motor [MOTOR] angle"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      if (!this.definitions_[`setup_md40motor_${motor}`]) {
        this.definitions_[`setup_md40motor_${motor}`] =
          `md40Motor[${motor}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
      }
      const code = `md40Motor[${motor}].position()`;
      return [code];
    },
  },
  {
    id: 'pulse',
    text: (
      <Text
        id="blocks.md40motor.pulse"
        defaultMessage="encoder motor [MOTOR] pulses"
      />
    ),
    output: 'number',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      if (!this.definitions_[`setup_md40motor_${motor}`]) {
        this.definitions_[`setup_md40motor_${motor}`] =
          `md40Motor[${motor}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
      }
      const code = `md40Motor[${motor}].pulse_count()`;
      return [code];
    },
  },
  {
    id: 'state',
    text: (
      <Text
        id="blocks.md40motor.state"
        defaultMessage="encoder motor [MOTOR] [STATE]?"
      />
    ),
    output: 'boolean',
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
      STATE: {
        menu: [
          [
            <Text
              id="blocks.md40motor.stateIdle"
              defaultMessage="idle"
            />,
            '0',
          ],
          [
            <Text
              id="blocks.md40motor.stateRunning"
              defaultMessage="running"
            />,
            '123',
          ],
          [
            <Text
              id="blocks.md40motor.stateReached"
              defaultMessage="done"
            />,
            '4',
          ],
        ],
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const state = block.getFieldValue('STATE');

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      if (!this.definitions_[`setup_md40motor_${motor}`]) {
        this.definitions_[`setup_md40motor_${motor}`] =
          `md40Motor[${motor}].SetEncoderMode(12, 90, Md40::Motor::PhaseRelation::kAPhaseLeads);`;
      }
      let code = `(uint8_t)md40Motor[${motor}].state()`;
      if (state === '123') {
        code = `((${code} - 1) < 3)`;
      } else {
        code = `(${code} == ${state})`;
      }
      return [code];
    },
  },
  '---',
  // DC电机
  {
    id: 'run',
    text: (
      <Text
        id="blocks.md40motor.run"
        defaultMessage="set [MOTOR] motor to [SPEED]% [DIR] speed"
      />
    ),
    inputs: {
      MOTOR: {
        menu: [
          ['M0', '0'],
          ['M1', '1'],
          ['M2', '2'],
          ['M3', '3'],
          [
            <Text
              id="blocks.md40motor.all"
              defaultMessage="all"
            />,
            'all',
          ],
        ],
      },
      DIR: {
        menu: 'RotationDirection',
      },
      SPEED: {
        shadow: 'speedvalue',
        defaultValue: 100,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = this.valueToCode(block, 'DIR');
      const speed = this.valueToCode(block, 'SPEED');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        this.definitions_[`setup_md40motor_${id}`] = `md40Motor[${id}].SetDcMode();`;
        code += `md40Motor[${id}].RunPwmDuty(round((float)${speed} * ${(1023 * dir) / 100}));\n`;
      }
      return code;
    },
  },
  {
    id: 'stop',
    text: (
      <Text
        id="blocks.md40motor.stop"
        defaultMessage="stop [MOTOR] motor"
      />
    ),
    inputs: {
      MOTOR: {
        menu: [
          [
            <Text
              id="blocks.md40motor.all"
              defaultMessage="all"
            />,
            'all',
          ],
          ['M0', '0'],
          ['M1', '1'],
          ['M2', '2'],
          ['M3', '3'],
        ],
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const motors = motor === 'all' ? [0, 1, 2, 3] : [motor];

      if (!this.definitions_['variable_md40motor']) {
        this.definitions_['variable_md40motor'] = 'Md40 md40Motor(Md40::kDefaultI2cAddress);';
      }
      this.definitions_['setup_md40motor'] = 'md40Motor.Init();';

      let code = '';
      for (const id of motors) {
        code += `md40Motor[${id}].Stop();\n`;
      }
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
  AllEncoderMotors: {
    items: [
      [
        <Text
          id="blocks.md40motor.all"
          defaultMessage="all"
        />,
        'all',
      ],
      ['E0', '0'],
      ['E1', '1'],
      ['E2', '2'],
      ['E3', '3'],
    ],
  },
  EncoderMotorsAll: {
    items: [
      ['E0', '0'],
      ['E1', '1'],
      ['E2', '2'],
      ['E3', '3'],
      [
        <Text
          id="blocks.md40motor.all"
          defaultMessage="all"
        />,
        'all',
      ],
    ],
  },
  EncoderMotors: {
    items: [
      ['E0', '0'],
      ['E1', '1'],
      ['E2', '2'],
      ['E3', '3'],
    ],
  },
  RotationDirection: {
    type: 'number',
    inputMode: true,
    defaultValue: '1',
    items: [
      [
        <Text
          id="blocks.md40motor.forward"
          defaultMessage="forward"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.md40motor.reverse"
          defaultMessage="reverse"
        />,
        '-1',
      ],
    ],
  },
};
