import { ScratchBlocks } from '../lib/scratch-blocks';

ScratchBlocks.Blocks['math_hex'] = {
  init() {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_hex_number',
          name: 'HEX',
          value: '0',
        },
      ],
      output: 'String',
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
      colour: ScratchBlocks.Colours.textField,
      colourSecondary: ScratchBlocks.Colours.textField,
      colourTertiary: ScratchBlocks.Colours.textField,
      colourQuaternary: ScratchBlocks.Colours.textField,
    });
  },
};

ScratchBlocks.Blocks['math_hex8'] = {
  init() {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_hex_number',
          name: 'HEX',
          value: '0',
          length: 2,
        },
      ],
      output: 'String',
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
      colour: ScratchBlocks.Colours.textField,
      colourSecondary: ScratchBlocks.Colours.textField,
      colourTertiary: ScratchBlocks.Colours.textField,
      colourQuaternary: ScratchBlocks.Colours.textField,
    });
  },
};

ScratchBlocks.Blocks['math_hex16'] = {
  init() {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_hex_number',
          name: 'HEX',
          value: '0',
          length: 4,
        },
      ],
      output: 'String',
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
      colour: ScratchBlocks.Colours.textField,
      colourSecondary: ScratchBlocks.Colours.textField,
      colourTertiary: ScratchBlocks.Colours.textField,
      colourQuaternary: ScratchBlocks.Colours.textField,
    });
  },
};

ScratchBlocks.Blocks['math_hex32'] = {
  init() {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_hex_number',
          name: 'HEX',
          value: '0',
          length: 8,
        },
      ],
      output: 'String',
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
      colour: ScratchBlocks.Colours.textField,
      colourSecondary: ScratchBlocks.Colours.textField,
      colourTertiary: ScratchBlocks.Colours.textField,
      colourQuaternary: ScratchBlocks.Colours.textField,
    });
  },
};

ScratchBlocks.Blocks['math_hex64'] = {
  init() {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_hex_number',
          name: 'HEX',
          value: '0',
          length: 16,
        },
      ],
      output: 'String',
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
      colour: ScratchBlocks.Colours.textField,
      colourSecondary: ScratchBlocks.Colours.textField,
      colourTertiary: ScratchBlocks.Colours.textField,
      colourQuaternary: ScratchBlocks.Colours.textField,
    });
  },
};
