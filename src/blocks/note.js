import { ScratchBlocks } from '../lib/scratch-blocks';

ScratchBlocks.Blocks['note'] = {
  init() {
    this.jsonInit({
      message0: '%1',
      args0: [
        {
          type: 'field_note',
          name: 'NOTE',
          note: 60,
        },
      ],
      outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
      output: 'String',
      colour: ScratchBlocks.Colours.textField,
      colourSecondary: ScratchBlocks.Colours.textField,
      colourTertiary: ScratchBlocks.Colours.textField,
      colourQuaternary: ScratchBlocks.Colours.textField,
    });
  },
};
