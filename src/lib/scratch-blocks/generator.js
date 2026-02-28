import { pinyin, addTraditionalDict } from 'pinyin-pro';
import { ScratchBlocks } from './scratch-blocks';
import TraditionalDict from '@pinyin-pro/data/traditional';

addTraditionalDict(TraditionalDict);

const BaseGenerator = ScratchBlocks.Generator;

class Generator extends BaseGenerator {
  blockToCode(block) {
    if (this.check_(block)) {
      return super.blockToCode(block);
    }
    return '';
  }

  init(workspace) {
    // 将所有积木对应的转换函数绑定到 this
    for (const key in this) {
      if (typeof this[key] === 'function' && !BaseGenerator.prototype[key]) {
        this[key] = this[key].bind(this);
      }
    }

    // Create a dictionary of definitions to be printed before the code.
    this.definitions_ = Object.create(null);
    // Create a dictionary mapping desired function or variable names.
    this.names_ = Object.create(null);

    if (!this.variableDB_) {
      this.variableDB_ = new ScratchBlocks.Names(this.RESERVED_WORDS_);
    } else {
      this.variableDB_.reset();
    }

    this.variableDB_.setVariableMap(workspace.getVariableMap());
  }

  statementToCode(block, name) {
    // 帽子（事件）函数没有input，所以用statementToCode时无法提供
    // 所以用nextConnection的targetBlock
    const targetBlock = name ? block.getInputTargetBlock(name) : block.nextConnection?.targetBlock();
    let code = this.blockToCode(targetBlock);
    if (code) {
      code = this.prefixLines(code, this.INDENT);
    }
    return code;
  }

  // 检查孤立积木
  check_(block) {
    return block?.startHat_ || block?.parentBlock_;
  }

  addLoopTrap(branch, id) {
    id = id.replace(/\$/g, '$$$$');
    if (this.INFINITE_LOOP_TRAP && !branch) {
      branch = this.prefixLines(this.INFINITE_LOOP_TRAP.replace(/%1/g, "'" + id + "'"), this.INDENT) + branch;
    }
    if (this.STATEMENT_PREFIX) {
      branch += this.prefixLines(branch, this.INDENT);
    }
    return branch;
  }

  createName(desiredName) {
    const count = (this.names_[desiredName] ?? 0) + 1;
    this.names_[desiredName] = count;
    return `${desiredName}_${count}`;
  }

  createLoopName() {
    return this.createName('i').replace('i_', 'i');
  }

  getVariableName(name) {
    const varName = this.variableDB_.getNameForUserVariable_(name);
    if (varName) {
      name = varName;
    }
    return this.getDistinctName(name);
  }

  getDistinctName(name) {
    const safeName = pinyin(name.replace(/%\w/g, '_'), {
      type: 'array',
      toneType: 'num',
      traditional: true,
    });
    return `_${safeName.join('').replace(/[^_a-zA-Z0-9]/g, '')}`;
  }
}

ScratchBlocks.Generator = Generator;
