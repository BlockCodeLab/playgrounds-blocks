import { Text } from '@blockcode/core';

export const blocks = (meta) => [
  {
    id: 'tcs34725',
    text: (
      <Text
        id="blocks.colors.tcs34725"
        defaultMessage="TCS34725 color [RGB] value"
      />
    ),
    output: 'number',
    inputs: {
      RGB: {
        menu: 'RGBColor',
      },
    },
    ino(block) {
      const rgb = block.getFieldValue('RGB');
      this.definitions_['include_tcs34725'] = '#include "tcs34725.h"';
      this.definitions_['variable_tcs34725'] = `TCS34725 _tcs34725;`;
      this.definitions_['setup_tcs34725'] = `_tcs34725.begin();`;
      const code = `_tcs34725.get${rgb}ToGamma()`;
      return [code];
    },
  },
  '---',
  {
    id: 'nlcs11',
    text: (
      <Text
        id="blocks.colors.nlcs11"
        defaultMessage="NLCS11 color [RGB] value"
      />
    ),
    output: 'number',
    inputs: {
      RGB: {
        menu: 'RGBColor',
      },
    },
    ino(block) {
      const rgb = block.getFieldValue('RGB');
      this.definitions_['include_nlcs11'] = '#include "nlcs11.h"';
      this.definitions_['variable_nlcs11'] = `NLCS11 _nlcs11;`;
      this.definitions_['setup_nlcs11'] = `_nlcs11.Initialize();`;
      const code = `_nlcs11.Get${rgb}()`;
      return [code];
    },
  },
];

export const menus = {
  RGBColor: {
    items: [
      [
        <Text
          id="blocks.colors.red"
          defaultMessage="red"
        />,
        'Red',
      ],
      [
        <Text
          id="blocks.colors.green"
          defaultMessage="green"
        />,
        'Green',
      ],
      [
        <Text
          id="blocks.colors.blue"
          defaultMessage="blue"
        />,
        'Blue',
      ],
    ],
  },
};
