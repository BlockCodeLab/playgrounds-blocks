import { translate } from '@blockcode/core';
import { ScratchBlocks } from './scratch-blocks';

// 在自制积木按钮之前，添加执行代码积木
ScratchBlocks.Blocks['procedures_exec'] = {
  init() {
    this.jsonInit({
      message0: translate('blocks.myblock.exec', 'exec %1'),
      args0: [
        {
          type: 'input_value',
          name: 'VALUE',
        },
      ],
      category: ScratchBlocks.Categories.more,
      extensions: ['colours_more', 'shape_statement'],
    });
  },
};

ScratchBlocks.Procedures.addCreateButton_ = function (workspace, xmlList) {
  if (workspace.procedureExecuteEnabled_) {
    const execText =
      '<block type="procedures_exec">' +
      '<value name="VALUE">' +
      '<shadow type="text">' +
      '<field name="TEXT"/>' +
      '</shadow>' +
      '</value>' +
      '</block>';
    const execBlock = ScratchBlocks.Xml.textToDom(execText);
    xmlList.push(execBlock);

    const sep = ScratchBlocks.Xml.textToDom('<sep gap="36"/>');
    xmlList.push(sep);
  }

  const createKey = 'CREATE_PROCEDURE';
  const createText = `<button text="${ScratchBlocks.Msg.NEW_PROCEDURE}" callbackKey="${createKey}"></button>`;
  const createButton = ScratchBlocks.Xml.textToDom(createText);
  const createCallback = () => ScratchBlocks.Procedures.createProcedureDefCallback_(workspace);
  workspace.registerButtonCallback(createKey, createCallback);
  xmlList.push(createButton);
};
