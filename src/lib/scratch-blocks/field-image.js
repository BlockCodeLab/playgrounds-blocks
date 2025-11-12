import { ScratchBlocks } from './scratch-blocks';

ScratchBlocks.FieldImage.prototype.init = function () {
  if (this.fieldGroup_) {
    // Image has already been initialized once.
    return;
  }
  // Build the DOM.
  /** @type {SVGElement} */
  this.fieldGroup_ = ScratchBlocks.utils.createSvgElement('g', {}, null);
  if (!this.visible_) {
    this.fieldGroup_.style.display = 'none';
  }
  /** @type {SVGElement} */
  this.imageElement_ = ScratchBlocks.utils.createSvgElement(
    /^M[ \d]+/.test(this.src_) ? 'path' : 'image',
    {
      height: this.height_ + 'px',
      width: this.width_ + 'px',
    },
    this.fieldGroup_,
  );
  this.setValue(this.src_);
  this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);

  // Configure the field to be transparent with respect to tooltips.
  this.setTooltip(this.sourceBlock_);
  ScratchBlocks.Tooltip.bindMouseEvents(this.imageElement_);
};

ScratchBlocks.FieldImage.prototype.setValue = function (src) {
  if (src === null) {
    // No change if null.
    return;
  }
  this.src_ = src;
  if (this.imageElement_) {
    if (/^M[ \d]+/.test(src)) {
      this.imageElement_.setAttribute('fill', '#ffffff');
      this.imageElement_.setAttribute('stroke', this.sourceBlock_.colourTertiary_);
      this.imageElement_.setAttribute('d', src || '');
    } else {
      this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src || '');
    }
  }
};
