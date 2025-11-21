import { ScratchBlocks } from '../../lib/scratch-blocks';
import { JavaScriptGenerator } from '../javascript';

export class EmulatorGenerator extends JavaScriptGenerator {
  INFINITE_LOOP_TRAP = 'await runtime.nextTick();\n';
  RENDER_LOOP_TRAP = 'await runtime.nextFrame();\n';

  constructor() {
    super('EMU');
  }

  init(workspace) {
    super.init(workspace);

    // 中断运行控制
    this.definitions_['script_controller'] = 'const scripter = new ScriptController();';

    // 获取用户定义
    this.onDefinitions?.();

    // 获取用户变量定义
    if (this.onVariableDefinitions) {
      this.onVariableDefinitions(workspace);
      return;
    }

    // 默认变量定义
    const defvars = [];
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      if (variable.type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
        continue;
      }

      // 全部和局部变量
      const varName = variable.getId();
      let varValue = '0';
      if (variable.type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varValue = '[]';
      } else if (variable.type === ScratchBlocks.DICTIONARY_VARIABLE_TYPE) {
        varValue = '{}';
      }
      defvars.push(`runtime.setVariable('${varName}', ${varValue})`);
    }

    if (defvars.length) {
      this.definitions_['variables'] = defvars.join('\n');
    }
  }

  addEventTrap(branchCode) {
    let code = '';
    code += '(done) => {\n';
    code += 'const userscript = async () => {\n';
    code += branchCode; // 用户积木脚本
    code += '};\n';
    code += 'userscript.i = 0;\n';
    code += `userscript.warpMode = runtime.warpMode;\n`; // 快速模式，当为 true 时，跳过强制循环等待（防死循环）
    code += 'return scripter.execute(userscript).then(done).catch(done);\n';
    code += '}';
    return code;
  }

  statementToCode(block, name) {
    delete this.loopTrap_;
    return super.statementToCode(block, name);
  }

  renderLoopTrap() {
    this.loopTrap_ = this.RENDER_LOOP_TRAP;
  }

  addLoopTrap(branchCode, id) {
    // 检查是否有 await 语句，有则可以无需防死循环
    this.loopTrap_ = this.loopTrap_ ?? !/\bawait /m.test(branchCode);

    let code = '';
    code += '  if (userscript.aborted) return;\n';
    code += super.addLoopTrap(branchCode, id);

    // 防死循环
    if (this.loopTrap_ && branchCode) {
      // 等待渲染帧
      if (this.loopTrap_ === this.RENDER_LOOP_TRAP) {
        code += '  if (!userscript.warpMode) {\n';
        code += `    ${this.RENDER_LOOP_TRAP}`;
        code += `  } else if (userscript.i++ > 500) {\n`;
      } else {
        code += `  if (userscript.i++ > 500) {\n`;
      }
      // 极速模式
      code += '    userscript.i = 1;\n';
      code += `    ${this.INFINITE_LOOP_TRAP}`;
      code += '  }\n';
    }
    return code;
  }
}
