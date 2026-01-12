import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'initReceive',
    text: (
      <Text
        id="blocks.infraredcom.initReceive"
        defaultMessage="set pin [PIN] to ir receiver"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.in,
          }
        : {
            type: 'positive_integer',
            defaultValue: '1',
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_['include_irremote'] = '#include <IRremote.h>';
      this.definitions_['setup_irreceiver'] = `IrReceiver.begin(${pin});`;
      return '';
    },
  },
  {
    id: 'isReceived',
    text: (
      <Text
        id="blocks.infraredcom.isReceived"
        defaultMessage="received?"
      />
    ),
    output: 'boolean',
    ino(block) {
      this.definitions_['include_irremote'] = '#include <IRremote.h>';
      this.definitions_['variable_irreceiver'] = 'bool _IrReceivedNewData = false;';
      this.definitions_['loop_irreceiver'] = '_IrReceivedNewData = IrReceiver.decode(); IrReceiver.resume();';
      const code = '(_IrReceivedNewData && IrReceiver.decodedIRData.protocol != UNKNOWN)';
      return [code, this.ORDER_ATOMIC];
    },
  },
  {
    id: 'receive',
    text: (
      <Text
        id="blocks.infraredcom.receive"
        defaultMessage="received command"
      />
    ),
    output: 'string',
    ino(block) {
      this.definitions_['include_irremote'] = '#include <IRremote.h>';
      const code = 'IrReceiver.decodedIRData.command';
      return [code, this.ORDER_ATOMIC];
    },
  },
  {
    id: 'receiveAddr',
    text: (
      <Text
        id="blocks.infraredcom.receiveAddr"
        defaultMessage="received address"
      />
    ),
    output: 'string',
    ino(block) {
      this.definitions_['include_irremote'] = '#include <IRremote.h>';
      const code = 'IrReceiver.decodedIRData.address';
      return [code, this.ORDER_ATOMIC];
    },
  },
  // {
  //   id: 'receiveText',
  //   text: (
  //     <Text
  //       id="blocks.infraredcom.receiveText"
  //       defaultMessage="received String"
  //     />
  //   ),
  //   output: 'string',
  // },
  '---',
  {
    id: 'initSend',
    text: (
      <Text
        id="blocks.infraredcom.initSend"
        defaultMessage="set pin [PIN] to ir sender"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.out,
          }
        : {
            type: 'positive_integer',
            defaultValue: '1',
          },
    },
    ino(block) {
      const pin = meta.boardPins ? block.getFieldValue('PIN') : this.valueToCode(block, 'PIN', this.ORDER_NONE);
      this.definitions_['include_irremote'] = '#include <IRremote.h>';
      this.definitions_['setup_irsender'] = `IrSender.begin(${pin});`;
      return '';
    },
  },
  {
    id: 'send',
    text: (
      <Text
        id="blocks.infraredcom.send"
        defaultMessage="send command [CMD] encode [PROTO]"
      />
    ),
    inputs: {
      CMD: {
        type: 'hex16',
        defaultValue: '0',
      },
      PROTO: {
        menu: 'PROTO',
      },
    },
    ino(block) {
      const cmd = this.valueToCode(block, 'CMD', this.ORDER_NONE);
      const proto = block.getFieldValue('PROTO');
      this.definitions_['include_irremote'] = '#include <IRremote.h>';
      let code = '';
      code += `IrSender.write(${proto}, 0x0, ${cmd}, 0);\n`;
      code += 'IrSender.space(20);\n';
      return code;
    },
  },
  {
    id: 'sendAddr',
    text: (
      <Text
        id="blocks.infraredcom.sendAddr"
        defaultMessage="send command:[CMD] address:[ADDR] encode [PROTO]"
      />
    ),
    inputs: {
      CMD: {
        type: 'hex16',
        defaultValue: '0',
      },
      ADDR: {
        type: 'hex16',
        defaultValue: '0',
      },
      PROTO: {
        menu: 'PROTO',
      },
    },
    ino(block) {
      const cmd = this.valueToCode(block, 'CMD', this.ORDER_NONE);
      const addr = this.valueToCode(block, 'ADDR', this.ORDER_NONE);
      const proto = block.getFieldValue('PROTO');
      this.definitions_['include_irremote'] = '#include <IRremote.h>';
      let code = '';
      code += `IrSender.write(${proto}, ${addr}, ${cmd}, 0);\n`;
      code += 'IrSender.space(20);\n';
      return code;
    },
  },
  // {
  //   id: 'sendText',
  //   text: (
  //     <Text
  //       id="blocks.infraredcom.sendText"
  //       defaultMessage="pin [PIN] send String [TEXT]"
  //     />
  //   ),
  //   inputs: {
  //     PIN: meta.boardPins
  //       ? {
  //           menu: meta.boardPins.pwm,
  //         }
  //       : {
  //           type: 'positive_integer',
  //           defaultValue: '1',
  //         },
  //     TEXT: {
  //       type: 'string',
  //       defaultValue: 'message',
  //     },
  //   },
  // },
];

export const menus = {
  PROTO: {
    items: [
      ['NEC', 'NEC'],
      ['Samsung', 'SAMSUNG'],
      ['Samsung48', 'SAMSUNG48'],
      ['SamsungLG', 'SAMSUNGLG'],
      ['Song', 'SONY'],
      ['Panasonic', 'PANASONIC'],
      ['Denon', 'DENON'],
      ['Sharp', 'SHARP'],
      ['LG', 'LG'],
      ['JVC', 'JVC'],
      ['RC5', 'RC5'],
      ['RC6', 'RC6'],
      ['Kaseikyo JVC', 'KASEIKYO_JVC'],
      ['Kaseikyo Denon', 'KASEIKYO_DENON'],
      ['Kaseikyo Sharp', 'KASEIKYO_SHARP'],
      ['Kaseikyo Mitsubishi', 'KASEIKYO_MITSUBISHI'],
      ['NEC2', 'NEC2'],
      ['Onkyo', 'ONKYO'],
      ['Apple', 'APPLE'],
      ['BoseWave', 'BOSEWAVE'],
      ['FAST', 'FAST'],
      ['Lego', 'LEGO_PF'],
    ],
  },
};
