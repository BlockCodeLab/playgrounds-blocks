import { Text } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
import ps2Icon from '../ps2-icon.png';

const InitEncoderMotor = (gen, motor) => {
  gen.definitions_['variable_mdb'] = 'Emakefun_MotorDriver _mdb(0x60);';
  if (!gen.definitions_['setup_mdb']) {
    gen.definitions_['setup_mdb'] = `_mdb.begin();`;
  }
  gen.definitions_[`variable_mdb_${motor}`] =
    `Emakefun_EncoderMotor *mdb_${motor.toLowerCase()} = _mdb.getEncoderMotor(${motor});`;
  gen.definitions_[`setup_mdb_${motor}`] = `mdb_${motor.toLowerCase()}->init(encoder_${motor});`;

  let code = '';
  code += `static void encoder_${motor}() {\n`;
  code += `  if (digitalRead(mdb_${motor.toLowerCase()}->ENCODER2pin) == LOW) {\n`;
  code += `    mdb_${motor.toLowerCase()}->EncoderPulse++;\n`;
  code += '  } else {\n';
  code += `    mdb_${motor.toLowerCase()}->EncoderPulse--;\n`;
  code += '  }\n';
  code += '}';
  gen.definitions_[`declare_encoder_$${motor}`] = `static void encoder_${motor}();`;
  gen.definitions_[`encoder_$${motor}`] = code;
};

const InitJoystick = (gen) => {
  const pollingName = '_ps2xPolling';
  if (!gen.definitions_[pollingName]) {
    let code = '';
    code += `void ${pollingName}() {\n`;
    code += `  unsigned long t = millis();\n`;
    code += `  static byte PSS_RX_Val, PSS_RY_Val, PSS_LX_Val, PSS_LY_Val;\n`;
    code += `  PSS_RX_Val = ps2x.Analog(PSS_RX);\n`;
    code += `  PSS_RY_Val = ps2x.Analog(PSS_RY);\n`;
    code += `  PSS_LX_Val = ps2x.Analog(PSS_LX);\n`;
    code += `  PSS_LY_Val = ps2x.Analog(PSS_LY);\n`;
    code += `  if (millis()-t<20) delay(20-(millis()-t));\n`;
    code += `}`;

    gen.definitions_[`declare_${pollingName}`] = `void ${pollingName}();`;
    gen.definitions_[pollingName] = code;
  }
  return pollingName;
};

