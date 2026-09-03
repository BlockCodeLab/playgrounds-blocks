import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'init',
    text: (
      <Text
        id="blocks.ubth04.init"
        defaultMessage="init UBTECH BUS on pin [PIN]"
      />
    ),
    inputs: {
      PIN: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 1,
          },
    },
    ino(_, args, defs) {
      defs['variable_ubtBus'] = `UbtechBus ubtBus(${args.PIN}, ${args.PIN});`;
      defs['setup_ubtBus'] = 'ubtBus.begin();';
      return '';
    },
  },
  '---',
  {
    id: 'setAngle',
    text: (
      <Text
        id="blocks.ubth04.angle"
        defaultMessage="set ID [ID] servo angle to [ANGLE]° time [TIME] ms"
      />
    ),
    inputs: {
      ID: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      ANGLE: {
        shadow: 'angle118',
        defaultValue: 0,
      },
      TIME: {
        shadow: 'time',
        defaultValue: 400,
      },
    },
    ino(_, args) {
      const code = `ubtBus.setServoPosition(${args.ID}, ${args.ANGLE}, ${args.TIME});\n`;
      return code;
    },
  },
  {
    id: 'angle118',
    shadow: true,
    output: 'number',
    inputs: {
      ANGLE: {
        type: 'slider',
        defaultValue: 0,
        min: -118,
        max: 118,
      },
    },
    ino(block) {
      const angle = block.getFieldValue('ANGLE') || 0;
      return [angle, this.ORDER_NONE];
    },
  },
  {
    id: 'time',
    shadow: true,
    output: 'number',
    inputs: {
      TIME: {
        type: 'slider',
        defaultValue: 0,
        min: 300,
        max: 5000,
      },
    },
    ino(block) {
      const angle = block.getFieldValue('TIME') || 0;
      return [angle, this.ORDER_NONE];
    },
  },
  {
    id: 'setRotate',
    text: (
      <Text
        id="blocks.ubth04.rotate"
        defaultMessage="set ID [ID] servo rotate to [ROTATE] speed [SPEED]"
      />
    ),
    inputs: {
      ID: {
        type: 'positive_integer',
        defaultValue: 1,
      },
      SPEED: {
        menu: [1, 2, 3, 4, 5],
      },
      ROTATE: {
        defaultValue: true,
        menu: [
          [
            <Text
              id="blocks.ubth04.rotateClockwise"
              defaultMessage="clockwise"
            />,
            'true',
          ],
          [
            <Text
              id="blocks.ubth04.rotateAntiClockwise"
              defaultMessage="anti-clockwise"
            />,
            'false',
          ],
        ],
      },
    },
    ino(_, args) {
      const code = `ubtBus.setServoTurn(${args.ID}, ${args.ROTATE}, ${args.SPEED});\n`;
      return code;
    },
  },
  {
    id: 'stop',
    text: (
      <Text
        id="blocks.ubth04.stop"
        defaultMessage="stop ID [ID] servo"
      />
    ),
    inputs: {
      ID: {
        type: 'positive_integer',
        defaultValue: 1,
      },
    },
    ino() {
      const code = 'ubtBus.stopServo();\n';
      return code;
    },
  },
];
