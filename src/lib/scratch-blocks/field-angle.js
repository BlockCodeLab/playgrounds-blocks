import { ScratchBlocks } from './scratch-blocks';

// 修复不同颜色积木块下角度圆盘和箭头的颜色
ScratchBlocks.FieldAngle.prototype.showEditor_ = function () {
  // Mobile browsers have issues with in-line textareas (focus & keyboards).
  ScratchBlocks.FieldAngle.superClass_.showEditor_.call(this, this.useTouchInteraction_);
  // If there is an existing drop-down someone else owns, hide it immediately and clear it.
  ScratchBlocks.DropDownDiv.hideWithoutAnimation();
  ScratchBlocks.DropDownDiv.clearContent();
  const div = ScratchBlocks.DropDownDiv.getContentDiv();
  // Build the SVG DOM.
  const svg = ScratchBlocks.utils.createSvgElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:html': 'http://www.w3.org/1999/xhtml',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      version: '1.1',
      height: ScratchBlocks.FieldAngle.HALF * 2 + 'px',
      width: ScratchBlocks.FieldAngle.HALF * 2 + 'px',
    },
    div,
  );
  const parentBlock = this.sourceBlock_.getParent();
  ScratchBlocks.utils.createSvgElement(
    'circle',
    {
      cx: ScratchBlocks.FieldAngle.HALF,
      cy: ScratchBlocks.FieldAngle.HALF,
      r: ScratchBlocks.FieldAngle.RADIUS,
      fill: parentBlock.colourSecondary_,
      stroke: parentBlock.colourTertiary_,
      class: 'blocklyAngleCircleEx',
    },
    svg,
  );
  this.gauge_ = ScratchBlocks.utils.createSvgElement('path', { class: 'blocklyAngleGauge' }, svg);
  // The moving line, x2 and y2 are set in updateGraph_
  this.line_ = ScratchBlocks.utils.createSvgElement(
    'line',
    {
      x1: ScratchBlocks.FieldAngle.HALF,
      y1: ScratchBlocks.FieldAngle.HALF,
      class: 'blocklyAngleLine',
    },
    svg,
  );
  // The fixed vertical line at the offset
  const offsetRadians = (Math.PI * ScratchBlocks.FieldAngle.OFFSET) / 180;
  ScratchBlocks.utils.createSvgElement(
    'line',
    {
      x1: ScratchBlocks.FieldAngle.HALF,
      y1: ScratchBlocks.FieldAngle.HALF,
      x2: ScratchBlocks.FieldAngle.HALF + ScratchBlocks.FieldAngle.RADIUS * Math.cos(offsetRadians),
      y2: ScratchBlocks.FieldAngle.HALF - ScratchBlocks.FieldAngle.RADIUS * Math.sin(offsetRadians),
      class: 'blocklyAngleLine',
    },
    svg,
  );
  // Draw markers around the edge.
  for (let angle = 0; angle < 360; angle += 15) {
    ScratchBlocks.utils.createSvgElement(
      'line',
      {
        x1: ScratchBlocks.FieldAngle.HALF + ScratchBlocks.FieldAngle.RADIUS - 13,
        y1: ScratchBlocks.FieldAngle.HALF,
        x2: ScratchBlocks.FieldAngle.HALF + ScratchBlocks.FieldAngle.RADIUS - 7,
        y2: ScratchBlocks.FieldAngle.HALF,
        class: 'blocklyAngleMarks',
        transform: 'rotate(' + angle + ',' + ScratchBlocks.FieldAngle.HALF + ',' + ScratchBlocks.FieldAngle.HALF + ')',
      },
      svg,
    );
  }
  // Center point
  ScratchBlocks.utils.createSvgElement(
    'circle',
    {
      cx: ScratchBlocks.FieldAngle.HALF,
      cy: ScratchBlocks.FieldAngle.HALF,
      r: ScratchBlocks.FieldAngle.CENTER_RADIUS,
      class: 'blocklyAngleCenterPoint',
    },
    svg,
  );
  // Handle group: a circle and the arrow image
  this.handle_ = ScratchBlocks.utils.createSvgElement('g', {}, svg);
  ScratchBlocks.utils.createSvgElement(
    'circle',
    {
      cx: 0,
      cy: 0,
      r: ScratchBlocks.FieldAngle.HANDLE_RADIUS,
      class: 'blocklyAngleDragHandle',
    },
    this.handle_,
  );
  this.arrowSvg_ = ScratchBlocks.utils.createSvgElement(
    'path',
    {
      width: ScratchBlocks.FieldAngle.ARROW_WIDTH,
      height: ScratchBlocks.FieldAngle.ARROW_WIDTH,
      x: -ScratchBlocks.FieldAngle.ARROW_WIDTH / 2,
      y: -ScratchBlocks.FieldAngle.ARROW_WIDTH / 2,
      fill: parentBlock.colour_,
      d: 'M 0.0189 -1.3178 L -4.4901 -0.5663 C -4.7532 -0.5224 -4.9811 -0.2606 -4.9811 0.0156 C -4.9811 0.2836 -4.7613 0.5522 -4.4901 0.5974 L 0.0189 1.3489 L 0.0189 3.0185 C 0.0189 3.5625 0.3833 3.752 0.8327 3.4269 L 4.641 0.6721 C 5.0982 0.3414 5.0957 -0.1853 4.6527 -0.5168 L 0.821 -3.3842 C 0.3756 -3.7175 0.0189 -3.5381 0.0189 -2.9874 L 0.0189 -1.3178 Z',
      class: 'blocklyAngleDragArrow',
    },
    this.handle_,
  );
  // this.arrowSvg_.setAttributeNS(
  //   'http://www.w3.org/1999/xlink',
  //   'xlink:href',
  //   ScratchBlocks.mainWorkspace.options.pathToMedia + ScratchBlocks.FieldAngle.ARROW_SVG_PATH,
  // );

  ScratchBlocks.DropDownDiv.setColour(
    this.sourceBlock_.parentBlock_.getColour(),
    this.sourceBlock_.getColourTertiary(),
  );
  ScratchBlocks.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
  ScratchBlocks.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

  this.mouseDownWrapper_ = ScratchBlocks.bindEvent_(this.handle_, 'mousedown', this, this.onMouseDown);

  this.updateGraph_();
};
