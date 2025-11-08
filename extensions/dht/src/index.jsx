import { addLocalesMessages, Text } from '@blockcode/core';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.dht.name"
      defaultMessage="DHT"
    />
  ),
  blocks: [
    {
      id: 'temperature11',
      text: (
        <Text
          id="blocks.dht.temperature11"
          defaultMessage="pin [PIN] DHT11 temperature"
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
        this.definitions_[`include_dht`] = '#include "dht.h"';
        this.definitions_[`variable_dht`] = `dht _dht;`;

        let temCode = '';
        temCode += 'int getTemperature(int pin, bool dht22) {\n';
        temCode += '  dht22 ? _dht.read22(pin) : _dht.read11(pin);\n';
        temCode += '  return _dht.temperature;\n';
        temCode += '}';
        this.definitions_[`declare_getTemperature`] = `int getTemperature(int pin, bool dht22 = false);`;
        this.definitions_[`getTemperature`] = temCode;

        const code = `getTemperature(${pin})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const pinName = `pin_${pin}`;
        this.definitions_['import_pin'] = 'from machine import Pin';
        this.definitions_['import_dht11'] = 'from dht import DHT11';
        this.definitions_[pinName] = `${pinName} = DHT11(Pin(${pin}))`;

        let temCode = '';
        temCode += 'def get_temperature(dht):\n';
        temCode += '  dht.measure()\n';
        temCode += '  return dht.temperature()\n';
        this.definitions_['def_get_temperature'] = temCode;

        const code = `get_temperature(${pinName})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'humidity11',
      text: (
        <Text
          id="blocks.dht.humidity11"
          defaultMessage="pin [PIN] DHT11 humidity"
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
        this.definitions_[`include_dht`] = '#include "dht.h"';
        this.definitions_[`variable_dht`] = `dht _dht;`;

        let humCode = '';
        humCode += 'int getHumidity(int pin, bool dht22) {\n';
        humCode += '  dht22 ? _dht.read22(pin) : _dht.read11(pin);\n';
        humCode += '  return _dht.humidity;\n';
        humCode += '}';
        this.definitions_[`declare_getHumidity`] = `int getHumidity(int pin, bool dht22 = false);`;
        this.definitions_[`getHumidity`] = humCode;

        const code = `getHumidity(${pin})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const pinName = `pin_${pin}`;
        this.definitions_['import_pin'] = 'from machine import Pin';
        this.definitions_['import_dht11'] = 'from dht import DHT11';
        this.definitions_[pinName] = `${pinName} = DHT11(Pin(${pin}))`;

        let humCode = '';
        humCode += 'def get_humidity(dht):\n';
        humCode += '  dht.measure()\n';
        humCode += '  return dht.humidity()\n';
        this.definitions_['def_get_humidity'] = humCode;

        const code = `get_humidity(${pinName})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      id: 'temperature22',
      text: (
        <Text
          id="blocks.dht.temperature22"
          defaultMessage="pin [PIN] DHT22 temperature"
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
        this.definitions_[`include_dht`] = '#include "dht.h"';
        this.definitions_[`variable_dht`] = `dht _dht;`;

        let temCode = '';
        temCode += 'int getTemperature(int pin, bool dht22) {\n';
        temCode += '  dht22 ? _dht.read22(pin) : _dht.read11(pin);\n';
        temCode += '  return _dht.temperature;\n';
        temCode += '}';
        this.definitions_[`declare_getTemperature`] = `int getTemperature(int pin, bool dht22 = false);`;
        this.definitions_[`getTemperature`] = temCode;

        const code = `getTemperature(${pin}, true)`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const pinName = `pin_${pin}`;
        this.definitions_['import_pin'] = 'from machine import Pin';
        this.definitions_['import_dht22'] = 'from dht import DHT22';
        this.definitions_[pinName] = `${pinName} = DHT22(Pin(${pin}))`;

        let temCode = '';
        temCode += 'def get_temperature(dht):\n';
        temCode += '  dht.measure()\n';
        temCode += '  return dht.temperature()\n';
        this.definitions_['def_get_temperature'] = temCode;

        const code = `get_temperature(${pinName})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'humidity22',
      text: (
        <Text
          id="blocks.dht.humidity22"
          defaultMessage="pin [PIN] DHT22 humidity"
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
        this.definitions_[`include_dht`] = '#include "dht.h"';
        this.definitions_[`variable_dht`] = `dht _dht;`;

        let humCode = '';
        humCode += 'int getHumidity(int pin, bool dht22) {\n';
        humCode += '  dht22 ? _dht.read22(pin) : _dht.read11(pin);\n';
        humCode += '  return _dht.humidity;\n';
        humCode += '}';
        this.definitions_[`declare_getHumidity`] = `int getHumidity(int pin, bool dht22 = false);`;
        this.definitions_[`getHumidity`] = humCode;

        const code = `getHumidity(${pin}, true)`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const pin = this.valueToCode(block, 'PIN', this.ORDER_NONE);
        const pinName = `pin_${pin}`;
        this.definitions_['import_pin'] = 'from machine import Pin';
        this.definitions_['import_dht22'] = 'from dht import DHT22';
        this.definitions_[pinName] = `${pinName} = DHT22(Pin(${pin}))`;

        let humCode = '';
        humCode += 'def get_humidity(dht):\n';
        humCode += '  dht.measure()\n';
        humCode += '  return dht.humidity()\n';
        this.definitions_['def_get_humidity'] = humCode;

        const code = `get_humidity(${pinName})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
};
