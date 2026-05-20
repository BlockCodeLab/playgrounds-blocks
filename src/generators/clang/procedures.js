import { ClangGenerator } from './generator';

const proto = ClangGenerator.prototype;

proto['argument_reporter_boolean'] = function (block) {
  const code = this.getVariableName(block.getFieldValue('VALUE'));
  return [code, this.ORDER_ATOMIC];
};

proto['argument_reporter_string_number'] = proto['argument_reporter_boolean'];

proto['argument_reporter_number'] = proto['argument_reporter_boolean'];

proto['procedures_return'] = function (block) {
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
  const code = `return ${valueCode};\n`;
  return code;
};

proto['procedures_exec'] = function (block) {
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
  const code = valueCode ? `${valueCode.replace(/^['"]|['"]$/g, '').replace(/;$/, '')};\n` : '';
  return code;
};

proto['procedures_comment'] = function (block) {
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE);
  const code = `// ${valueCode.replace(/^['"]|['"]$/g, '')}\n`;
  return code;
};
