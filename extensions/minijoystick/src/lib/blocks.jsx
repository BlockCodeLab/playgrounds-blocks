import { Text } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export const blocks = (meta) => [
  {
    id: 'eventPolling',
    text: (
      <Text
        id="blocks.minijoystick.eventPolling"
        defaultMessage="joystick events polling"
      />
    ),
    ino(block) {
      this.definitions_['variable_minijoystick'] = 'JoystickHandle joystick(JOYSTICK_I2C_ADDR);';

      const pollingName = 'joystickPolling';
      if (!this.definitions_[pollingName]) {
        let code = '';
        code += `void ${pollingName}() {\n`;
        code += `  unsigned long t = millis();\n`;
        code += `  static uint8_t X_Val, Y_Val;\n`;
        code += `  X_Val = joystick.AnalogRead_X();\n`;
        code += `  Y_Val = joystick.AnalogRead_Y();\n`;
        code += `  if (millis()-t<20) delay(20-(millis()-t));\n`;
        code += `}`;

        this.definitions_[`declare_${pollingName}`] = `void ${pollingName}();`;
        this.definitions_[pollingName] = code;
      }

      const code = `${pollingName}();\n`;
      return code;
    },
  },
  {
    id: 'whenPressed',
    text: (
      <Text
        id="blocks.minijoystick.whenPressed"
        defaultMessage="when [KEY] pressed"
      />
    ),
    hat: true,
    inputs: {
      KEY: {
        menu: ['A', 'B', 'X', 'Y', 'OK'],
      },
    },
    ino(block) {
      this.definitions_['variable_minijoystick'] = 'JoystickHandle joystick(JOYSTICK_I2C_ADDR);';

      const key = block.getFieldValue('KEY');
      const keyName = this.createName(`joystick_${key}`);

      // 加入事件定时器
      const pollingName = 'joystickPolling';
      this.definitions_[pollingName] = this.definitions_[pollingName]?.replace(
        '  X_Val = joystick.AnalogRead_X();\n',
        `  if (joystick.ButtonPressed(BUTTON_${key})) ${keyName}();\n  X_Val = joystick.AnalogRead_X();\n`,
      );

      const branchCode = this.statementToCode(block) || '';
      this.definitions_[`declare_${keyName}`] = `void ${keyName}();`;
      this.definitions_[keyName] = `void ${keyName}() {\n${branchCode}}`;
    },
  },
  {
    id: 'whenJoystickMoved',
    text: (
      <Text
        id="blocks.minijoystick.whenJoystickMoved"
        defaultMessage="when [JOYSTICK] axis [WAY] [VALUE]"
      />
    ),
    hat: true,
    inputs: {
      JOYSTICK: {
        menu: ['X', 'Y'],
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
      this.definitions_['variable_minijoystick'] = 'JoystickHandle joystick(JOYSTICK_I2C_ADDR);';

      const joystick = block.getFieldValue('JOYSTICK');
      const way = block.getFieldValue('WAY');
      const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
      const joystickName = this.createName(`joystick_${joystick}`);

      // 加入事件定时器
      const pollingName = 'joystickPolling';
      this.definitions_[pollingName] = this.definitions_[pollingName]?.replace(
        '  X_Val = joystick.AnalogRead_X();\n',
        `  if (${value}${way}${joystick}_Val && joystick.AnalogRead_${joystick}()${way}${value}) ${joystickName}();\n  X_Val = joystick.AnalogRead_X();\n`,
      );

      const branchCode = this.statementToCode(block) || '';
      this.definitions_[`declare_${joystickName}`] = `void ${joystickName}();`;
      this.definitions_[joystickName] = `void ${joystickName}() {\n${branchCode}}`;
    },
  },
  '---',
  {
    id: 'joystickValue',
    text: (
      <Text
        id="blocks.minijoystick.joystickValue"
        defaultMessage="joystick [JOYSTICK] axis value (0~255)"
      />
    ),
    output: 'number',
    inputs: {
      JOYSTICK: {
        menu: ['X', 'Y'],
      },
    },
    ino(block) {
      this.definitions_['variable_minijoystick'] = 'JoystickHandle joystick(JOYSTICK_I2C_ADDR);';
      const joystick = block.getFieldValue('JOYSTICK');
      const code = `joystick.AnalogRead_${joystick}()`;
      return [code];
    },
  },
  {
    id: 'keyPressed',
    text: (
      <Text
        id="blocks.minijoystick.keyPressed"
        defaultMessage="[KEY] is pressed"
      />
    ),
    output: 'boolean',
    inputs: {
      KEY: {
        menu: ['A', 'B', 'X', 'Y', 'OK'],
      },
    },
    ino(block) {
      this.definitions_['variable_minijoystick'] = 'JoystickHandle joystick(JOYSTICK_I2C_ADDR);';
      const key = block.getFieldValue('KEY');
      const code = `(joystick.Get_Button_Status(BUTTON_${key}) == PRESS_DOWN)`;
      return [code];
    },
  },
];
