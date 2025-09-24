import { ColorUtils } from '@blockcode/utils';
import { ClangGenerator } from './generator';

const proto = ClangGenerator.prototype;

proto['colour_picker'] = function (block) {
  const { r, g, b } = ColorUtils.hexToRgb(block.getFieldValue('COLOUR'));
  const code = `{${r},${g},${b}}`;
  return [code, this.ORDER_ATOMIC];
};
