import { svgAsPngUri, dataURItoBlob, exportFile, nanoid } from '@blockcode/utils';
import { translate, setAlert } from '@blockcode/core';
import { ScratchBlocks } from './scratch-blocks';

const saveDataUri = (uri) => {
  const data = dataURItoBlob(uri);
  return exportFile(data, `${nanoid()}.png`)
    .then(() =>
      setAlert(
        {
          type: 'success',
          message: translate('blocks.centextMenu.exportPngDone', 'PNG exported.'),
        },
        2000,
      ),
    )
    .catch(() =>
      setAlert(
        {
          type: 'warn',
          message: translate('blocks.centextMenu.exportPngFailed', 'Failed to export image.'),
        },
        2000,
      ),
    );
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

  const exportPngOption = { enabled: true };
  if (isWorkspace) {
    exportPngOption.text = translate('blocks.centextMenu.exportAllBlocksPng', 'Export all Blocks to PNG');
    exportPngOption.callback = () => {
      const workspace = ScratchBlocks.getMainWorkspace();
      const canvas = workspace.getCanvas();
      if (canvas) {
        svgAsPngUri(canvas)
          .then(saveDataUri)
          .catch(() => {
            setAlert(
              {
                type: 'warn',
                message: translate('blocks.centextMenu.exportPngFailed', 'Failed to export image.'),
              },
              2000,
            );
          });
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
      svgAsPngUri(block.svgGroup_, options)
        .then((uri) => {
          block.svgGroup_.getBBox = getBBox;
          saveDataUri(uri);
        })
        .catch(() => {
          setAlert(
            {
              type: 'warn',
              message: translate('blocks.centextMenu.exportPngFailed', 'Failed to export image.'),
            },
            2000,
          );
        });
    };
  }

  options.splice(-1, 0, exportPngOption);
  showContextMenu(e, options, rtl);
};
