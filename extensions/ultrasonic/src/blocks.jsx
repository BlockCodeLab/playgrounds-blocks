import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'read4pins',
    text: (
      <Text
        id="blocks.ultrasonic.read4pins"
        defaultMessage="pins ECHO:[ECHO] TRIG:[TRIG] distance(cm)"
      />
    ),
    output: 'number',
    inputs: {
      ECHO: meta.boardPins
        ? { menu: meta.boardPins.in }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      TRIG: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    ino(block) {
      const echo = meta.boardPins ? block.getFieldValue('ECHO') : this.valueToCode(block, 'ECHO', this.ORDER_NONE);
      const trig = meta.boardPins ? block.getFieldValue('TRIG') : this.valueToCode(block, 'TRIG', this.ORDER_NONE);
      const ultrasonic = `ultrasonic_${echo}_${trig}`;
      this.definitions_['include_ultrasonic'] = '#include <EasyUltrasonic.h>';
      this.definitions_[`variable_${ultrasonic}`] = `EasyUltrasonic ${ultrasonic};`;
      this.definitions_[`setup_${ultrasonic}`] = `${ultrasonic}.attach(${trig}, ${echo});`;
      let code = '';
      if (this.definitions_['loop_ultrasonic_compensation']) {
        const compensation = this.definitions_['loop_ultrasonic_compensation'];
        const [temp, hum] = compensation.replace('// ULTRASONIC_COMPENSATION:', '').split(',');
        code = `${ultrasonic}.getPreciseDistanceCM(${temp.trim()}, ${hum.trim()})`;
      } else {
        code = `${ultrasonic}.getDistanceCM()`;
      }
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'read3pins',
    text: (
      <Text
        id="blocks.ultrasonic.read3pins"
        defaultMessage="pin [PIN] distance(cm)"
      />
    ),
    output: 'number',
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.all }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const ultrasonic = `ultrasonic_${pin}`;
      this.definitions_['include_ultrasonic'] = '#include <EasyUltrasonic.h>';
      this.definitions_[`variable_${ultrasonic}`] = `EasyUltrasonic ${ultrasonic};`;
      this.definitions_[`setup_${ultrasonic}`] = `${ultrasonic}.attach(${pin}, ${pin});`;
      let code = '';
      if (this.definitions_['loop_ultrasonic_compensation']) {
        const compensation = this.definitions_['loop_ultrasonic_compensation'];
        const [temp, hum] = compensation.replace('// ULTRASONIC_COMPENSATION:', '').split(',');
        code = `${ultrasonic}.getPreciseDistanceCM(${temp.trim()}, ${hum.trim()})`;
      } else {
        code = `${ultrasonic}.getDistanceCM()`;
      }
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  '---',
  {
    id: 'compensation',
    text: (
      <Text
        id="blocks.ultrasonic.compensation"
        defaultMessage="set temperature(℃) [TEMP] and humidity(%) [HUM] compensation"
      />
    ),
    inputs: {
      TEMP: {
        type: 'integer',
        defaultValue: '25',
      },
      HUM: {
        type: 'positive_integer',
        defaultValue: '40',
      },
    },
    ino(block) {
      const temp = this.valueToCode(block, 'TEMP', this.ORDER_NONE);
      const hum = this.valueToCode(block, 'HUM', this.ORDER_NONE);
      this.definitions_['loop_ultrasonic_compensation'] = `// ULTRASONIC_COMPENSATION: ${temp}, ${hum}`;
      return '';
    },
  },
];
