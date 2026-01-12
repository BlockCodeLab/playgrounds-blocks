import { Text } from '@blockcode/core';

const DefineGetUltrasonicDistance =
  'float getUltrasonicDistance(EasyUltrasonic *ultra, bool inches = false, float temp = 0.0, float hum = -1.0);';
const GetUltrasonicDistance = `float getUltrasonicDistance(EasyUltrasonic *ultra, bool inches, float temp, float hum) {
  delay(5);
  if (hum < 0) return inches ? ultra->getDistanceIN() : ultra->getDistanceCM();
  return inches ? ultra->getPreciseDistanceIN(temp, hum) : ultra->getPreciseDistanceCM(temp, hum);
}`;

export const blocks = (meta) => [
  {
    id: 'read4pins',
    text: (
      <Text
        id="blocks.ultrasonic.read4pins"
        defaultMessage="pins ECHO:[ECHO] TRIG:[TRIG] distance [UNIT]"
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
      UNIT: { menu: 'Unit' },
    },
    ino(block) {
      const echo = meta.boardPins ? block.getFieldValue('ECHO') : this.valueToCode(block, 'ECHO', this.ORDER_NONE);
      const trig = meta.boardPins ? block.getFieldValue('TRIG') : this.valueToCode(block, 'TRIG', this.ORDER_NONE);
      const unit = block.getFieldValue('UNIT');
      const ultrasonic = `ultrasonic_${echo}_${trig}`;
      this.definitions_['include_ultrasonic'] = '#include <EasyUltrasonic.h>';
      this.definitions_[`variable_${ultrasonic}`] = `EasyUltrasonic ${ultrasonic};`;
      this.definitions_[`setup_${ultrasonic}`] = `${ultrasonic}.attach(${trig}, ${echo});`;
      this.definitions_['declare_getUltrasonicDistance'] = DefineGetUltrasonicDistance;
      this.definitions_['getUltrasonicDistance'] = GetUltrasonicDistance;
      let code = '';
      if (this.definitions_['loop_ultrasonic_compensation']) {
        const compensation = this.definitions_['loop_ultrasonic_compensation'];
        const [temp, hum] = compensation.replace('// ULTRASONIC_COMPENSATION:', '').split(',');
        code = `getUltrasonicDistance(&${ultrasonic}, ${unit}, ${temp.trim()}, ${hum.trim()})`;
      } else {
        code = `getUltrasonicDistance(&${ultrasonic}, ${unit})`;
      }
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'read3pins',
    text: (
      <Text
        id="blocks.ultrasonic.read3pins"
        defaultMessage="pin [PIN] distance [UNIT]"
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
      UNIT: { menu: 'Unit' },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const unit = block.getFieldValue('UNIT');
      const ultrasonic = `ultrasonic_${pin}`;
      this.definitions_['include_ultrasonic'] = '#include <EasyUltrasonic.h>';
      this.definitions_[`variable_${ultrasonic}`] = `EasyUltrasonic ${ultrasonic};`;
      this.definitions_[`setup_${ultrasonic}`] = `${ultrasonic}.attach(${pin}, ${pin});`;
      this.definitions_['declare_getUltrasonicDistance'] = DefineGetUltrasonicDistance;
      this.definitions_['getUltrasonicDistance'] = GetUltrasonicDistance;
      let code = '';
      if (this.definitions_['loop_ultrasonic_compensation']) {
        const compensation = this.definitions_['loop_ultrasonic_compensation'];
        const [temp, hum] = compensation.replace('// ULTRASONIC_COMPENSATION:', '').split(',');
        code = `getUltrasonicDistance(&${ultrasonic}, ${unit}, ${temp.trim()}, ${hum.trim()})`;
      } else {
        code = `getUltrasonicDistance(&${ultrasonic}, ${unit})`;
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

export const menus = {
  Unit: {
    items: [
      [
        <Text
          id="blocks.ultrasonic.unitCm"
          defaultMessage="cm"
        />,
        'false',
      ],
      [
        <Text
          id="blocks.ultrasonic.unitIn"
          defaultMessage="inches"
        />,
        'true',
      ],
    ],
  },
};
