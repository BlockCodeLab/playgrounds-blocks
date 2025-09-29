import { EmulatorGenerator } from './generator';

const proto = EmulatorGenerator.prototype;

proto['control_wait'] = function (block) {
  const durationCode = this.valueToCode(block, 'DURATION', this.ORDER_NONE);
  const code = `await runtime.sleep(${durationCode});\n`;
  this._guardLoop = this.GUARD_LOOP_DISABLE;
  return code;
};

proto['control_repeat'] = function (block) {
  const timesCode = this.valueToCode(block, 'TIMES', this.ORDER_NONE);

  this._guardLoop = true;
  let branchCode = this.statementToCode(block, 'SUBSTACK');
  branchCode = this.addLoopTrap(branchCode, block.id);

  let code = '';
  code = `for (let _ = 0; _ < ${timesCode}; _++) {\n`;
  code += branchCode;
  code += '}\n';
  return code;
};

proto['control_forever'] = function (block) {
  this._guardLoop = true;
  let branchCode = this.statementToCode(block, 'SUBSTACK');
  branchCode = this.addLoopTrap(branchCode, block.id);

  let code = '';
  code += 'while (true) {\n';
  code += branchCode;
  code += '}\n';
  return code;
};

proto['control_if'] = function (block) {
  const conditionCode = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'false';

  let code = '';
  let branchCode = this.statementToCode(block, 'SUBSTACK');
  code += `if (${conditionCode}) {\n`;
  code += branchCode;
  code += '}\n';

  // else branch.
  if (block.getInput('SUBSTACK2')) {
    branchCode = this.statementToCode(block, 'SUBSTACK2');
    code += 'else {\n';
    code += branchCode;
    code += '}\n';
  }
  return code;
};

proto['control_if_else'] = proto['control_if'];

proto['control_repeat_until'] = function (block) {
  const conditionCode = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'true';

  this._guardLoop = true;
  let branchCode = this.statementToCode(block, 'SUBSTACK');
  branchCode = this.addLoopTrap(branchCode, block.id);

  let code = '';
  code += `while (!(${conditionCode})) {\n`;
  code += branchCode;
  code += '}\n';
  return code;
};

proto['control_wait_until'] = proto['control_repeat_until'];

proto['control_while'] = function (block) {
  const conditionCode = this.valueToCode(block, 'CONDITION', this.ORDER_NONE) || 'false';

  this._guardLoop = true;
  let branchCode = this.statementToCode(block, 'SUBSTACK');
  branchCode = this.addLoopTrap(branchCode, block.id);

  let code = '';
  code += `while (${conditionCode}) {\n`;
  code += branchCode;
  code += '}\n';
  return code;
};

proto['control_stop'] = function (block) {
  let code = '';
  const stopValue = block.getFieldValue('STOP_OPTION');
  switch (stopValue) {
    case 'all':
      code += 'runtime.stop();\n';
    case 'this script':
      code += 'return;\n';
      break;
    case 'other scripts in sprite':
      code += 'scripter.abortSkip(userscript.id);\n';
      this._guardLoop = this.GUARD_LOOP_DISABLE;
      break;
  }
  return code;
};

proto['control_start_as_clone'] = () => '';

proto['control_create_clone_of'] = () => '';

proto['control_delete_this_clone'] = () => '';
