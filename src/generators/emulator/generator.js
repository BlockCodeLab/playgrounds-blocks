import { ScratchBlocks } from '../../lib/scratch-blocks';
import { JavaScriptGenerator } from '../javascript';

const GUARD_LOOP_MAX = 500;

export class EmulatorGenerator extends JavaScriptGenerator {
  INFINITE_LOOP_TRAP = 'await runtime.nextTick();\n';
  GUARD_LOOP_RENDER = 2;
  GUARD_LOOP_ENABLE = true;
  GUARD_LOOP_DISABLE = false;

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

  // 检查孤立积木
  check_(block) {
    return block?.startHat_ || block?.parentBlock_;
  }

  addEventTrap(branchCode) {
    let code = '';
    code += '(done) => {\n';
    code += 'const userscript = async () => {\n';
    code += branchCode; // 用户积木脚本
    code += '};\n';
    code += `userscript.warpMode = runtime.warpMode;\n`; // 快速模式，当为 true 时，跳过强制循环等待（防死循环）
    code += 'return scripter.execute(userscript).then(done).catch(done);\n';
    code += '}';
    return code;
  }

  addLoopTrap(branchCode, id) {
    let code = '';
    code += '  if (userscript.aborted) return;\n';
    code += super.addLoopTrap(branchCode, id);
    // 防死循环
    if (this._guardLoop !== this.GUARD_LOOP_DISABLE && branchCode) {
      code += '  if (+userscript.warpMode < 1) {\n';
      // 非快速模式
      if (this._guardLoop === this.GUARD_LOOP_RENDER) {
        // 等待渲染帧
        code += '    await runtime.nextFrame();\n';
      } else {
        code += `    if (userscript.warpMode-- < -${GUARD_LOOP_MAX - 1}) {\n`;
        code += '      userscript.warpMode = false;\n';
        code += `      ${this.INFINITE_LOOP_TRAP}`;
        code += '    }\n';
      }
      // 快速模式
      code += `  } else if (userscript.warpMode++ > ${GUARD_LOOP_MAX}) {\n`;
      code += '    userscript.warpMode = true;\n';
      code += `    ${this.INFINITE_LOOP_TRAP}`;
      code += '  }\n';
    }
    delete this._guardLoop;
    return code;
  }
}
