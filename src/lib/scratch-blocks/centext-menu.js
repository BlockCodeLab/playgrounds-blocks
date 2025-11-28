import { saveSvgAsPng, nanoid } from '@blockcode/utils';
import { translate } from '@blockcode/core';
import { ScratchBlocks } from './scratch-blocks';

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

  const exportPngOption = { enabled: true };
  if (isWorkspace) {
    exportPngOption.text = translate('blocks.centextMenu.exportAllBlocksPng', 'Export all Blocks to PNG');
    exportPngOption.callback = () => {
      const workspace = ScratchBlocks.getMainWorkspace();
      const canvas = workspace.getCanvas();
      if (canvas) {
        saveSvgAsPng(canvas, nanoid());
      }
    };
  } else {
    exportPngOption.text = translate('blocks.centextMenu.exportBlocksPng', 'Export Blocks to PNG');
    exportPngOption.callback = () => {
      const block = ScratchBlocks.ContextMenu.currentBlock;
      const options = {};
      const bbox = block.svgGroup_.getBBox();
      // 修复帽子积木被裁剪掉帽子
      bbox.y = 0;
      bbox.width += 2;
      bbox.height += 1;
      block.svgGroup_.getBBox = () => bbox;
      if (block.startHat_) {
        options.top = -22;
        options.left = -1;
        bbox.height += 5;
      }
      saveSvgAsPng(block.svgGroup_, nanoid(), options);
    };
  }

  options.splice(-1, 0, exportPngOption);
  showContextMenu(e, options, rtl);
};
