import { MicroPythonGenerator } from './generator';

const proto = MicroPythonGenerator.prototype;

proto['procedures_definition'] = function (block) {
  const myBlock = block.childBlocks_[0];
  const funcName = this.getDistinctName(myBlock.getProcCode());
  let branchCode = this.statementToCode(block) || this.PASS;

  // 参数格式：name
  const args = myBlock.childBlocks_.map((argBlock) => `${this.getVariableName(argBlock.getFieldValue('VALUE'))}`);

  // 查询全局变量
  const defvars = this.definitions_['variables']?.split('\n') ?? [];
  const globalVars = [];
  for (const defvar of defvars) {
    const varName = defvar.split('=')[0].trim();
    globalVars.push(varName);
  }

  // 定义函数
  let code = '';
  code += `async def ${funcName}(${args.join(', ')}):\n`;

  if (globalVars.length > 0) {
    code += `  global ${globalVars.join(', ')}\n`;
  }
  code += branchCode;
  this.definitions_[funcName] = code;
};

proto['procedures_call'] = function (block) {
  const funcName = this.getDistinctName(block.getProcCode());
  const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE) || 'False');
  const code = `await ${funcName}(${args.join(', ')})`;

  if (block.return_) {
    return [code, this.ORDER_FUNCTION_CALL];
  }
  return code + '\n';
};
