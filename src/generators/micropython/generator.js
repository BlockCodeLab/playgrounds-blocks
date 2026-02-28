import { PythonGenerator } from '../python';

export class MicroPythonGenerator extends PythonGenerator {
  INFINITE_LOOP_TRAP = 'await asyncio.sleep(0)\n';

  constructor(name = 'MPY') {
    super(name);
  }

  init(workspace) {
    super.init(workspace);

    // 获取用户定义
    this.onDefinitions?.();

    // 获取变量定义
    if (this.onVariableDefinitions) {
      delete this.definitions_['variables'];
      this.onVariableDefinitions(workspace);
    }
  }

  finish(code) {
    let mainCode = '# Start!\n';
    mainCode += 'coros = map(lambda t: t(), _tasks__)\n';
    mainCode += 'asyncio.run(asyncio.gather(*coros))\n';
    return super.finish(code) + '\n' + mainCode;
  }

  onDefinitions() {
    // 导入默认支持库
    this.definitions_['import_asyncio'] = 'import asyncio';
    this.definitions_['import_time'] = 'import time';

    // 全局变量
    this.definitions_['asyncio_tasks'] = '_tasks__ = []';
    this.definitions_['running_times'] = '_times__ = time.ticks_ms()';
  }

  addEventTrap(branchCode, id) {
    const defvars = this.definitions_['variables']?.split('\n') ?? [];
    const globalVars = [];
    for (const defvar of defvars) {
      const varName = defvar.split('=')[0].trim();
      globalVars.push(varName);
    }

    const funcName = this.createName(this.getDistinctName(id));
    let code = '';
    code += `async def ${funcName}():\n`;

    if (globalVars.length > 0) {
      code += `  global ${globalVars.join(', ')}\n`;
    }
    code += branchCode;
    return code;
  }
}
