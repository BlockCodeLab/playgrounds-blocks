import { Text } from '@blockcode/core';

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);
const isIotBit = (meta) => meta.editor === '@emakefun/gui-iotbit';

export const blocks = (meta) => [
  notArduino(meta) && {
    id: 'tcs34725Init',
    text: (
      <Text
        id="blocks.colors.tcs34725Init"
        defaultMessage="set TCS34725 pins SCL:[SCL] SDA:[SDA]"
      />
    ),
    inputs: {
      SCL: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? 'P19' : '2',
          }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      SDA: meta.boardPins
        ? {
            menu: meta.boardPins.out,
            defaultValue: isIotBit(meta) ? 'P20' : '3',
          }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    mpy(block, args) {
      this.definitions_['import_tcs34725'] = `from tcs34725 import TCS34725`;
      this.definitions_['tcs34725'] = `_tcs34725 = TCS34725(${args.SCL}, ${args.SDA})`;
      return '';
    },
  },
  {
    id: 'tcs34725Color',
    text: (
      <Text
        id="blocks.colors.tcs34725Color"
        defaultMessage="TCS34725 color (gamma-corrected)"
      />
    ),
    output: 'string',
    ino(block) {
      this.definitions_['include_wire'] = '#include <Wire.h>';
      this.definitions_['include_tcs34725'] = '#include "tcs34725.h"';
      this.definitions_['variable_tcs34725'] = `TCS34725 _tcs34725;`;
      this.definitions_['setup_wire'] = 'Wire.begin(); delay(50);';
      this.definitions_['setup_tcs34725'] = `_tcs34725.begin();`;
      const code = `_tcs34725.getColorToGamma()`;
      return [code];
    },
    mpy(block) {
      const code = `(await _tcs34725.async_get_color_to_gamma())`;
      return [code];
    },
  },
  {
    id: 'tcs34725',
    text: (
      <Text
        id="blocks.colors.tcs34725"
        defaultMessage="TCS34725 color [RGB] value (gamma-corrected)"
      />
    ),
    output: 'number',
    inputs: {
      RGB: {
        menu: 'RGBColor',
      },
    },
    ino(block, args) {
      this.definitions_['include_wire'] = '#include <Wire.h>';
      this.definitions_['include_tcs34725'] = '#include "tcs34725.h"';
      this.definitions_['variable_tcs34725'] = `TCS34725 _tcs34725;`;
      this.definitions_['setup_wire'] = 'Wire.begin(); delay(50);';
      this.definitions_['setup_tcs34725'] = `_tcs34725.begin();`;
      const code = `_tcs34725.get${args.RGB}ToGamma()`;
      return [code];
    },
    mpy(block, args) {
      const code = `(await _tcs34725.async_get_${args.RGB.toLowerCase()}_to_gamma())`;
      return [code];
    },
  },
  {
    id: 'tcs34725ColorRaw',
    text: (
      <Text
        id="blocks.colors.tcs34725ColorRaw"
        defaultMessage="TCS34725 color"
      />
    ),
    output: 'string',
    ino(block) {
      this.definitions_['include_wire'] = '#include <Wire.h>';
      this.definitions_['include_tcs34725'] = '#include "tcs34725.h"';
      this.definitions_['variable_tcs34725'] = `TCS34725 _tcs34725;`;
      this.definitions_['setup_wire'] = 'Wire.begin(); delay(50);';
      this.definitions_['setup_tcs34725'] = `_tcs34725.begin();`;
      const code = `_tcs34725.getColor()`;
      return [code];
    },
    mpy(block) {
      const code = `(await _tcs34725.async_get_color())`;
      return [code];
    },
  },
  {
    id: 'tcs34725Raw',
    text: (
      <Text
        id="blocks.colors.tcs34725Raw"
        defaultMessage="TCS34725 color [RGB] value"
      />
    ),
    output: 'number',
    inputs: {
      RGB: {
        menu: 'RGBColor',
      },
    },
    ino(block, args) {
      this.definitions_['include_wire'] = '#include <Wire.h>';
      this.definitions_['include_tcs34725'] = '#include "tcs34725.h"';
      this.definitions_['variable_tcs34725'] = `TCS34725 _tcs34725;`;
      this.definitions_['setup_wire'] = 'Wire.begin(); delay(50);';
      this.definitions_['setup_tcs34725'] = `_tcs34725.begin();`;
      const code = `_tcs34725.get${args.RGB}()`;
      return [code];
    },
    mpy(block, args) {
      const code = `(await _tcs34725.async_get_${args.RGB.toLowerCase()}())`;
      return [code];
    },
  },
  '---',
  notArduino(meta) && {
    id: 'nlcs11Init',
    text: (
      <Text
        id="blocks.colors.nlcs11Init"
        defaultMessage="set NLCS11 pins SCL:[SCL] SDA:[SDA]"
      />
    ),
    inputs: {
      SCL: meta.boardPins
        ? { menu: meta.boardPins.out }
        : {
            type: 'positive_integer',
            defaultValue: 2,
          },
      SDA: meta.boardPins
        ? { menu: meta.boardPins.in }
        : {
            type: 'positive_integer',
            defaultValue: 3,
          },
    },
    mpy(block, args) {
      this.definitions_['import_nlcs11'] = 'from nlcs11 import NLCS11';
      this.definitions_['nlcs11'] = `_nlcs11 = NLCS11(${args.SCL}, ${args.SDA})`;
      this.definitions_['nlcs11_init'] = `_nlcs11.init()`;
      return '';
    },
  },
  {
    id: 'nlcs11Color',
    text: (
      <Text
        id="blocks.colors.nlcs11Color"
        defaultMessage="NLCS11 color (gamma-corrected)"
      />
    ),
    output: 'string',
    ino(block) {
      this.definitions_['include_nlcs11'] = '#include "nlcs11.h"';
      this.definitions_['variable_nlcs11'] = `NLCS11 _nlcs11;`;
      this.definitions_['setup_nlcs11'] = `_nlcs11.Initialize();`;
      const code = `_nlcs11.GetColorToGamma()`;
      return [code];
    },
    mpy(block) {
      const code = `_nlcs11.get_color_gamma()`;
      return [code];
    },
  },
  {
    id: 'nlcs11',
    text: (
      <Text
        id="blocks.colors.nlcs11"
        defaultMessage="NLCS11 color [RGB] value (gamma-corrected)"
      />
    ),
    output: 'number',
    inputs: {
      RGB: {
        menu: 'RGBColor',
      },
    },
    ino(block, args) {
      this.definitions_['include_nlcs11'] = '#include "nlcs11.h"';
      this.definitions_['variable_nlcs11'] = `NLCS11 _nlcs11;`;
      this.definitions_['setup_nlcs11'] = `_nlcs11.Initialize();`;
      const code = `_nlcs11.Get${args.RGB}ToGamma()`;
      return [code];
    },
    mpy(block, args) {
      const code = `_nlcs11.get_${args.RGB.toLowerCase()}_gamma()`;
      return [code];
    },
  },
  {
    id: 'nlcs11ColorRaw',
    text: (
      <Text
        id="blocks.colors.nlcs11ColorRaw"
        defaultMessage="NLCS11 color"
      />
    ),
    output: 'string',
    ino(block) {
      this.definitions_['include_nlcs11'] = '#include "nlcs11.h"';
      this.definitions_['variable_nlcs11'] = `NLCS11 _nlcs11;`;
      this.definitions_['setup_nlcs11'] = `_nlcs11.Initialize();`;
      const code = `_nlcs11.GetColor()`;
      return [code];
    },
    mpy(block) {
      const code = `_nlcs11.get_color()`;
      return [code];
    },
  },
  {
    id: 'nlcs11Raw',
    text: (
      <Text
        id="blocks.colors.nlcs11Raw"
        defaultMessage="NLCS11 color [RGB] value"
      />
    ),
    output: 'number',
    inputs: {
      RGB: {
        menu: 'RGBColor',
      },
    },
    ino(block, args) {
      this.definitions_['include_nlcs11'] = '#include "nlcs11.h"';
      this.definitions_['variable_nlcs11'] = `NLCS11 _nlcs11;`;
      this.definitions_['setup_nlcs11'] = `_nlcs11.Initialize();`;
      const code = `_nlcs11.Get${args.RGB}()`;
      return [code];
    },
    mpy(block, args) {
      const code = `_nlcs11.get_${args.RGB.toLowerCase()}()`;
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
          defaultMessage="r"
        />,
        'Red',
      ],
      [
        <Text
          id="blocks.colors.green"
          defaultMessage="g"
        />,
        'Green',
      ],
      [
        <Text
          id="blocks.colors.blue"
          defaultMessage="b"
        />,
        'Blue',
      ],
    ],
  },
};
