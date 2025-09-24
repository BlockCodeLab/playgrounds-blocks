import { ColorUtils } from '@blockcode/utils';
import { PythonGenerator } from './generator';

const proto = PythonGenerator.prototype;

proto['colour_picker'] = function (block) {
  const { r, g, b } = ColorUtils.hexToRgb(block.getFieldValue('COLOUR'));
  const code = `(${r},${g},${b})`;
  return [code, this.ORDER_ATOMIC];
};
