import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'setaddr',
    text: (
      <Text
        id="blocks.ioexpansion.addr"
        defaultMessage="set I2C address [ADDR]"
      />
    ),
    inputs: {
      ADDR: {
        menu: [
          ['0×24', '0x24'],
          ['0×25', '0x25'],
          ['0×26', '0x26'],
          ['0×27', '0x27'],
          ['0×28', '0x28'],
          ['0×29', '0x29'],
          ['0×2A', '0x2A'],
          ['0×2B', '0x2B'],
        ],
      },
    },
    ino(block) {
      const addr = block.getFieldValue('ADDR');
      this.definitions_['variable_ioexpansion'] = `IOExpansion ioExpansion(${addr});`;
      this.definitions_['setup_wire'] = 'Wire.begin();';
      return '';
    },
  },
  '---',
  {
    id: 'setmode',
    text: (
      <Text
        id="blocks.ioexpansion.setmode"
        defaultMessage="set pin [PIN] mode to [MODE]"
      />
    ),
    inputs: {
      PIN: {
        menu: 'IOPins',
      },
      MODE: {
        menu: [
          [
            <Text
              id="blocks.ioexpansion.inputMode"
              defaultMessage="input"
            />,
            'InputPullDown',
          ],
          [
            <Text
              id="blocks.ioexpansion.outputMode"
              defaultMessage="output"
            />,
            'Output',
          ],
          [
            <Text
              id="blocks.ioexpansion.inputPullUpMode"
              defaultMessage="input pull-up"
            />,
            'InputPullUp',
          ],
          [
            <Text
              id="blocks.ioexpansion.inputAdcMode"
              defaultMessage="input adc"
            />,
            'Adc',
          ],
          // [
          //   <Text
          //     id="blocks.ioexpansion.outputPwmMode"
          //     defaultMessage="output pwm"
          //   />,
          //   'Pwm',
          // ],
        ],
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN') || 'E0';
      const mode = block.getFieldValue('MODE') || 'InputPullDown';

      if (!this.definitions_['variable_ioexpansion']) {
        this.definitions_['variable_ioexpansion'] = 'IOExpansion ioExpansion(IOExpansion::kDeviceI2cAddressDefault);';
      }
      this.definitions_['setup_wire'] = 'Wire.begin();';

      const code = `ioExpansion.SetGpioMode(IOExpansion::kGpioPin${pin}, IOExpansion::k${mode});\n`;
      return code;
    },
  },
  '---',
  {
    id: 'setdigital',
    text: (
      <Text
        id="blocks.ioexpansion.setdigital"
        defaultMessage="set digital pin [PIN] to [VALUE]"
      />
    ),
    inputs: {
      PIN: {
        menu: 'IOPins',
      },
      VALUE: {
        inputMode: true,
        type: 'number',
        defaultValue: '1',
        menu: [
          [
            <Text
              id="blocks.ioexpansion.digitalHigh"
              defaultMessage="high"
            />,
            '1',
          ],
          [
            <Text
              id="blocks.ioexpansion.digitalLow"
              defaultMessage="low"
            />,
            '0',
          ],
        ],
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN') || 'E0';
      const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);

      if (!this.definitions_['variable_ioexpansion']) {
        this.definitions_['variable_ioexpansion'] = 'IOExpansion ioExpansion(IOExpansion::kDeviceI2cAddressDefault);';
      }
      this.definitions_['setup_wire'] = 'Wire.begin();';

      const code = `ioExpansion.SetGpioLevel(IOExpansion::kGpioPin${pin}, ${value});\n`;
      return code;
    },
  },
  {
    id: 'digital',
    text: (
      <Text
        id="blocks.ioexpansion.isDigitalHigh"
        defaultMessage="digital pin [PIN] is high?"
      />
    ),
    output: 'boolean',
    inputs: {
      PIN: {
        menu: 'IOPins',
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN') || 'E0';

      if (!this.definitions_['variable_ioexpansion']) {
        this.definitions_['variable_ioexpansion'] = 'IOExpansion ioExpansion(IOExpansion::kDeviceI2cAddressDefault);';
      }
      this.definitions_['setup_wire'] = 'Wire.begin();';

      const code = `(ioExpansion.GetGpioLevel(IOExpansion::kGpioPin${pin}) != 0)`;
      return [code];
    },
  },
  {
    id: 'analog',
    text: (
      <Text
        id="blocks.ioexpansion.analogValue"
        defaultMessage="pin [PIN] analog value"
      />
    ),
    output: 'number',
    inputs: {
      PIN: {
        menu: 'IOPins',
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN') || 'E0';

      if (!this.definitions_['variable_ioexpansion']) {
        this.definitions_['variable_ioexpansion'] = 'IOExpansion ioExpansion(IOExpansion::kDeviceI2cAddressDefault);';
      }
      this.definitions_['setup_wire'] = 'Wire.begin();';

      const code = `ioExpansion.GetGpioAdcValue(IOExpansion::kGpioPin${pin})`;
      return [code];
    },
  },
  // {
  //   id: 'percentage',
  //   text: (
  //     <Text
  //       id="blocks.ioexpansion.percentageValue"
  //       defaultMessage="pin [PIN] percentage"
  //     />
  //   ),
  //   output: 'number',
  //   inputs: {
  //     PIN: {
  //       menu: 'IOPins',
  //     },
  //   },
  //   ino(block) {
  //     const pin = block.getFieldValue('PIN') || 'E0';

  //     if (!this.definitions_['variable_ioexpansion']) {
  //       this.definitions_['variable_ioexpansion'] = 'IOExpansion ioExpansion(IOExpansion::kDeviceI2cAddressDefault);';
  //     }
  //     this.definitions_['setup_wire'] = 'Wire.begin();';;

  //     const code = `(ioExpansion.GetGpioAdcValue(IOExpansion::kGpioPin${pin}) / 1023)`;
  //     return [code];
  //   },
  // },
  '---',
  {
    id: 'setfreq',
    text: (
      <Text
        id="blocks.ioexpansion.setfreq"
        defaultMessage="set pwm frequency to [FREQ] Hz"
      />
    ),
    inputs: {
      FREQ: {
        type: 'integer',
        defaultValue: '1000',
      },
    },
    ino(block) {
      const freq = this.valueToCode(block, 'FREQ', this.ORDER_NONE);

      if (!this.definitions_['variable_ioexpansion']) {
        this.definitions_['variable_ioexpansion'] = 'IOExpansion ioExpansion(IOExpansion::kDeviceI2cAddressDefault);';
      }
      this.definitions_['setup_wire'] = 'Wire.begin();';

      const code = `ioExpansion.SetPwmFrequency(${freq});\n`;
      return code;
    },
  },
  {
    id: 'setpwm',
    text: (
      <Text
        id="blocks.ioexpansion.setpwm"
        defaultMessage="set pin [PIN] pwm to [VALUE]"
      />
    ),
    inputs: {
      PIN: {
        menu: 'PWMPins',
      },
      VALUE: {
        shadow: 'pwmslider',
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN') || 'E0';
      const value = this.valueToCode(block, 'VALUE', this.ORDER_NONE);

      if (!this.definitions_['variable_ioexpansion']) {
        this.definitions_['variable_ioexpansion'] = 'IOExpansion ioExpansion(IOExpansion::kDeviceI2cAddressDefault);';
      }
      this.definitions_['setup_wire'] = 'Wire.begin();';

      const code = `ioExpansion.SetPwmDuty(IOExpansion::kGpioPin${pin}, ${value});\n`;
      return code;
    },
  },
  {
    id: 'setservo',
    text: (
      <Text
        id="blocks.ioexpansion.setservo"
        defaultMessage="set pin [PIN] sevro angle to [ANGLE]"
      />
    ),
    inputs: {
      PIN: {
        menu: 'PWMPins',
      },
      ANGLE: {
        shadow: 'angleslider',
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN') || 'E0';
      const angle = this.valueToCode(block, 'ANGLE', this.ORDER_NONE);

      if (!this.definitions_['variable_ioexpansion']) {
        this.definitions_['variable_ioexpansion'] = 'IOExpansion ioExpansion(IOExpansion::kDeviceI2cAddressDefault);';
      }
      this.definitions_['setup_wire'] = 'Wire.begin();';

      const code = `ioExpansion.SetServoAngle(IOExpansion::kGpioPin${pin}, ${angle});\n`;
      return code;
    },
  },
  {
    // 0-4095 滑块
    id: 'pwmslider',
    shadow: true,
    output: 'number',
    inputs: {
      VALUE: {
        type: 'slider',
        min: 0,
        max: 4095,
        step: 1,
        defaultValue: 1024,
      },
    },
    ino(block) {
      const value = block.getFieldValue('VALUE') || 0;
      return [value];
    },
  },
  {
    // 0-180 滑块
    id: 'angleslider',
    shadow: true,
    output: 'number',
    inputs: {
      ANGLE: {
        type: 'slider',
        min: 0,
        max: 180,
        step: 1,
        defaultValue: 90,
      },
    },
    ino(block) {
      const value = block.getFieldValue('ANGLE') || 0;
      return [value];
    },
  },
];

export const menus = {
  IOPins: {
    items: ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7'],
  },
  PWMPins: {
    items: ['E1', 'E2'],
  },
};
