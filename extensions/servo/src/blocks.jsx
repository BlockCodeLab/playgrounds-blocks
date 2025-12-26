import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'setServo180',
    text: (
      <Text
        id="blocks.servo.180servo"
        defaultMessage="set PIN [PIN] 180° servo angle to [ANGLE]°"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      ANGLE: {
        shadow: 'angle180',
        defaultValue: 90,
      },
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const angleCode = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      const code = `servo.set_angle(${pin}, ${angleCode})\n`;
      return code;
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const angleCode = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      this.definitions_['include_servo'] = '#include <Servo.h>';
      this.definitions_['variable_servo'] = 'Servo _servo;';
      let code = '';
      code += `_servo.attach(${pin}); `;
      code += `_servo.write(${angleCode});\n`;
      return code;
    },
  },
  {
    id: 'setServo270',
    text: (
      <Text
        id="blocks.servo.270servo"
        defaultMessage="set PIN [PIN] 270° servo angle to [ANGLE]°"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      ANGLE: {
        shadow: 'angle270',
        defaultValue: 0,
      },
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const angleCode = this.valueToCode(block, 'ANGLE', this.ORDER_NONE) || 0;
      const code = `servo.set_angle(${pin}, ${angleCode}, angle=270)\n`;
      return code;
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const angleCode = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      this.definitions_['include_servo'] = '#include <Servo.h>';
      this.definitions_['variable_servo'] = 'Servo _servo;';
      let code = '';
      code += `_servo.attach(${pin}); `;
      code += `_servo.write(map(${angleCode}, 0, 270, 0, 180));\n`;
      return code;
    },
  },
  // {
  //   id: 'setServo90',
  //   text: (
  //     <Text
  //       id="blocks.servo.90servo"
  //       defaultMessage="set PIN [PIN] 90° servo angle to [ANGLE]°"
  //     />
  //   ),
  //   inputs: {
  //     PIN: {
  //       type: 'integer',
  //       defaultValue: 1,
  //     },
  //     ANGLE: {
  //       shadow: 'angle90',
  //       defaultValue: 0,
  //     },
  //   },
  //   mpy(block) {
  //     const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE) || 0;
  //     const angleCode = this.valueToCode(block, 'ANGLE', this.ORDER_NONE) || 0;
  //     const code = `servo.set_angle(${pin}, ${angleCode}, angle=90)\n`;
  //     return code;
  //   },
  //   ino(block) {
  //     const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
  //     const angleCode = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
  //     this.definitions_['include_servo'] = '#include <Servo.h>';
  //     this.definitions_['variable_servo'] = 'Servo _servo;';
  //     let code = '';
  //     code += `_servo.attach(${pin}); `;
  //     code += `_servo.write(map(${angleCode}, 0, 90, 0, 180));\n`;
  //     return code;
  //   },
  // },
  '---',
  {
    id: 'setMotor',
    text: (
      <Text
        id="blocks.servo.motor"
        defaultMessage="set PIN [PIN] 360° servo rotate [ROTATE]"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
      ROTATE: {
        type: 'integer',
        inputMode: true,
        defaultValue: 1,
        menu: [
          [
            <Text
              id="blocks.servo.motorClockwise"
              defaultMessage="clockwise"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.servo.motorAnticlockwise"
              defaultMessage="anticlockwise"
            />,
            '-1',
          ],
          [
            <Text
              id="blocks.servo.motorStop"
              defaultMessage="stop"
            />,
            '0',
          ],
        ],
      },
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const rotate = block.getFieldValue('ROTATE') || '1';
      const code = `servo.set_motor(${pin}, ${rotate})\n`;
      return code;
    },
    ino(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE) || 0;
      const rotate = block.getFieldValue('ROTATE') || '1';
      this.definitions_['include_servo'] = '#include <Servo.h>';
      this.definitions_['variable_servo'] = 'Servo _servo;';
      let code = '';
      code += `_servo.attach(${pin}); `;
      code += `_servo.writeMicroseconds(${[1500, 2000, 1000][rotate]});\n`;
      return code;
    },
  },
  // 内连输入积木，不显示
  {
    id: 'angle180',
    shadow: true,
    output: 'number',
    inputs: {
      ANGLE: {
        type: 'slider',
        defaultValue: 0,
        min: 0,
        max: 180,
      },
    },
    mpy(block) {
      const angleCode = block.getFieldValue('ANGLE') || 0;
      return [angleCode, this.ORDER_NONE];
    },
    ino(block) {
      const angleCode = block.getFieldValue('ANGLE') || 0;
      return [angleCode, this.ORDER_NONE];
    },
  },
  {
    id: 'angle270',
    shadow: true,
    output: 'number',
    inputs: {
      ANGLE: {
        type: 'slider',
        defaultValue: 0,
        min: 0,
        max: 270,
      },
    },
    mpy(block) {
      const angleCode = block.getFieldValue('ANGLE') || 0;
      return [angleCode, this.ORDER_NONE];
    },
    ino(block) {
      const angleCode = block.getFieldValue('ANGLE') || 0;
      return [angleCode, this.ORDER_NONE];
    },
  },
  {
    id: 'angle90',
    shadow: true,
    output: 'number',
    inputs: {
      ANGLE: {
        type: 'slider',
        defaultValue: 0,
        min: 0,
        max: 90,
      },
    },
    mpy(block) {
      const angleCode = block.getFieldValue('ANGLE') || 0;
      return [angleCode, this.ORDER_NONE];
    },
    ino(block) {
      const angleCode = block.getFieldValue('ANGLE') || 0;
      return [angleCode, this.ORDER_NONE];
    },
  },
];
