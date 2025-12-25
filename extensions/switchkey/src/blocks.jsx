export const blocks = (meta) => [
  {
    id: 'whenKey',
    text: (
      <Text
        id="blocks.switchkey.whenKey"
        defaultMessage="when pin [PIN] [STATE]"
      />
    ),
    hat: true,
    inputs: {
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.all,
          }
        : {
            type: 'integer',
            defaultValue: '1',
          },
      STATE: {
        type: 'string',
        menu: 'StateOption',
      },
    },
  },
  {
    id: 'keyState',
    text: (
      <Text
        id="blocks.switchkey.keyState"
        defaultMessage="pin [PIN] is [STATE]?"
      />
    ),
    output: 'boolean',
    inputs: {
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.all,
          }
        : {
            type: 'integer',
            defaultValue: '1',
          },
      STATE: {
        type: 'string',
        menu: 'StateOption',
      },
    },
  },
  '---',
  {
    id: 'adcKeyPressed',
    text: (
      <Text
        id="blocks.switchkey.adcKeyPressed"
        defaultMessage="pin [PIN] adc keyboard [KEY] key is pressed?"
      />
    ),
    output: 'boolean',
    inputs: {
      PIN: meta.boardPins
        ? {
            menu: meta.boardPins.all,
          }
        : {
            type: 'integer',
            defaultValue: '1',
          },
      KEY: {
        type: 'string',
        defaultValue: 'a',
        menu: ['a', 'b', 'c', 'd', 'e'],
      },
    },
  },
];

export const menus = {
  StateOption: {
    items: [
      [
        <Text
          id="blocks.switchkey.keyPressed"
          defaultMessage="pressed"
        />,
        'pressed',
      ],
      [
        <Text
          id="blocks.switchkey.keyClick"
          defaultMessage="click"
        />,
        'click',
      ],
      [
        <Text
          id="blocks.switchkey.keyDbClick"
          defaultMessage="doubel click"
        />,
        'dbclick',
      ],
      [
        <Text
          id="blocks.switchkey.keyRelease"
          defaultMessage="release"
        />,
        'release',
      ],
    ],
  },
};
