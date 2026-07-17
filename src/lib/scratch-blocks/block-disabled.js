import { ScratchBlocks } from './scratch-blocks';

// 禁用积木样式
ScratchBlocks.BlockSvg.prototype.updateDisabled = function () {
  if (this.disabled || this.getInheritedDisabled()) {
    if (ScratchBlocks.utils.addClass(this.svgGroup_, 'blocklyDisabled')) {
      // this.svgPath_.setAttribute('fill', 'url(#' + this.workspace.options.disabledPatternId + ')');
    }
  } else {
    if (ScratchBlocks.utils.removeClass(this.svgGroup_, 'blocklyDisabled')) {
      this.updateColour();
    }
  }
  const children = this.getChildren();
  for (const child of children) {
    child.updateDisabled();
  }
};
