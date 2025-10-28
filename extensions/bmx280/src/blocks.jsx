import { Text } from '@blockcode/core';

const notArduino = (meta) => meta.editor !== '@blockcode/gui-arduino';

export const blocks = (meta) =>
  [
    notArduino(meta) && {
      id: 'init',
      text: (
        <Text
          id="blocks.bmx280.init"
          defaultMessage="set pin SCL[SCL] pin SDA[SDA]"
        />
      ),
      inputs: {
        SCL: {
          type: 'integer',
          defaultValue: '2',
        },
        SDA: {
          type: 'integer',
          defaultValue: '3',
        },
      },
      mpy(block) {
        const scl = this.valueToCode(block, 'SCL', this.ORDER_NONE);
        const sda = this.valueToCode(block, 'SDA', this.ORDER_NONE);
        if (this.definitions_['bmx280_addr']) {
          const addr = this.definitions_['bmx280_addr'].replace('# BMx280 addr: ', '');
          this.definitions_['bmx280'] = `_bmx280 = bmx280.BMx280(${scl}, ${sda}, ${addr})`;
        } else {
          this.definitions_['bmx280'] = `_bmx280 = bmx280.BMx280(${scl}, ${sda})`;
        }

        let bmxCode = '';
        bmxCode += 'def get_bmx280_value(mode=2):\n';
        bmxCode += '  _bmx280.read()\n';
        bmxCode += '  if mode == 1: return _bmx280.temperature\n';
        bmxCode += '  if mode == 2: return _bmx280.pressure\n';
        bmxCode += '  if mode == 3: return _bmx280.humidity\n';
        bmxCode += '  if mode == 4: return _bmx280.altitude\n';
        this.definitions_[`get_bmx280_value`] = bmxCode;

        return '';
      },
    },
    {
      id: 'addr',
      text: (
        <Text
          id="blocks.bmx280.addr"
          defaultMessage="set I2C address [ADDR]"
        />
      ),
      inputs: {
        ADDR: {
          type: 'integer',
          defaultValue: '118',
          menu: [
            ['0×76', '118'],
            ['0×77', '119'],
          ],
        },
      },
      ino(block) {
        const addr = block.getFieldValue('ADDR');
        this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
        this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
        this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C(${addr});`;
        return '';
      },
      mpy(block) {
        const addr = block.getFieldValue('ADDR');
        this.definitions_['bmx280_addr'] = `# BMx280 addr: ${addr}`;

        let bmxCode = '';
        bmxCode += 'def get_bmx280_value(mode=2):\n';
        bmxCode += '  _bmx280.read()\n';
        bmxCode += '  if mode == 1: return _bmx280.temperature\n';
        bmxCode += '  if mode == 2: return _bmx280.pressure\n';
        bmxCode += '  if mode == 3: return _bmx280.humidity\n';
        bmxCode += '  if mode == 4: return _bmx280.altitude\n';
        this.definitions_[`get_bmx280_value`] = bmxCode;

        return '';
      },
    },
    '---',
    {
      id: 'pressure',
      text: (
        <Text
          id="blocks.bmx280.pressure"
          defaultMessage="pressure atmosphere"
        />
      ),
      output: 'number',
      ino(block) {
        this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
        this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
        if (!this.definitions_[`setup_bmx280`]) {
          this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C();`;
        }

        let bmxCode = '';
        bmxCode += 'float getBMx280Value(int mode) {\n';
        bmxCode += '  float T, P_hPa, H;\n';
        bmxCode += '  _bmx280.read280(T, P_hPa, H);\n';
        bmxCode += '  return mode == 1 ? T : (mode == 2 ? P_hPa : (mode == 3 && _bmx280.hasHumidity() ? H : 0.0));\n';
        bmxCode += '}';
        this.definitions_[`declare_getBMx280Value`] = `float getBMx280Value(int mode = 2);`;
        this.definitions_[`getBMx280Value`] = bmxCode;

        return ['getBMx280Value()', this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        return ['get_bmx280_value()', this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'altitude',
      text: (
        <Text
          id="blocks.bmx280.altitude"
          defaultMessage="altitude"
        />
      ),
      output: 'number',
      ino(block) {
        this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
        this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
        if (!this.definitions_[`setup_bmx280`]) {
          this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C();`;
        }
        return ['_bmx280.readAltitude()', this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        this.definitions_[`get_bmx280_value`] = bmxCode;
        return ['get_bmx280_value(4)', this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'temperature',
      text: (
        <Text
          id="blocks.bmx280.temperature"
          defaultMessage="temperature"
        />
      ),
      output: 'number',
      ino(block) {
        this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
        this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
        if (!this.definitions_[`setup_bmx280`]) {
          this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C();`;
        }

        let bmxCode = '';
        bmxCode += 'float getBMx280Value(int mode) {\n';
        bmxCode += '  float T, P_hPa, H;\n';
        bmxCode += '  _bmx280.read280(T, P_hPa, H);\n';
        bmxCode += '  return mode == 1 ? T : (mode == 2 ? P_hPa : (mode == 3 && _bmx280.hasHumidity() ? H : 0.0));\n';
        bmxCode += '}';
        this.definitions_[`declare_getBMx280Value`] = `float getBMx280Value(int mode = 2);`;
        this.definitions_[`getBMx280Value`] = bmxCode;

        return ['getBMx280Value(1)', this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        return ['get_bmx280_value(1)', this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'humidity',
      text: (
        <Text
          id="blocks.bmx280.humidity"
          defaultMessage="humidity"
        />
      ),
      output: 'number',
      ino(block) {
        this.definitions_[`include_bmx280`] = '#include <BMx280.h>';
        this.definitions_[`variable_bmx280`] = `BMx280 _bmx280;`;
        if (!this.definitions_[`setup_bmx280`]) {
          this.definitions_[`setup_bmx280`] = `_bmx280.beginI2C();`;
        }

        let bmxCode = '';
        bmxCode += 'float getBMx280Value(int mode) {\n';
        bmxCode += '  float T, P_hPa, H;\n';
        bmxCode += '  _bmx280.read280(T, P_hPa, H);\n';
        bmxCode += '  return mode == 1 ? T : (mode == 2 ? P_hPa : (mode == 3 && _bmx280.hasHumidity() ? H : 0.0));\n';
        bmxCode += '}';
        this.definitions_[`declare_getBMx280Value`] = `float getBMx280Value(int mode = 2);`;
        this.definitions_[`getBMx280Value`] = bmxCode;

        return ['getBMx280Value(3)', this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        return ['get_bmx280_value(3)', this.ORDER_FUNCTION_CALL];
      },
    },
  ].filter(Boolean);
