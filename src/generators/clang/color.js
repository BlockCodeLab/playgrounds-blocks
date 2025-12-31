import { ClangGenerator } from './generator';

const proto = ClangGenerator.prototype;

proto['colour_picker'] = function (block) {
  const code = block.getFieldValue('COLOUR').replace('#', '0x');
  return [code, this.ORDER_ATOMIC];
};
