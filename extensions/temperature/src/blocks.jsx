import { Text } from '@blockcode/core';

const isIotBit = (meta) => meta.editor === '@blockcode/gui-iotbit';

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
      PIN: meta.boardPins
        ? { menu: meta.boardPins.adc }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `(analogRead(${pin}) * 500.0 / 1023.0)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `_lm${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_adc'] = 'from machine import ADC';
      this.definitions_[pinName] = `${pinName} = ADC(Pin(${pin}), atten=ADC.ATTN_6DB)`;
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
      PIN: meta.boardPins
        ? { menu: meta.boardPins.adc }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_[`setup_pin_${pin}`] = `pinMode(${pin}, INPUT);`;
      const code = `(analogRead(${pin}) * 500.0 / 1023.0 - 50.0)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
    mpy(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      const pinName = `_nl${pin}`;
      this.definitions_['import_pin'] = 'from machine import Pin';
      this.definitions_['import_adc'] = 'from machine import ADC';
      this.definitions_[pinName] = `${pinName} = ADC(Pin(${pin}), atten=ADC.ATTN_6DB)`;
      const code = `(${pinName}.read_uv() / 10_000 - 50)`;
      return [code, this.ORDER_FUNCTION_CALL];
    },
  },
  {
    id: 'ds8b20',
    text: (
      <Text
        id="blocks.temperature.ds8b20"
        defaultMessage="pin [PIN] DS18B20 temperature"
      />
    ),
    output: 'number',
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 1,
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
      const pin = isIotBit(meta) ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
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
