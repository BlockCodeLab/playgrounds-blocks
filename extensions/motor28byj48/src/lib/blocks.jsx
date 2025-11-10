import { Text } from '@blockcode/core';

import imageTurnLeft from './turn-left.svg';
import imageTurnRight from './turn-right.svg';

export const blocks = [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.stepmotor.init"
        defaultMessage="set pins INA[INA] INB[INB] INC[INC] IND[IND]"
      />
    ),
    inputs: {
      INA: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      INB: {
        type: 'positive_integer',
        defaultValue: 2,
      },
      INC: {
        type: 'positive_integer',
        defaultValue: 3,
      },
      IND: {
        type: 'positive_integer',
        defaultValue: 4,
      },
    },
    mpy(block) {
      const ina = this.valueToCode(block, 'INA', this.ORDER_NONE);
      const inb = this.valueToCode(block, 'INB', this.ORDER_NONE);
      const inc = this.valueToCode(block, 'INC', this.ORDER_NONE);
      const ind = this.valueToCode(block, 'IND', this.ORDER_NONE);
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
        type: 'positive_integer',
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
