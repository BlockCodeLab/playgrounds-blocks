import { setMeta, Text } from '@blockcode/core';

export const blocks = (meta) => {
  const isArduino = meta.editor === '@blockcode/gui-arduino';
  const isESP32 = meta.editor === '@blockcode/gui-esp32';

  const portsInMenu = {
    menu: isArduino ? 'portsIn' : 'portsIn_ESP32',
  };
  const portsOutMenu = {
    menu: isArduino ? 'portsOut' : 'portsOut_ESP32',
  };
  const ports4Menu = {
    menu: isArduino ? 'ports4' : 'ports4_ESP32',
  };
  const ports5Menu = {
    menu: isArduino ? 'ports5' : 'ports5_ESP32',
  };
  const portsADCMenu = {
    menu: isArduino ? 'portsADC' : 'portsADC_ESP32',
  };
  const portsSoundMenu = {
    type: 'string',
    menu: isArduino ? ['P5', 'P6'] : ['P11', 'P12'],
  };
  const portsMotorMenu = {
    type: 'string',
    menu: isArduino ? 'ports4' : ['M1', 'M2', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15'],
  };

  if (isArduino) {
    if (meta.boardType !== 'BLEUNO') {
      setMeta('boardType', 'BLEUNO');
    }
  } else if (isESP32) {
    if (meta.boardType !== 'ESP32_IOT_BOARD') {
      setMeta('boardType', 'ESP32_IOT_BOARD');
    }
  }

  return []
    .concat(
      [
        // {
        //   label: (
        //     <Text
        //       id="blocks.wirelesscodingkit.label.led"
        //       defaultMessage="LED"
        //     />
        //   ),
        // },
        {
          id: 'setLED',
          text: (
            <Text
              id="blocks.wirelesscodingkit.led"
              defaultMessage="set [PORT] LED [STATE]"
            />
          ),
          inputs: {
            PORT: portsInMenu,
            STATE: {
              menu: 'stateOnOff',
            },
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P1');
            const state = this.valueToCode(block, 'STATE', this.ORDER_NONE) || 0;
            const code = `wirelesskit.set_led(${port}, ${state})\n`;
            return code;
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P1';
            const state = this.valueToCode(block, 'STATE', this.ORDER_NONE) || 0;
            this.definitions_[`setup_led_${port}`] = `init_led(${port});`;
            const code = `set_led(${port}, ${state});\n`;
            return code;
          },
        },
        {
          id: 'toggleLED',
          text: (
            <Text
              id="blocks.wirelesscodingkit.ledToggle"
              defaultMessage="toggle [PORT] LED"
            />
          ),
          inputs: {
            PORT: portsInMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P1');
            const code = `wirelesskit.toggle_led(${port})\n`;
            return code;
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P1';
            this.definitions_[`setup_led_${port}`] = `init_led(${port});`;
            const code = `toggle_led(${port});\n`;
            return code;
          },
        },
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.motor"
              defaultMessage="Motor"
            />
          ),
        },
        {
          id: 'motor',
          text: (
            <Text
              id="blocks.wirelesscodingkit.motor"
              defaultMessage="set [PORT] motor [DIR] speed to [PERCENT]"
            />
          ),
          inputs: {
            PORT: portsMotorMenu,
            DIR: {
              type: 'integer',
              inputMode: true,
              defaultValue: '1',
              menu: [
                [
                  <Text
                    id="blocks.wirelesscodingkit.motorForward"
                    defaultMessage="forward"
                  />,
                  '1',
                ],
                [
                  <Text
                    id="blocks.wirelesscodingkit.motorReverse"
                    defaultMessage="reverse"
                  />,
                  '-1',
                ],
              ],
            },
            PERCENT: {
              shadow: 'percentValue',
              defaultValue: 100,
            },
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'M1');
            const dirCode = this.valueToCode(block, 'DIR', this.ORDER_NONE) || 1;
            const percentCode = this.valueToCode(block, 'PERCENT', this.ORDER_NONE) || 100;
            const code = `wirelesskit.set_motor(${port}, ${dirCode}, ${percentCode})\n`;
            return code;
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'M1';
            const dirCode = this.valueToCode(block, 'DIR', this.ORDER_NONE) || 1;
            const percentCode = this.valueToCode(block, 'PERCENT', this.ORDER_NONE) || 100;
            this.definitions_[`setup_motor_${port}`] = `init_motor(${port});`;
            const code = `set_motor(${port}, ${dirCode}, ${percentCode});\n`;
            return code;
          },
        },
        {
          id: 'percentValue',
          shadow: true,
          output: 'number',
          inputs: {
            PERCENT: {
              type: 'slider',
              min: 0,
              max: 100,
              step: 10,
            },
          },
          mpy(block) {
            const percentCode = block.getFieldValue('PERCENT') || 0;
            return [percentCode, this.ORDER_NONE];
          },
          ino(block) {
            const percentCode = block.getFieldValue('PERCENT') || 0;
            return [percentCode, this.ORDER_NONE];
          },
        },
        {
          id: 'stopMotor',
          text: (
            <Text
              id="blocks.wirelesscodingkit.stopMotor"
              defaultMessage="stop [PORT] motor"
            />
          ),
          inputs: {
            PORT: portsMotorMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P1');
            const code = `wirelesskit.set_motor(${port}, speed=0)\n`;
            return code;
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'M1';
            this.definitions_[`setup_motor_${port}`] = `init_motor(${port});`;
            const code = `stop_motor(${port});\n`;
            return code;
          },
        },
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.buzzer"
              defaultMessage="Buzzer"
            />
          ),
        },
        {
          id: 'buzzer',
          text: (
            <Text
              id="blocks.wirelesscodingkit.buzzer"
              defaultMessage="set [PORT] buzzer [STATE]"
            />
          ),
          inputs: {
            PORT: portsInMenu,
            STATE: {
              menu: 'stateOnOff',
            },
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P1');
            const state = this.valueToCode(block, 'STATE', this.ORDER_NONE) || 0;
            const code = `wirelesskit.set_buzzer(${port}, ${state})\n`;
            return code;
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P1';
            const state = this.valueToCode(block, 'STATE', this.ORDER_NONE) || 0;
            this.definitions_[`setup_buzzer_${port}`] = `init_buzzer(${port});`;
            const code = `set_buzzer(${port}, ${state});\n`;
            return code;
          },
        },
      ],
      // Arduino 主板才有4位数码管
      isArduino && [
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.4digit7segment"
              defaultMessage="4-Digit 7-Segment"
            />
          ),
        },
        {
          id: 'segmentNumber',
          text: (
            <Text
              id="blocks.wirelesscodingkit.segmentNumber"
              defaultMessage="4-digit 7-segment display numbers [NUMBER]"
            />
          ),
          inputs: {
            NUMBER: {
              type: 'number',
              defaultValue: 100,
            },
          },
          ino(block) {
            const number = this.valueToCode(block, 'NUMBER', this.ORDER_NONE);
            this.definitions_[`setup_segment`] = 'init_segment();';
            const code = `set_segment_number(${number});\n`;
            return code;
          },
        },
        {
          id: 'segmentTime',
          text: (
            <Text
              id="blocks.wirelesscodingkit.segmentTime"
              defaultMessage="4-digit 7-segment display time [HH]:[MM]"
            />
          ),
          inputs: {
            HH: {
              type: 'number',
              defaultValue: 0,
            },
            MM: {
              type: 'number',
              defaultValue: 0,
            },
          },
          ino(block) {
            const hour = this.valueToCode(block, 'HH', this.ORDER_NONE);
            const minute = this.valueToCode(block, 'MM', this.ORDER_NONE);
            this.definitions_[`setup_segment`] = 'init_segment();';
            const code = `set_segment_time(${hour}, ${minute});\n`;
            return code;
          },
        },
        // {
        //   id: 'segmentDigit',
        //   text: (
        //     <Text
        //       id="blocks.wirelesscodingkit.segmentDigit"
        //       defaultMessage="set 4-digit 7-segment display digit [DIGIT] at [POS]"
        //     />
        //   ),
        //   inputs: {
        //     DIGIT: {
        //       type: 'integer',
        //       defaultValue: 0,
        //     },
        //     POS: {
        //       inputMode: true,
        //       type: 'integer',
        //       defaultValue: '1',
        //       menu: ['1', '2', '3', '4'],
        //     },
        //   },
        //   ino(block) {
        //     let digit = this.valueToCode(block, 'DIGIT', this.ORDER_NONE);
        //     let pos = parseInt(block.getFieldValue('POS') || '1');
        //     digit = Math.min(Math.max(0, digit), 9);
        //     pos = Math.min(Math.max(1, pos), 4) - 1;
        //     this.definitions_[`setup_segment`] = 'init_segment();';
        //     const code = `set_segment_digit(${pos}, ${digit});\n`;
        //     return code;
        //   },
        // },
        {
          id: 'segmentColon',
          text: (
            <Text
              id="blocks.wirelesscodingkit.segmentColon"
              defaultMessage="set 4-digit 7-segment display colon [STATE]"
            />
          ),
          inputs: {
            STATE: {
              menu: 'stateOnOff',
            },
          },
          ino(block) {
            const state = this.valueToCode(block, 'STATE', this.ORDER_NONE) || 0;
            this.definitions_[`setup_segment`] = 'init_segment();';
            const code = `set_segment_colon(${state});\n`;
            return code;
          },
        },
        {
          id: 'segmentClear',
          text: (
            <Text
              id="blocks.wirelesscodingkit.segmentClear"
              defaultMessage="clear 4-digit 7-segment display"
            />
          ),
          ino(block) {
            return 'clear_segment();\n';
          },
        },
      ],
      [
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.button"
              defaultMessage="Button"
            />
          ),
        },
        {
          id: 'buttonPressed',
          text: (
            <Text
              id="blocks.wirelesscodingkit.buttonPressed"
              defaultMessage="[PORT] button is pressed?"
            />
          ),
          output: 'boolean',
          inputs: {
            PORT: portsOutMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P1');
            const code = `wirelesskit.is_keypressed(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P1';
            this.definitions_[`setup_key_${port}`] = `init_key(${port});`;
            const code = `is_keypressed(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
        },
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.sound"
              defaultMessage="Sound"
            />
          ),
        },
        {
          id: 'sound',
          text: (
            <Text
              id="blocks.wirelesscodingkit.sound"
              defaultMessage="[PORT] is sound?"
            />
          ),
          output: 'boolean',
          inputs: {
            PORT: portsSoundMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P11');
            const code = `wirelesskit.is_sound(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P1';
            this.definitions_[`setup_sound_${port}`] = `init_sound(${port});`;
            const code = `is_sound(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
        },
        {
          id: 'soundValue',
          text: (
            <Text
              id="blocks.wirelesscodingkit.soundValue"
              defaultMessage="[PORT] sound value"
            />
          ),
          output: 'number',
          inputs: {
            PORT: portsSoundMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P11');
            const code = `wirelesskit.get_sound(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P1';
            this.definitions_[`setup_sound_${port}`] = `init_sound(${port});`;
            const code = `get_sound(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
        },
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.rotaryPotentiometer"
              defaultMessage="Rotary Potentiometer"
            />
          ),
        },
        {
          id: 'rotaryValue',
          text: (
            <Text
              id="blocks.wirelesscodingkit.rotaryPotentiometer"
              defaultMessage="[PORT] rotary potentiometer value"
            />
          ),
          output: 'number',
          inputs: {
            PORT: portsADCMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P3');
            const code = `wirelesskit.get_potentiometer(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P3';
            this.definitions_[`setup_potentiometer_${port}`] = `init_potentiometer(${port});`;
            const code = `get_potentiometer(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
        },
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.photosensitive"
              defaultMessage="Photosensitive"
            />
          ),
        },
        {
          id: 'photosensitiveValue',
          text: (
            <Text
              id="blocks.wirelesscodingkit.photosensitive"
              defaultMessage="[PORT] photosensitive value"
            />
          ),
          output: 'number',
          inputs: {
            PORT: portsADCMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P3');
            const code = `wirelesskit.get_photosensitive(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P3';
            this.definitions_[`setup_photosensitive_${port}`] = `init_photosensitive(${port});`;
            const code = `get_photosensitive(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
        },
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.ultrasonicDistance"
              defaultMessage="Ultrasonic Distance"
            />
          ),
        },
        {
          id: 'distanceValue',
          text: (
            <Text
              id="blocks.wirelesscodingkit.distance"
              defaultMessage="[PORT] distance(cm)"
            />
          ),
          output: 'number',
          inputs: {
            PORT: portsOutMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P1');
            const code = `wirelesskit.get_distance(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P3';
            const code = `get_distance(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
        },
        '---',
        {
          label: (
            <Text
              id="blocks.wirelesscodingkit.label.temperatureHumidity"
              defaultMessage="Temperature & Humidity"
            />
          ),
        },
        {
          id: 'temperatureValue',
          text: (
            <Text
              id="blocks.wirelesscodingkit.temperature"
              defaultMessage="[PORT] temperature(℃)"
            />
          ),
          output: 'number',
          inputs: {
            PORT: portsInMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P1');
            const code = `wirelesskit.get_temperature(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P3';
            const code = `get_temperature(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
        },
        {
          id: 'humidityValue',
          text: (
            <Text
              id="blocks.wirelesscodingkit.humidity"
              defaultMessage="[PORT] humidity(%)"
            />
          ),
          output: 'number',
          inputs: {
            PORT: portsInMenu,
          },
          mpy(block) {
            const port = this.quote_(block.getFieldValue('PORT') || 'P1');
            const code = `wirelesskit.get_humidity(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
          ino(block) {
            const port = block.getFieldValue('PORT') || 'P3';
            const code = `get_humidity(${port})`;
            return [code, this.ORDER_FUNCTION_CALL];
          },
        },
      ],
    )
    .filter(Boolean);
};

export const menus = {
  portsIn: {
    type: 'string',
    items: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16'],
  },
  portsOut: {
    type: 'string',
    items: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15', 'P16'],
  },
  ports4: {
    type: 'string',
    items: ['P5', 'P6', 'P7', 'P8', 'P13', 'P14', 'P15', 'P16'],
  },
  ports5: {
    type: 'string',
    items: ['P13', 'P14', 'P15', 'P16'],
  },
  portsADC: {
    type: 'string',
    items: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'],
  },
  portsIn_ESP32: {
    type: 'string',
    items: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15'],
  },
  portsOut_ESP32: {
    type: 'string',
    items: ['P1', 'P2', 'P7', 'P8', 'P9', 'P10', 'P13', 'P14', 'P15'],
  },
  ports4_ESP32: {
    type: 'string',
    items: ['P9', 'P10', 'P11', 'P12', 'P13', 'P14', 'P15'],
  },
  ports5_ESP32: {
    type: 'string',
    items: ['P13', 'P14', 'P15'],
  },
  portsADC_ESP32: {
    type: 'string',
    items: ['P3', 'P4', 'P5', 'P6'],
  },
  stateOnOff: {
    inputMode: true,
    defaultValue: '1',
    type: 'number',
    items: [
      [
        <Text
          id="blocks.wirelesscodingkit.statuOn"
          defaultMessage="on"
        />,
        '1',
      ],
      [
        <Text
          id="blocks.wirelesscodingkit.statuOff"
          defaultMessage="off"
        />,
        '0',
      ],
    ],
  },
};
