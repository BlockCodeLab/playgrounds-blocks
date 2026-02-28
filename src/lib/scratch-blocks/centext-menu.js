import { svgAsPngUri, dataURItoBlob, exportFile, nanoid } from '@blockcode/utils';
import { translate, setAlert } from '@blockcode/core';
import { ScratchBlocks } from './scratch-blocks';

const saveDataUri = async (id, uri) => {
  const data = dataURItoBlob(uri);
  const result = await exportFile(data, `${nanoid()}.png`);
  if (result.success) {
    setAlert('exportCompleted', { id }, 1000);
  } else if (result.error === 'AbortError') {
    setAlert('exportAbortError', { id }, 1000);
  } else {
    setAlert('exportError', { id }, 1000);
  }
};

// 给工作区添加导出积木图片菜单项
const showContextMenu = ScratchBlocks.ContextMenu.show;
ScratchBlocks.ContextMenu.show = function (e, options, rtl) {
  let isWorkspace = false;
  for (const item of options) {
    if (item.text === ScratchBlocks.Msg.UNDO) {
      isWorkspace = true;
      break;
    }
  }

  // 导出积木图片菜单项
  const exportPngOption = { enabled: true };
  if (isWorkspace) {
    exportPngOption.text = translate('blocks.centextMenu.exportAllBlocksPng', 'Export all Blocks to PNG');
    exportPngOption.callback = () => {
      const workspace = ScratchBlocks.getMainWorkspace();
      const canvas = workspace.getCanvas();
      if (canvas) {
        const id = setAlert('exporting');
        svgAsPngUri(canvas)
          .then((uri) => saveDataUri(id, uri))
          .catch(() => setAlert('exportError', { id }, 1000));
      }
    };
  } else {
    exportPngOption.text = translate('blocks.centextMenu.exportBlocksPng', 'Export Blocks to PNG');
    exportPngOption.callback = () => {
      const block = ScratchBlocks.ContextMenu.currentBlock;
      const options = {};
      const getBBox = block.svgGroup_.getBBox.bind(block.svgGroup_);
      const bbox = getBBox();
      // 修复帽子积木被裁剪掉帽子
      bbox.y = 0;
      bbox.width += 2;
      bbox.height += 1;
      if (block.startHat_) {
        options.top = -22;
        options.left = -1;
        bbox.height += 5;
      }
      block.svgGroup_.getBBox = () => bbox;

      const id = setAlert('exporting');
      svgAsPngUri(block.svgGroup_, options)
        .then((uri) => saveDataUri(id, uri))
        .catch(() => setAlert('exportError', { id }, 1000))
        .finally(() => (block.svgGroup_.getBBox = getBBox));
    };
  }

  // 优化菜单顺序
  if (options.length > 2) {
    let commentItem, deleteItem;
    const commentIndex = options.findIndex((item) => item.text === ScratchBlocks.Msg.ADD_COMMENT);
    if (commentIndex !== -1) {
      commentItem = options.splice(commentIndex, 1)[0];
    }
    const deleteIndex = options.findIndex((item) => item.text === ScratchBlocks.Msg.DELETE);
    deleteItem = options.splice(deleteIndex, 1)[0];

    options.push(commentItem);
    options.push(exportPngOption);
    options.push(deleteItem);
  }

  showContextMenu(e, options, rtl);
};
