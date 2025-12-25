import { Text } from '@blockcode/core';

import imageTurnLeft from './turn-left.svg';
import imageTurnRight from './turn-right.svg';

const isIotBit = (meta) => meta.editor === '@blockcode/gui-iotbit';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.stepmotor.init"
        defaultMessage="set pins INA:[INA] INB:[INB] INC:[INC] IND:[IND]"
      />
    ),
    inputs: {
      INA: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? '18' : '1',
          }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      INB: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? '19' : '2',
          }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      INC: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? '21' : '3',
          }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
      IND: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? '5' : '4',
          }
        : {
            type: 'positive_integer',
            defaultValue: 4,
          },
    },
    mpy(block) {
      const ina = meta.boardPins ? block.getFieldValue('INA') : this.valueToCode(block, 'INA', this.ORDER_NONE);
      const inb = meta.boardPins ? block.getFieldValue('INB') : this.valueToCode(block, 'INB', this.ORDER_NONE);
      const inc = meta.boardPins ? block.getFieldValue('INC') : this.valueToCode(block, 'INC', this.ORDER_NONE);
      const ind = meta.boardPins ? block.getFieldValue('IND') : this.valueToCode(block, 'IND', this.ORDER_NONE);
      this.definitions_['stepper_motor'] = `_stepper = stepper_motor.StepperMotor(${ina}, ${inb}, ${inc}, ${ind})`;
      return '';
    },
  },
  {
    id: 'rpm',
    text: (
      <Text
        id="blocks.stepmotor.rpm"
        defaultMessage="set rpm [RPM]"
      />
    ),
    inputs: {
      RPM: {
        shadow: 'rpmSlider',
        defaultValue: 10,
      },
    },
    mpy(block) {
      const rpm = this.valueToCode(block, 'RPM', this.ORDER_NONE);
      const code = `_stepper.rpm = ${rpm}\n`;
      return code;
    },
  },
  {
    id: 'rpmSlider',
    shadow: true,
    output: 'number',
    inputs: {
      RPM: {
        type: 'slider',
        defaultValue: 0,
        min: 0,
        max: 20,
      },
    },
    mpy(block) {
      const code = block.getFieldValue('RPM') || 0;
      return [code, this.ORDER_NONE];
    },
  },
  {
    id: 'right',
    text: (
      <Text
        id="blocks.stepmotor.right"
        defaultMessage="turn [IMAGE] around"
      />
    ),
    inputs: {
      IMAGE: {
        type: 'image',
        src: imageTurnRight,
      },
    },
    mpy(block) {
      let code = '';
      code += `_stepper.forward()\n`;
      code += '_stepper.run()\n';
      return code;
    },
  },
  {
    id: 'left',
    text: (
      <Text
        id="blocks.stepmotor.left"
        defaultMessage="turn [IMAGE] around"
      />
    ),
    inputs: {
      IMAGE: {
        type: 'image',
        src: imageTurnLeft,
      },
    },
    mpy(block) {
      let code = '';
      code += `_stepper.backward()\n`;
      code += '_stepper.run()\n';
      return code;
    },
  },
  {
    id: 'stop',
    text: (
      <Text
        id="blocks.stepmotor.stop"
        defaultMessage="stop"
      />
    ),
    mpy(block) {
      const code = '_stepper.stop()\n';
      return code;
    },
  },
  '---',
  {
    id: 'turnRightSteps',
    text: (
      <Text
        id="blocks.stepmotor.turnRightSteps"
        defaultMessage="turn [IMAGE][STEPS] steps"
      />
    ),
    inputs: {
      IMAGE: {
        type: 'image',
        src: imageTurnRight,
      },
      STEPS: {
        type: 'integer',
        defaultValue: 10,
      },
    },
    mpy(block) {
      const steps = this.valueToCode(block, 'STEPS', this.ORDER_NONE);
      let code = '';
      code += `_stepper.move(${steps})\n`;
      code += 'await _stepper.run_wait()\n';
      return code;
    },
  },
  {
    id: 'turnLeftSteps',
    text: (
      <Text
        id="blocks.stepmotor.turnLeftSteps"
        defaultMessage="turn [IMAGE][STEPS] steps"
      />
    ),
    inputs: {
      IMAGE: {
        type: 'image',
        src: imageTurnLeft,
      },
      STEPS: {
        type: 'integer',
        defaultValue: 10,
      },
    },
    mpy(block) {
      const steps = this.valueToCode(block, 'STEPS', this.ORDER_NONE);
      let code = '';
      code += `_stepper.move(-${steps})\n`;
      code += 'await _stepper.run_wait()\n';
      return code;
    },
  },
  '---',
  {
    id: 'turnRight',
    text: (
      <Text
        id="blocks.stepmotor.turnRight"
        defaultMessage="turn [IMAGE][DEGREES] degrees"
      />
    ),
    inputs: {
      IMAGE: {
        type: 'image',
        src: imageTurnRight,
      },
      DEGREES: {
        type: 'integer',
        defaultValue: 15,
      },
    },
    mpy(block) {
      const degrees = this.valueToCode(block, 'DEGREES', this.ORDER_NONE);
      let code = '';
      code += `_stepper.rotate(${degrees})\n`;
      code += 'await _stepper.run_wait()\n';
      return code;
    },
  },
  {
    id: 'turnLeft',
    text: (
      <Text
        id="blocks.stepmotor.turnLeft"
        defaultMessage="trun [IMAGE][DEGREES] degrees"
      />
    ),
    inputs: {
      IMAGE: {
        type: 'image',
        src: imageTurnLeft,
      },
      DEGREES: {
        type: 'integer',
        defaultValue: 15,
      },
    },
    mpy(block) {
      const degrees = this.valueToCode(block, 'DEGREES', this.ORDER_NONE);
      let code = '';
      code += `_stepper.rotate(-${degrees})\n`;
      code += 'await _stepper.run_wait()\n';
      return code;
    },
  },
  {
    id: 'turn',
    text: (
      <Text
        id="blocks.stepmotor.turn"
        defaultMessage="turn to [ANGLE] degrees"
      />
    ),
    inputs: {
      ANGLE: {
        type: 'angle',
        defaultValue: 0,
      },
    },
    mpy(block) {
      const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      let code = '';
      code += `_stepper.target_angle = ${angle}\n`;
      code += 'await _stepper.run_wait()\n';
      return code;
    },
  },
];

export const menus = {
  iotOutPins: {
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
