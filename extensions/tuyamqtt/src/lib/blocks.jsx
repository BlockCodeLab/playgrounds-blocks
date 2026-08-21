import { Text } from '@blockcode/core';

export const blocks = [
  {
    id: 'connect',
    text: (
      <Text
        id="blocks.tuyamqtt.connect"
        defaultMessage="connect to Tuya MQTT [SERVER] DeviceID:[ID] DeviceSecret:[SECRET]"
      />
    ),
    inputs: {
      SERVER: {
        menu: [
          [
            <Text
              id="blocks.tuyamqtt.servers.china"
              defaultMessage="China Data Center"
            />,
            'm1.tuyacn.com',
          ],
          [
            <Text
              id="blocks.tuyamqtt.servers.centralEurope"
              defaultMessage="Central Europe Data Center"
            />,
            'm1.tuyaeu.com',
          ],
          [
            <Text
              id="blocks.tuyamqtt.servers.westernAmerica"
              defaultMessage="Western America Data Center"
            />,
            'm1.tuyaus.com',
          ],
          [
            <Text
              id="blocks.tuyamqtt.servers.easternAmerica"
              defaultMessage="Eastern America Data Center"
            />,
            'm1-ueaz.tuyaus.com',
          ],
          [
            <Text
              id="blocks.tuyamqtt.servers.westernEurope"
              defaultMessage="Western Europe Data Center"
            />,
            'm1-weaz.tuyaeu.com',
          ],
          [
            <Text
              id="blocks.tuyamqtt.servers.india"
              defaultMessage="India Data Center"
            />,
            'm1.tuyain.com',
          ],
          [
            <Text
              id="blocks.tuyamqtt.servers.singapore"
              defaultMessage="Singapore Data Center"
            />,
            'm1-sg.iotbing.com',
          ],
        ],
      },
      ID: {
        type: 'string',
        defaultValue: '',
      },
      SECRET: {
        type: 'string',
        defaultValue: '',
      },
    },
    mpy(_, args) {
      const code = `await tuyaclient.connect("${args.SERVER}", ${args.ID}, ${args.SECRET})\n`;
      return code;
    },
  },
  {
    id: 'close',
    text: (
      <Text
        id="blocks.tuyamqtt.close"
        defaultMessage="close connection"
      />
    ),
    mpy() {
      const code = `tuyaclient.close()\n`;
      return code;
    },
  },
  {
    id: 'isConnected',
    text: (
      <Text
        id="blocks.tuyamqtt.isConnected"
        defaultMessage="is connected?"
      />
    ),
    output: 'boolean',
    mpy() {
      const code = `tuyaclient.is_connected()`;
      return [code];
    },
  },
  '---',
  {
    id: 'reports',
    text: (
      <Text
        id="blocks.tuyamqtt.reports"
        defaultMessage="report property [PROP] value [VALUE] by [MODE]"
      />
    ),
    inputs: {
      PROP: {
        type: 'string',
        defaultValue: 'key',
      },
      VALUE: {
        type: 'string',
        defaultValue: 'value',
      },
      MODE: {
        menu: [
          [
            <Text
              id="blocks.tuyamqtt.reportMode.cache"
              defaultMessage="cache"
            />,
            'cache',
          ],
          [
            <Text
              id="blocks.tuyamqtt.reportMode.send"
              defaultMessage="send"
            />,
            'send',
          ],
        ],
        defaultValue: 'send',
      },
    },
    mpy(_, args) {
      const code = `tuyaclient.report(${args.PROP}, ${args.VALUE}, ${args.MODE === 'cache' ? 'True' : 'False'})\n`;
      return code;
    },
  },
  {
    id: 'whenReceived',
    text: (
      <Text
        id="blocks.tuyamqtt.whenReceived"
        defaultMessage="when received property values"
      />
    ),
    hat: true,
    mpy(block) {
      const flagName = this.createName('tuyamqtt_flag');
      this.definitions_[flagName] = `${flagName} = asyncio.ThreadSafeFlag()`;

      let branchCode = this.statementToCode(block) || '';
      let code = '';
      code += `tuyaclient.received(lambda: ${flagName}.set())\n`;
      code += 'while True:\n';
      code += `  await ${flagName}.wait()\n`;
      code += branchCode;

      branchCode = this.prefixLines(code, this.INDENT);
      branchCode = this.addEventTrap(branchCode, 'tuyamqtt_received');
      code = '@_tasks__.append\n';
      code += branchCode;
      this.definitions_[`${flagName}_callback`] = code;

      return '';
    },
  },
  {
    id: 'propertyIsValue',
    text: (
      <Text
        id="blocks.tuyamqtt.propertyIsValue"
        defaultMessage="received property [PROP] value?"
      />
    ),
    output: 'boolean',
    inputs: {
      PROP: {
        type: 'string',
        defaultValue: 'key',
      },
    },
    mpy(_, args) {
      const code = `tuyaclient.get_property(${args.PROP})`;
      return [code];
    },
  },
  {
    id: 'propertyValue',
    text: (
      <Text
        id="blocks.tuyamqtt.propertyValue"
        defaultMessage="property [PROP] value"
      />
    ),
    output: 'string',
    inputs: {
      PROP: {
        type: 'string',
        defaultValue: 'key',
      },
    },
    mpy(_, args) {
      const code = `tuyaclient.get_property(${args.PROP})`;
      return [code];
    },
  },
];
