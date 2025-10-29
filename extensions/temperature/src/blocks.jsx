import { Text } from '@blockcode/core';

const isUno = (meta) => ['ArduinoUno', 'BLEUNO'].includes(meta.boardType);
const isNano = (meta) => ['ArduinoNano', 'BLENANO'].includes(meta.boardType);
const isESP32 = (meta) => ['ESP32', 'ESP32_IOT_BOARD'].includes(meta.boardType);
const isESP32S3 = (meta) => ['ESP32S3'].includes(meta.boardType);
const pinMenu = (meta) => {
  if (isUno(meta)) return 'unoAdc';
  if (isNano(meta)) return 'nanoAdc';
  if (isESP32(meta)) return 'esp32Adc';
  if (isESP32S3(meta)) return 'esp32s3Adc';
};

export const blocks = (meta) => [
  {
    id: 'lm35',
    text: (
      <Text
        id="blocks.temperature.lm35"
        defaultMessage="pin [PIN] LM35 temperature"
      />
    ),
    output: 'number',
    inputs: {
      PIN: {
        menu: pinMenu(meta),
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `(analogRead(${pin}) * 500.0 / 1023.0)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = block.getFieldValue('PIN');
      const pinName = `_lm${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_adc'] = 'from machine import ADC';
      this.definitions_[pinName] = `${pinName} = ADC(Pin(${pin}), atten=ADC.ATTN_11DB)`;
      const code = `(${pinName}.read_uv() / 10_000)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'nl50',
    text: (
      <Text
        id="blocks.temperature.nl50"
        defaultMessage="pin [PIN] NL50 temperature"
      />
    ),
    output: 'number',
    inputs: {
      PIN: {
        menu: pinMenu(meta),
      },
    },
    ino(block) {
      const pin = block.getFieldValue('PIN');
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `(analogRead(${pin}) * 500.0 / 1023.0 - 50.0)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = block.getFieldValue('PIN');
      const pinName = `_nl${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_adc'] = 'from machine import ADC';
      this.definitions_[pinName] = `${pinName} = ADC(Pin(${pin}), atten=ADC.ATTN_11DB)`;
      const code = `(${pinName}.read_uv() / 10_000 - 50)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'ds8b20',
    text: (
      <Text
        id="blocks.temperature.ds8b20"
        defaultMessage="pin [PIN] DS8B20 temperature"
      />
    ),
    output: 'number',
    inputs: {
      PIN: {
        type: 'integer',
        defaultValue: '1',
      },
    },
    ino(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const oneWireName = `_ow${pin}`;
      const pinName = `_ds${pin}`;
      this.definitions_['include_onewire'] = '#include <OneWire.h>';
      this.definitions_['include_dallastemperature'] = '#include <DallasTemperature.h>';
      this.definitions_[`variable_${oneWireName}`] = `OneWire ${oneWireName}(${pin});`;
      this.definitions_[`variable_${pinName}`] = `DallasTemperature ${pinName}(&${oneWireName});`;
      this.definitions_[`setup_${pinName}`] = `${pinName}.begin();`;

      let temCode = '';
      temCode += 'float getTempC(DallasTemperature dt) {\n';
      temCode += '  dt.requestTemperatures();\n';
      temCode += `  return dt.getTempCByIndex(0);\n`;
      temCode += `}\n`;
      this.definitions_[`declare_getTempC`] = `float getTempC(DallasTemperature dt);`;
      this.definitions_[`getTempC`] = temCode;

      const code = `getTempC(${pinName})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `_ds${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_onewire'] = 'from onewire import OneWire';
      this.definitions_['import_ds18x20'] = 'from ds18x20 import DS18X20';
      this.definitions_[pinName] = `${pinName} = DS18X20(OneWire(Pin(${pin})))`;

      let temCode = '';
      temCode += 'def get_tempc(ds):\n';
      temCode += '  ds.convert_temp()\n';
      temCode += '  roms = ds.scan()\n';
      temCode += `  return ds.read_temp(roms[0]) if len(roms) and roms[0] else 0\n`;
      this.definitions_[`get_tempc`] = temCode;

      const code = `get_tempc(${pinName})`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
];

export const menus = {
  unoAdc: {
    items: [
      ['A0', 'A0'],
      ['A1', 'A1'],
      ['A2', 'A2'],
      ['A3', 'A3'],
      ['A4', 'A4'],
      ['A5', 'A5'],
    ],
  },
  nanoAdc: {
    items: [
      ['A0', 'A0'],
      ['A1', 'A1'],
      ['A2', 'A2'],
      ['A3', 'A3'],
      ['A4', 'A4'],
      ['A5', 'A5'],
      ['A6', 'A6'],
      ['A7', 'A7'],
    ],
  },
  esp32Adc: {
    items: [
      ['0', '0'],
      ['2', '2'],
      ['4', '4'],
      ['12', '12'],
      ['13', '13'],
      ['14', '14'],
      ['15', '15'],
      ['25', '25'],
      ['26', '26'],
      ['27', '27'],
      ['32', '32'],
      ['33', '33'],
      ['34', '34'],
      ['35', '35'],
      ['36', '36'],
      ['37', '37'],
      ['38', '38'],
      ['39', '39'],
    ],
  },
  esp32s3Adc: {
    items: [
      ['1', '1'],
      ['2', '2'],
      ['3', '3'],
      ['4', '4'],
      ['5', '5'],
      ['6', '6'],
      ['7', '7'],
      ['8', '8'],
      ['9', '9'],
      ['10', '10'],
      ['11', '11'],
      ['12', '12'],
      ['13', '13'],
      ['14', '14'],
      ['15', '15'],
      ['16', '16'],
      ['17', '17'],
      ['18', '18'],
      ['19', '19'],
      ['20', '20'],
    ],
  },
};
