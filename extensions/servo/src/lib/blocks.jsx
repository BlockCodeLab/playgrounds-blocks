import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  // {
  //   id: 'setServo90',
  //   text: (
  //     <Text
  //       id="blocks.servo.90servo"
  //       defaultMessage="set PIN [PIN] 90° servo angle to [ANGLE]°"
  //     />
  //   ),
  //   inputs: {
  //     PIN: meta.boardPins
  //       ? { menu: meta.boardPins.out }
  //       : {
  //           type: 'positive_integer',
  //           defaultValue: 1,
  //         },
  //     ANGLE: {
  //       shadow: 'angle90',
  //       defaultValue: 0,
  //     },
  //   },
  //   mpy(block) {
  //     const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
  //     const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
  //     const pinName = `servo90_${pin}`;
  //     this.definitions_['import_pin'] = 'from machine import Pin';
  //     this.definitions_['import_servo'] = 'from servo import Servo';
  //     this.definitions_[pinName] = `${pinName} = Servo(Pin(${pin}), max_deg=90)`;
  //     const code = `${pinName}.write(${angle})\n`;
  //     return code;
  //   },
  //   ino(block) {
  //     const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
  //     const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
  //     const pinName = `servo90_${pin}`;
  //     this.definitions_['include_servo'] = '#include <Servo.h>';
  //     this.definitions_[`variable_${pinName}`] = `Servo ${pinName};`;
  //     this.definitions_[`setup_${pinName}`] = `${pinName}.attach(${pin});`;
  //     const code = `${pinName}.write(map(${angle}, 0, 90, 0, 180));\n`;
  //     return code;
  //   },
  // },
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
      const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      const pinName = `servo180_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_servo'] = 'from servo import Servo';
      this.definitions_[pinName] = `${pinName} = Servo(Pin(${pin}))`;
      const code = `${pinName}.write(${angle})\n`;
      return code;
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      const pinName = `servo180_${pin}`;
      this.definitions_['include_servo'] = '#include <Servo.h>';
      this.definitions_[`variable_${pinName}`] = `Servo ${pinName};`;
      this.definitions_[`setup_${pinName}`] = `${pinName}.attach(${pin});`;
      const code = `${pinName}.write(${angle});\n`;
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
      const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      const pinName = `servo270_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_servo'] = 'from servo import Servo';
      this.definitions_[pinName] = `${pinName} = Servo(Pin(${pin}), max_deg=270)`;
      const code = `${pinName}.write(${angle})\n`;
      return code;
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
      const pinName = `servo270_${pin}`;
      this.definitions_['include_servo'] = '#include <Servo.h>';
      this.definitions_[`variable_${pinName}`] = `Servo ${pinName};`;
      this.definitions_[`setup_${pinName}`] = `${pinName}.attach(${pin});`;
      const code = `${pinName}.write(map(${angle}, 0, 270, 0, 180));\n`;
      return code;
    },
  },
  // {
  //   id: 'setServo360',
  //   text: (
  //     <Text
  //       id="blocks.servo.360servo"
  //       defaultMessage="set PIN [PIN] 360° servo angle to [ANGLE]°"
  //     />
  //   ),
  //   inputs: {
  //     PIN: meta.boardPins
  //       ? { menu: meta.boardPins.out }
  //       : {
  //           type: 'positive_integer',
  //           defaultValue: 1,
  //         },
  //     ANGLE: {
  //       shadow: 'angle360',
  //       defaultValue: 180,
  //     },
  //   },
  //   mpy(block) {
  //     const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
  //     const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
  //     const pinName = `servo360_${pin}`;
  //     this.definitions_['import_pin'] = 'from machine import Pin';
  //     this.definitions_['import_servo'] = 'from servo import Servo';
  //     this.definitions_[pinName] = `${pinName} = Servo(Pin(${pin}), max_deg=360)`;
  //     const code = `${pinName}.write(${angle})\n`;
  //     return code;
  //   },
  //   ino(block) {
  //     const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
  //     const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);
  //     const pinName = `servo360_${pin}`;
  //     this.definitions_['include_servo'] = '#include <Servo.h>';
  //     this.definitions_[`variable_${pinName}`] = `Servo ${pinName};`;
  //     this.definitions_[`setup_${pinName}`] = `${pinName}.attach(${pin});`;
  //     const code = `${pinName}.write(map(${angle}, 0, 360, 0, 180));\n`;
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
              id="blocks.servo.motorForward"
              defaultMessage="forward"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.servo.motorReverse"
              defaultMessage="reverse"
            />,
            '2',
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
      const rotate = this.valueToCode(block, 'ROTATE', this.ORDER_NONE);
      const pinName = `motor360_${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_servo'] = 'from servo import Servo';
      this.definitions_[pinName] = `${pinName} = Servo(Pin(${pin}))`;
      const code = `${pinName}.write_us(${[1500, 2000, 1000][rotate]})\n`;
      return code;
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const rotate = this.valueToCode(block, 'ROTATE', this.ORDER_NONE);
      const pinName = `motor360_${pin}`;
      this.definitions_['include_servo'] = '#include <Servo.h>';
      this.definitions_[`variable_${pinName}`] = `Servo ${pinName};`;
      this.definitions_[`setup_${pinName}`] = `${pinName}.attach(${pin});`;
      const code = `${pinName}.writeMicroseconds(${[1500, 2000, 1000][rotate]});\n`;
      return code;
    },
  },
  // 内连输入积木，不显示
  // {
  //   id: 'angle360',
  //   shadow: true,
  //   output: 'number',
  //   inputs: {
  //     ANGLE: {
  //       type: 'slider',
  //       defaultValue: 0,
  //       min: 0,
  //       max: 360,
  //     },
  //   },
  //   mpy(block) {
  //     const angle = block.getFieldValue('ANGLE') || 0;
  //     return [angle, this.ORDER_NONE];
  //   },
  //   ino(block) {
  //     const angle = block.getFieldValue('ANGLE') || 0;
  //     return [angle, this.ORDER_NONE];
  //   },
  // },
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
      const angle = block.getFieldValue('ANGLE') || 0;
      return [angle, this.ORDER_NONE];
    },
    ino(block) {
      const angle = block.getFieldValue('ANGLE') || 0;
      return [angle, this.ORDER_NONE];
    },
  },
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
      const angle = block.getFieldValue('ANGLE') || 0;
      return [angle, this.ORDER_NONE];
    },
    ino(block) {
      const angle = block.getFieldValue('ANGLE') || 0;
      return [angle, this.ORDER_NONE];
    },
  },
  // {
  //   id: 'angle90',
  //   shadow: true,
  //   output: 'number',
  //   inputs: {
  //     ANGLE: {
  //       type: 'slider',
  //       defaultValue: 0,
  //       min: 0,
  //       max: 90,
  //     },
  //   },
  //   mpy(block) {
  //     const angle = block.getFieldValue('ANGLE') || 0;
  //     return [angle, this.ORDER_NONE];
  //   },
  //   ino(block) {
  //     const angle = block.getFieldValue('ANGLE') || 0;
  //     return [angle, this.ORDER_NONE];
  //   },
  // },
];