export const blocks = [
  {
    label: (
      <Text
        id="blocks.motordriverboard.io"
        defaultMessage="Expand IOs"
      />
    ),
  },
  {
    id: 'setIO',
    text: (
      <Text
        id="blocks.motordriverboard.setIO"
        defaultMessage="set expand IO [IO] to [VALUE]"
      />
    ),
    inputs: {
      IO: {
        menu: 'IOs',
      },
      VALUE: {
        defaultValue: 'HIGH',
        menu: [
          [
            <Text
              id="blocks.motordriverboard.high"
              defaultMessage="high"
            />,
            'HIGH',
          ],
          [
            <Text
              id="blocks.motordriverboard.low"
              defaultMessage="low"
            />,
            'LOW',
          ],
        ],
      },
    },
    ino(block) {
      const io = block.getFieldValue('IO');
      const value = block.getFieldValue('VALUE');
      this.definitions_['variable_mdb'] = 'Emakefun_MotorDriver _mdb(0x60);';
      if (!this.definitions_['setup_mdb']) {
        this.definitions_['setup_mdb'] = `_mdb.begin();`;
      }
      const code = `_mdb.setPin(${io}, ${value});\n`;
      return code;
    },
  },
  {
    id: 'setPwmFreq',
    text: (
      <Text
        id="blocks.motordriverboard.setPwmFreq"
        defaultMessage="set expand IOs PWM freq [FREQ]"
      />
    ),
    inputs: {
      FREQ: {
        shadow: 'freq',
      },
    },
    ino(block) {
      const freq = this.valueToCode(block, 'FREQ', this.ORDER_NONE);
      this.definitions_['variable_mdb'] = 'Emakefun_MotorDriver _mdb(0x60);';
      this.definitions_['setup_mdb'] = `_mdb.begin(${freq});`;
      return '';
    },
  },
  {
    id: 'freq',
    shadow: true,
    output: 'integer',
    inputs: {
      FREQ: {
        type: 'slider',
        defaultValue: 1000,
        min: 1,
        max: 1600,
        step: 1,
      },
    },
    ino(block) {
      const code = block.getFieldValue('FREQ') || 0;
      return [code];
    },
  },
  {
    id: 'setPwmDuty',
    text: (
      <Text
        id="blocks.motordriverboard.setPwmDuty"
        defaultMessage="set expand IO [IO] PWM duty [DUTY]"
      />
    ),
    inputs: {
      IO: {
        menu: 'IOs',
      },
      DUTY: {
        shadow: 'duty',
      },
    },
    ino(block) {
      const io = block.getFieldValue('IO');
      const duty = this.valueToCode(block, 'DUTY', this.ORDER_NONE);
      this.definitions_['variable_mdb'] = 'Emakefun_MotorDriver _mdb(0x60);';
      if (!this.definitions_['setup_mdb']) {
        this.definitions_['setup_mdb'] = `_mdb.begin();`;
      }
      const code = `_mdb.setPWM(${io}, ${duty});\n`;
      return code;
    },
  },
  {
    id: 'duty',
    shadow: true,
    output: 'integer',
    inputs: {
      DUTY: {
        type: 'slider',
        defaultValue: 1024,
        min: 0,
        max: 4096,
        step: 1,
      },
    },
    ino(block) {
      const code = block.getFieldValue('DUTY') || 0;
      return [code];
    },
  },
  {
    label: (
      <Text
        id="blocks.motordriverboard.servo"
        defaultMessage="Servo"
      />
    ),
  },
  {
    id: 'setServo',
    text: (
      <Text
        id="blocks.motordriverboard.setServo"
        defaultMessage="set servo [SERVO] angle to [ANGLE]"
      />
    ),
    inputs: {
      SERVO: {
        menu: 'Servos',
      },
      ANGLE: {
        shadow: 'angle',
      },
    },
    ino(block) {
      const servo = block.getFieldValue('SERVO');
      const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      this.definitions_['variable_mdb'] = 'Emakefun_MotorDriver _mdb(0x60);';
      this.definitions_['setup_mdb'] = `_mdb.begin(50);`;
      const code = `_mdb.getServo(${servo})->writeServo(${angle});\n`;
      return code;
    },
  },
  {
    id: 'angle',
    shadow: true,
    output: 'integer',
    inputs: {
      ANGLE: {
        type: 'slider',
        defaultValue: 180,
        min: 0,
        max: 180,
        step: 1,
      },
    },
    ino(block) {
      const code = block.getFieldValue('ANGLE') || 0;
      return [code];
    },
  },
  {
    label: (
      <Text
        id="blocks.motordriverboard.motor"
        defaultMessage="Motor"
      />
    ),
  },
  {
    id: 'setMotor',
    text: (
      <Text
        id="blocks.motordriverboard.setMotor"
        defaultMessage="set DC motor [MOTOR] [DIR] speed to [SPEED]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'Motors',
        defaultValue: 'M1',
      },
      DIR: {
        menu: 'Directions',
      },
      SPEED: {
        shadow: 'speed',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = block.getFieldValue('DIR');
      const speed = this.valueToCode(block, 'SPEED', this.ORDER_NONE);
      this.definitions_['variable_mdb'] = 'Emakefun_MotorDriver _mdb(0x60);';
      this.definitions_['setup_mdb'] = `_mdb.begin(50);`;
      let code = '';
      if (motor === 'all') {
        for (let i = 1; i <= 4; i++) {
          code += `_mdb.getMotor(M${i})->setSpeed(round(${speed} * ${255 / 100}));\n`;
          code += `_mdb.getMotor(M${i})->run(${dir});\n`;
        }
      } else {
        code += `_mdb.getMotor(${motor})->setSpeed(round(${speed} * ${255 / 100}));\n`;
        code += `_mdb.getMotor(${motor})->run(${dir});\n`;
      }
      return code;
    },
  },
  {
    id: 'speed',
    shadow: true,
    output: 'integer',
    inputs: {
      SPEED: {
        type: 'slider',
        defaultValue: 80,
        min: 0,
        max: 100,
        step: 1,
      },
    },
    ino(block) {
      const code = block.getFieldValue('SPEED') || 0;
      return [code];
    },
  },
  {
    id: 'stopMotor',
    text: (
      <Text
        id="blocks.motordriverboard.stopMotor"
        defaultMessage="stop DC motor [MOTOR]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'Motors',
        defaultValue: 'all',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      this.definitions_['variable_mdb'] = 'Emakefun_MotorDriver _mdb(0x60);';
      this.definitions_['setup_mdb'] = `_mdb.begin(50);`;
      let code = '';
      if (motor === 'all') {
        for (let i = 1; i <= 4; i++) {
          code += `_mdb.getMotor(M${i})->run(BRAKE);\n`;
        }
      } else {
        code = `_mdb.getMotor(${motor})->run(BRAKE);\n`;
      }
      return code;
    },
  },
  {
    label: (
      <Text
        id="blocks.motordriverboard.encoderMotor"
        defaultMessage="Encoder Motor"
      />
    ),
  },
  {
    id: 'setEncoderMotor',
    text: (
      <Text
        id="blocks.motordriverboard.setEncoderMotor"
        defaultMessage="set encoder motor [MOTOR] [DIR] speed to [SPEED]%"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
      DIR: {
        menu: 'Directions',
      },
      SPEED: {
        shadow: 'speed',
        defaultValue: 80,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = block.getFieldValue('DIR');
      const speed = this.valueToCode(block, 'SPEED', this.ORDER_NONE);
      InitEncoderMotor(this, motor);

      let code = '';
      code += `mdb_${motor.toLowerCase()}->setSpeed(${speed} * ${255 / 100});\n`;
      code += `mdb_${motor.toLowerCase()}->run(${dir});\n`;
      return code;
    },
  },
  {
    id: 'setEncoderMotorPules',
    text: (
      <Text
        id="blocks.motordriverboard.setEncoderMotorPules"
        defaultMessage="set encoder motor [MOTOR] [SPEED]% speed [DIR] pules to [PULSES]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
      },
      DIR: {
        menu: 'Directions',
      },
      SPEED: {
        shadow: 'speed',
        defaultValue: 80,
      },
      PULSES: {
        type: 'positive_integer',
        defaultValue: 80,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const dir = block.getFieldValue('DIR');
      const speed = this.valueToCode(block, 'SPEED', this.ORDER_NONE);
      const pulse = this.valueToCode(block, 'PULSES', this.ORDER_NONE);
      InitEncoderMotor(this, motor);
      const code = `mdb_${motor.toLowerCase()}->run(${dir}, ${speed} * ${255 / 100}, ${pulse});\n`;
      return code;
    },
  },
  {
    id: 'stopEncoderMotor',
    text: (
      <Text
        id="blocks.motordriverboard.stopEncoderMotor"
        defaultMessage="stop encoder motor [MOTOR]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'EncoderMotors',
        defaultValue: 'all',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      InitEncoderMotor(this, motor);
      const code = `mdb_${motor.toLowerCase()}->run(BRAKE);\n`;
      return code;
    },
  },
  {
    label: (
      <Text
        id="blocks.motordriverboard.stepper"
        defaultMessage="Stepper"
      />
    ),
  },
  {
    id: 'initStepper',
    text: (
      <Text
        id="blocks.motordriverboard.initStepper"
        defaultMessage="init stepper [MOTOR] speed [SPEED] rpm and [STEPS] steps/round"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'Steppers',
      },
      SPEED: {
        type: 'positive_integer',
        defaultValue: 400,
      },
      STEPS: {
        type: 'positive_integer',
        defaultValue: 200,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const speed = this.valueToCode(block, 'SPEED', this.ORDER_NONE);
      const steps = this.valueToCode(block, 'STEPS', this.ORDER_NONE);
      this.definitions_['variable_mdb'] = 'Emakefun_MotorDriver _mdb(0x60);';
      this.definitions_['setup_mdb'] = `_mdb.begin(1600);`;
      this.definitions_[`variable_mdb_${motor}`] =
        `Emakefun_StepperMotor *mdb_${motor.toLowerCase()} = _mdb.getStepper(${motor}, ${steps});`;
      this.definitions_[`setup_mdb_${motor}`] = `mdb_${motor.toLowerCase()}->setSpeed(${speed});`;
      return '';
    },
  },
  {
    id: 'setStepper',
    text: (
      <Text
        id="blocks.motordriverboard.setStepper"
        defaultMessage="set stepper [MOTOR] [MODE] drive [DIR] steps to [STEPS]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'Steppers',
      },
      MODE: {
        menu: [
          [
            <Text
              id="blocks.motordriverboard.stepperSingle"
              defaultMessage="single step"
            />,
            'SINGLE',
          ],
          [
            <Text
              id="blocks.motordriverboard.stepperFull"
              defaultMessage="full step"
            />,
            'DOUBLE',
          ],
          [
            <Text
              id="blocks.motordriverboard.stepperInterleave"
              defaultMessage="interleaved step"
            />,
            'INTERLEAVE',
          ],
          [
            <Text
              id="blocks.motordriverboard.stepperMicro"
              defaultMessage="micro step"
            />,
            'MICROSTEP',
          ],
        ],
      },
      DIR: {
        menu: 'Directions',
      },
      STEPS: {
        type: 'positive_integer',
        defaultValue: 200,
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const mode = block.getFieldValue('MODE');
      const dir = block.getFieldValue('DIR');
      const steps = this.valueToCode(block, 'STEPS', this.ORDER_NONE);
      const code = `mdb_${motor.toLowerCase()}->step(${steps}, ${dir}, ${mode});\n`;
      return code;
    },
  },
  {
    id: 'stopStepper',
    text: (
      <Text
        id="blocks.motordriverboard.stopStepper"
        defaultMessage="stop stepper [MOTOR]"
      />
    ),
    inputs: {
      MOTOR: {
        menu: 'Steppers',
      },
    },
    ino(block) {
      const motor = block.getFieldValue('MOTOR');
      const code = `mdb_${motor.toLowerCase()}->release();\n`;
      return code;
    },
  },
  {
    label: (
      <Text
        id="blocks.motordriverboard.ps2"
        defaultMessage="PS2 controller"
      />
    ),
  },
  {
    id: 'eventPolling',
    icon: ps2Icon,
    text: (
      <Text
        id="blocks.motordriverboard.eventPolling"
        defaultMessage="controller events polling"
      />
    ),
    ino(block) {
      this.definitions_['variable_ps2x'] = 'PS2X ps2x;';
      this.definitions_['setup_ps2x'] = 'ps2x.config_gamepad(13, 11, 10, 12, false, false);';
      this.definitions_['tick_ps2x'] = 'ps2x.read_gamepad();';

      const pollingName = InitJoystick(this);
      const code = `${pollingName}();\n`;
      return code;
    },
  },
  '---',
  {
    id: 'whenPressed',
    icon: ps2Icon,
    text: (
      <Text
        id="blocks.motordriverboard.whenPressed"
        defaultMessage="when [KEY] pressed"
      />
    ),
    hat: true,
    inputs: {
      KEY: {
        menu: 'Keys',
      },
    },
    ino(block) {
      this.definitions_['variable_ps2x'] = 'PS2X ps2x;';
      this.definitions_['setup_ps2x'] = 'ps2x.config_gamepad(13, 11, 10, 12, false, false);';
      this.definitions_['tick_ps2x'] = 'ps2x.read_gamepad();';

      const key = block.getFieldValue('KEY');
      const keyName = this.createName(`_ps2x_${key}`);

      // 加入事件定时器
      const pollingName = InitJoystick(this);
      this.definitions_[pollingName] = this.definitions_[pollingName]?.replace(
        '  PSS_RX_Val = ps2x.Analog(PSS_RX);',
        `  if (ps2x.ButtonPressed(${key})) ${keyName}();\n  PSS_RX_Val = ps2x.Analog(PSS_RX);`,
      );

      const branchCode = this.statementToCode(block) || '';
      this.definitions_[`declare_${keyName}`] = `void ${keyName}();`;
      this.definitions_[keyName] = `void ${keyName}() {\n${branchCode}}`;
    },
  },
  {
    id: 'whenJoystickMoved',
    icon: ps2Icon,
    text: (
      <Text
        id="blocks.motordriverboard.whenJoystickMoved"
        defaultMessage="when [JOYSTICK] axis [WAY] [VALUE]"
      />
    ),
    hat: true,
    inputs: {
      JOYSTICK: {
        menu: 'JoyStick',
      },
      WAY: {
        menu: ['>', '<'],
      },
      VALUE: {
        type: 'integer',
        defaultValue: 150,
      },
    },
    ino(block) {
      this.definitions_['variable_ps2x'] = 'PS2X ps2x;';
      this.definitions_['setup_ps2x'] = 'ps2x.config_gamepad(13, 11, 10, 12, false, false);';
      this.definitions_['tick_ps2x'] = 'ps2x.read_gamepad();';

      const joystick = block.getFieldValue('JOYSTICK');
      const way = block.getFieldValue('WAY');
      const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
      const joystickName = this.createName(`_ps2x_${joystick}`);

      // 加入事件定时器
      const pollingName = InitJoystick(this);
      this.definitions_[pollingName] = this.definitions_[pollingName]?.replace(
        '  PSS_RX_Val = ps2x.Analog(PSS_RX);',
        `  if (${value}${way}${joystick}_Val && ps2x.Analog(${joystick})${way}${value}) ${joystickName}();\n  PSS_RX_Val = ps2x.Analog(PSS_RX);`,
      );

      const branchCode = this.statementToCode(block) || '';
      this.definitions_[`declare_${joystickName}`] = `void ${joystickName}();`;
      this.definitions_[joystickName] = `void ${joystickName}() {\n${branchCode}}`;
    },
  },
  '---',
  {
    id: 'keyPressed',
    icon: ps2Icon,
    text: (
      <Text
        id="blocks.motordriverboard.keyPressed"
        defaultMessage="'[KEY] is pressed?'"
      />
    ),
    output: 'boolean',
    inputs: {
      KEY: {
        menu: 'Keys',
      },
    },
    ino(block) {
      this.definitions_['variable_ps2x'] = 'PS2X ps2x;';
      this.definitions_['setup_ps2x'] = 'ps2x.config_gamepad(13, 11, 10, 12, false, false);';
      this.definitions_['tick_ps2x'] = 'ps2x.read_gamepad();';
      const key = block.getFieldValue('KEY');
      const code = `ps2x.Button(${key})`;
      return [code];
    },
  },
  {
    id: 'joystickValue',
    icon: ps2Icon,
    text: (
      <Text
        id="blocks.motordriverboard.joystickValue"
        defaultMessage="'[JOYSTICK] axis value (0~255)'"
      />
    ),
    output: 'number',
    inputs: {
      JOYSTICK: {
        menu: 'JoyStick',
      },
    },
    ino(block) {
      this.definitions_['variable_ps2x'] = 'PS2X ps2x;';
      this.definitions_['setup_ps2x'] = 'ps2x.config_gamepad(13, 11, 10, 12, false, false);';
      this.definitions_['tick_ps2x'] = 'ps2x.read_gamepad();';
      const joystick = block.getFieldValue('JOYSTICK');
      const code = `ps2x.Analog(${joystick})`;
      return [code];
    },
  },
];

export const menus = {
  IOs: {
    items: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
  },
  Servos: {
    items: [
      ['S1', '1'],
      ['S2', '2'],
      ['S3', '3'],
      ['S4', '4'],
      ['S5', '5'],
      ['S6', '6'],
      ['S7', '7'],
      ['S8', '8'],
    ],
  },
  Directions: {
    items: [
      [
        <Text
          id="blocks.motordriverboard.forward"
          defaultMessage="forward"
        />,
        'FORWARD',
      ],
      [
        <Text
          id="blocks.motordriverboard.reverse"
          defaultMessage="reverse"
        />,
        'BACKWARD',
      ],
    ],
  },
  Motors: {
    items: [
      ['M1', 'M1'],
      ['M2', 'M2'],
      ['M3', 'M3'],
      ['M4', 'M4'],
      [
        <Text
          id="blocks.motordriverboard.all"
          defaultMessage="all"
        />,
        'all',
      ],
    ],
  },
  EncoderMotors: {
    items: [
      ['E1', 'E1'],
      ['E2', 'E2'],
      ['E3', 'E3'],
      ['E4', 'E4'],
      [
        <Text
          id="blocks.motordriverboard.all"
          defaultMessage="all"
        />,
        'all',
      ],
    ],
  },
  Steppers: {
    items: ['STEPPER1', 'STEPPER2'],
  },
  Keys: {
    items: [
      [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_UP, 'PSB_PAD_UP'],
      [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_DOWN, 'PSB_PAD_DOWN'],
      [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_LEFT, 'PSB_PAD_LEFT'],
      [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_RIGHT, 'PSB_PAD_RIGHT'],
      ['X (□)', 'PSB_SQUARE'],
      ['Y (△)', 'PSB_TRIANGLE'],
      ['A (✕)', 'PSB_CROSS'],
      ['B (○)', 'PSB_CIRCLE'],
      ['L1', 'PSB_L1'],
      ['L2', 'PSB_L2'],
      ['L3', 'PSB_L3'],
      ['R1', 'PSB_R1'],
      ['R2', 'PSB_R2'],
      ['R3', 'PSB_R3'],
      ['SELECT', 'PSB_SELECT'],
      ['START', 'PSB_START'],
    ],
  },
  JoyStick: {
    items: [
      [
        <Text
          id="blocks.motordriverboard.joystickLXAxis"
          defaultMessage="left joystick X"
        />,
        'PSS_LX',
      ],
      [
        <Text
          id="blocks.motordriverboard.joystickLYAxis"
          defaultMessage="left joystick Y"
        />,
        'PSS_LY',
      ],
      [
        <Text
          id="blocks.motordriverboard.joystickRXAxis"
          defaultMessage="right joystick X"
        />,
        'PSS_RX',
      ],
      [
        <Text
          id="blocks.motordriverboard.joystickRYAxis"
          defaultMessage="right joystick Y"
        />,
        'PSS_RY',
      ],
    ],
  },
};
