import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.rfcom.init"
        defaultMessage="set pins CE:[CE] CSN:[CSN]"
      />
    ),
    inputs: {
      CE: meta.boardPins
        ? { menu: meta.boardPins.all }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      CSN: meta.boardPins
        ? { menu: meta.boardPins.all }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    ino(block) {
      const ce = meta.boardPins ? block.getFieldValue('CE') : this.valueToCode(block, 'CE', this.ORDER_NONE);
      const csn = meta.boardPins ? block.getFieldValue('CSN') : this.valueToCode(block, 'CSN', this.ORDER_NONE);
      this.definitions_['include_rfcom'] = '#include <RF24.h>';
      this.definitions_['variable_rfcom'] = `RF24 rfcom(${ce}, ${csn});`;
      this.definitions_['setup_rfcom1'] = 'rfcom.begin();';
      this.definitions_['setup_rfcom2'] = 'rfcom.setAddressWidth(4);';
      this.definitions_['setup_rfcom_chan'] = 'rfcom.setChannel(115);';
      this.definitions_['setup_rfcom_pa'] = 'rfcom.setPALevel(RF24_PA_MAX);';
      this.definitions_['setup_rfcom3'] = 'rfcom.setDataRate(RF24_1MBPS);';
      return '';
    },
  },
  {
    id: 'send',
    text: (
      <Text
        id="blocks.rfcom.send"
        defaultMessage="send data [DATA] to address [ADDR]"
      />
    ),
    inputs: {
      ADDR: {
        type: 'hex32',
        defaultValue: '10101010',
      },
      DATA: {
        type: 'string',
        defaultValue: 'hi',
      },
    },
    ino(block) {
      const addr = this.valueToCode(block, 'ADDR', this.ORDER_NONE);
      const data = this.valueToCode(block, 'DATA', this.ORDER_NONE);

      const funcName = 'rfcomSendData';
      let code = '';
      code = `void ${funcName}(int value) {\n`;
      code += '  rfcom.stopListening();\n';
      code += '  rfcom.write(&value, sizeof(value));\n';
      code += '  rfcom.startListening();\n';
      code += '}';
      this.definitions_[`${funcName}_1`] = code;
      this.definitions_[`declare_${funcName}_1`] = `void ${funcName}(int value);`;

      code = `void ${funcName}(float value) {\n`;
      code += '  rfcom.stopListening();\n';
      code += '  rfcom.write(&value, sizeof(value));\n';
      code += '  rfcom.startListening();\n';
      code += '}';
      this.definitions_[`${funcName}_2`] = code;
      this.definitions_[`declare_${funcName}_2`] = `void ${funcName}(float value);`;

      code = `void ${funcName}(String &value) {\n`;
      code += '  rfcom.stopListening();\n';
      code += '  rfcom.write(value.c_str(), value.length() + 1);\n';
      code += '  rfcom.startListening();\n';
      code += '}';
      this.definitions_[`${funcName}_3`] = code;
      this.definitions_[`declare_${funcName}_3`] = `void ${funcName}(String &value);`;

      code = `void ${funcName}(const char* value) {\n`;
      code += '  rfcom.stopListening();\n';
      code += '  rfcom.write(value, strlen(value) + 1);\n';
      code += '  rfcom.startListening();\n';
      code += '}';
      this.definitions_[`${funcName}_3`] = code;
      this.definitions_[`declare_${funcName}_3`] = `void ${funcName}(const char* str);`;

      code = `rfcom.openWritingPipe(${addr});\n`;
      code += `rfcomSendData(${data});\n`;
      return code;
    },
  },
  {
    id: 'listen',
    text: (
      <Text
        id="blocks.rfcom.listen"
        defaultMessage="listen to [ADDR] address"
      />
    ),
    inputs: {
      ADDR: {
        type: 'hex32',
        defaultValue: '10101010',
      },
    },
    ino(block) {
      const addr = this.valueToCode(block, 'ADDR', this.ORDER_NONE);
      const listenIndex = parseInt(this.createName('rf_listen').replace('rf_listen_', ''));
      let code = this.definitions_['setup_rfcom_listen'] ?? 'rfcom.startListening();';
      if (listenIndex <= 5) {
        code = code.replace(
          'rfcom.startListening();',
          `rfcom.openReadingPipe(${listenIndex}, ${addr});\n  rfcom.startListening();`,
        );
      }
      this.definitions_['setup_rfcom_listen'] = code;
      return '';
    },
  },
  {
    id: 'stop',
    text: (
      <Text
        id="blocks.rfcom.stop"
        defaultMessage="stop listening"
      />
    ),
    ino(block) {
      const code = 'rfcom.stopListening();\n';
      return code;
    },
  },
  '---',
  {
    id: 'channel',
    text: (
      <Text
        id="blocks.rfcom.channel"
        defaultMessage="set communication channel to [CHANNEL]"
      />
    ),
    inputs: {
      CHANNEL: {
        shadow: 'channel125',
      },
    },
    ino(block) {
      const chan = this.valueToCode(block, 'CHANNEL', this.ORDER_NONE);
      this.definitions_['setup_rfcom_chan'] = `rfcom.setChannel(${chan});`;
      return '';
    },
  },
  {
    // 0-125 滑块
    id: 'channel125',
    shadow: true,
    output: 'number',
    inputs: {
      CHANNEL: {
        type: 'slider',
        min: 0,
        max: 125,
        step: 1,
        defaultValue: 115,
      },
    },
    ino(block) {
      const value = block.getFieldValue('CHANNEL') || 0;
      return [value, this.ORDER_ATOMIC];
    },
  },
  {
    id: 'paLevel',
    text: (
      <Text
        id="blocks.rfcom.paLevel"
        defaultMessage="set power amplifier level to [LEVEL]"
      />
    ),
    inputs: {
      LEVEL: {
        defaultValue: 3,
        menu: [
          ['0', 'MIN'],
          ['1', 'LOW'],
          ['2', 'HIGH'],
          ['3', 'MAX'],
        ],
      },
    },
    ino(block) {
      const level = block.getFieldValue('LEVEL') || 3;
      this.definitions_['setup_rfcom_pa'] = `rfcom.setPALevel(RF24_PA_${level});`;
      return '';
    },
  },
  '---',
  {
    id: 'available',
    text: (
      <Text
        id="blocks.rfcom.available"
        defaultMessage="data available?"
      />
    ),
    output: 'boolean',
    ino(block) {
      const code = 'rfcom.available()';
      return [code];
    },
  },
  {
    id: 'availableLength',
    text: (
      <Text
        id="blocks.rfcom.availableLength"
        defaultMessage="available data length"
      />
    ),
    output: 'number',
    ino(block) {
      const code = 'rfcom.getPayloadSize()';
      return [code];
    },
  },
  '---',
  {
    id: 'readString',
    text: (
      <Text
        id="blocks.rfcom.readString"
        defaultMessage="read String"
      />
    ),
    output: 'string',
    ino(block) {
      const funcName = 'rfcomReadString';
      let code = '';
      code = `String ${funcName}() {\n`;
      code += '  if (!rfcom.available()) return "";\n';
      code += '  uint8_t len = rfcom.getPayloadSize();\n';
      code += '  uint8_t buffer[len];\n';
      code += '  rfcom.read(buffer, len);\n';
      code += '  return String((char*)buffer);\n';
      code += '}';
      this.definitions_[`${funcName}`] = code;
      this.definitions_[`declare_${funcName}`] = `String ${funcName}();`;

      code = `${funcName}()`;
      return [code];
    },
  },
  {
    id: 'readParse',
    text: (
      <Text
        id="blocks.rfcom.readParse"
        defaultMessage="read [TYPE]"
      />
    ),
    output: 'number',
    inputs: {
      TYPE: {
        menu: [
          [
            <Text
              id="blocks.rfcom.readParseInteger"
              defaultMessage="int"
            />,
            'int',
          ],
          [
            <Text
              id="blocks.rfcom.readParseFloat"
              defaultMessage="float"
            />,
            'float',
          ],
        ],
      },
    },
    ino(block) {
      const type = block.getFieldValue('TYPE');
      const funcName = `rfcomRead${type.replace(/^./, (m) => m.toUpperCase())}`;
      let code = '';
      code = `${type} ${funcName}() {\n`;
      code += `  if (!rfcom.available()) return ${type === 'int' ? 0 : 0.0};\n`;
      code += '  uint8_t len = rfcom.getPayloadSize();\n';
      code += '  uint8_t buffer[len];\n';
      code += '  rfcom.read(buffer, len);\n';
      code += `  ${type} value;\n`;
      code += '  memcpy(&value, buffer, sizeof(value));\n';
      code += '  return value;\n';
      code += '}';
      this.definitions_[`${funcName}`] = code;
      this.definitions_[`declare_${funcName}`] = `${type} ${funcName}();`;

      code = `${funcName}()`;
      return [code];
    },
  },
];
