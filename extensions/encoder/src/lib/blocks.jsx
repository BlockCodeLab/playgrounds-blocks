import { Text } from '@blockcode/core';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.encoder.init"
        defaultMessage="init [ID] encoder pins A:[APin] B:[BPin]"
      />
    ),
    inputs: {
      ID: {
        menu: [
          ['1#', '1'],
          ['2#', '2'],
          ['3#', '3'],
          ['4#', '4'],
        ],
      },
      APin: {
        menu: meta.boardPins.in,
      },
      BPin: {
        menu: meta.boardPins.in,
      },
    },
    ino(_, args, defs) {
      defs['include_encoder'] = '#include <Encoder.h>';
      defs['variable_encoder'] = `Encoder encoder_${args.ID}(${args.APin}, ${args.BPin});`;
      return '';
    },
    mpy(_, args, defs) {
      defs['encoder'] = `encoder_${args.ID} = encoder.Encoder(${args.APin}, ${args.BPin})`;
      return '';
    },
  },
  {
    id: 'position',
    text: (
      <Text
        id="blocks.encoder.position"
        defaultMessage="[ID] encoder position"
      />
    ),
    output: 'number',
    inputs: {
      ID: {
        menu: [
          ['1#', '1'],
          ['2#', '2'],
          ['3#', '3'],
          ['4#', '4'],
        ],
      },
    },
    ino(_, args) {
      const code = `encoder_${args.ID}.read()`;
      return [code];
    },
    mpy(_, args) {
      const code = `encoder_${args.ID}.position`;
      return [code];
    },
  },
  '---',
  isArduino(meta) && {
    id: 'update',
    text: (
      <Text
        id="blocks.encoder.update"
        defaultMessage="manual update [ID] encoder"
      />
    ),
    inputs: {
      ID: {
        menu: [
          ['1#', '1'],
          ['2#', '2'],
          ['3#', '3'],
          ['4#', '4'],
        ],
      },
    },
    ino(_, args) {
      const code = `encoder_${args.ID}.read();\n`;
      return code;
    },
  },
  {
    id: 'reset',
    text: (
      <Text
        id="blocks.encoder.reset"
        defaultMessage="reset [ID] encoder"
      />
    ),
    inputs: {
      ID: {
        menu: [
          ['1#', '1'],
          ['2#', '2'],
          ['3#', '3'],
          ['4#', '4'],
        ],
      },
    },
    ino(_, args) {
      const code = `encoder_${args.ID}.write(0);\n`;
      return code;
    },
    mpy(_, args) {
      const code = `encoder_${args.ID}.position = 0\n`;
      return code;
    },
  },
];
