import { JavaScriptGenerator } from './generator';

const proto = JavaScriptGenerator.prototype;

proto['argument_reporter_boolean'] = function (block) {
  const code = this.getVariableName(block.getFieldValue('VALUE'));
  return [code, this.ORDER_ATOMIC];
};

proto['argument_reporter_string_number'] = proto['argument_reporter_boolean'];

proto['procedures_return'] = function (block) {
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
  const code = `return ${valueCode};\n`;
  return code;
};

proto['procedures_exec'] = function (block) {
  const valueCode = block.childBlocks_[0].getFieldValue('TEXT') || '';
  const code = valueCode ? `${valueCode};\n` : '';
  return code;
};
