import { ScratchBlocks } from './scratch-blocks';

const BlockSvg = ScratchBlocks.BlockSvg;
const originalDropdownPositionArrow = ScratchBlocks.FieldDropdown.prototype.positionArrow;
const GRID_UNIT = BlockSvg.GRID_UNIT;

ScratchBlocks.CompactBlockSvg = {
  padding: 80,
  corner: 150,
  notch: 80,
};

ScratchBlocks.NormalBlockSvg = {
  padding: 100,
  corner: 100,
  notch: 100,
};

// fork: https://github.com/ScratchAddons/ScratchAddons/blob/master/addons/custom-block-shape/userscript.js
ScratchBlocks.resizeBlockSvg = (options = NormalBlockSvg) => {
  const paddingSize = options.padding / 100;
  const cornerSize = options.corner / 100;
  const notchSize = options.notch / 100;

  BlockSvg.SEP_SPACE_Y = 2 * GRID_UNIT * paddingSize;
  BlockSvg.MIN_BLOCK_X = 16 * GRID_UNIT * paddingSize;
  BlockSvg.MIN_BLOCK_X_OUTPUT = 12 * GRID_UNIT * paddingSize;
  BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT = 10 * GRID_UNIT * paddingSize;
  BlockSvg.MIN_BLOCK_Y = 12 * GRID_UNIT * paddingSize;
  BlockSvg.EXTRA_STATEMENT_ROW_Y = 8 * GRID_UNIT * paddingSize;
  BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 40 * GRID_UNIT * paddingSize;
  BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT = 8 * GRID_UNIT * paddingSize;
  BlockSvg.MIN_BLOCK_Y_REPORTER = 10 * GRID_UNIT * paddingSize;
  BlockSvg.MIN_STATEMENT_INPUT_HEIGHT = 6 * GRID_UNIT * paddingSize;
  BlockSvg.NOTCH_WIDTH = 8 * GRID_UNIT * paddingSize;
  BlockSvg.NOTCH_HEIGHT = 2 * GRID_UNIT * paddingSize * notchSize;
  BlockSvg.NOTCH_START_PADDING = 3 * GRID_UNIT; //* paddingSize
  BlockSvg.ICON_SEPARATOR_HEIGHT = 10 * GRID_UNIT * paddingSize;
  BlockSvg.NOTCH_PATH_LEFT =
    'c 2,0 3,' +
    1 * notchSize +
    ' 4,' +
    2 * notchSize +
    ' l ' +
    4 * paddingSize * notchSize +
    ',' +
    4 * paddingSize * notchSize +
    ' c 1,' +
    1 * notchSize +
    ' 2,' +
    2 * notchSize +
    ' 4,' +
    2 * notchSize +
    ' h ' +
    24 * (paddingSize - 0.5) +
    ' c 2,0 3,-' +
    1 * notchSize +
    ' 4,-' +
    2 * notchSize +
    ' l ' +
    4 * paddingSize * notchSize +
    ',' +
    -4 * paddingSize * notchSize +
    'c 1,-' +
    1 * notchSize +
    ' 2,-' +
    2 * notchSize +
    ' 4,-' +
    2 * notchSize;
  BlockSvg.NOTCH_PATH_RIGHT =
    'h ' +
    (-4 * (cornerSize - 1) - 5 * (1 - notchSize)) +
    'c -2,0 -3,' +
    1 * notchSize +
    ' -4,' +
    2 * notchSize +
    ' l ' +
    -4 * paddingSize * notchSize +
    ',' +
    4 * paddingSize * notchSize +
    ' c -1,' +
    1 * notchSize +
    ' -2,' +
    2 * notchSize +
    ' -4,' +
    2 * notchSize +
    ' h ' +
    -24 * (paddingSize - 0.5) +
    ' c -2,0 -3,-' +
    1 * notchSize +
    ' -4,-' +
    2 * notchSize +
    ' l ' +
    -4 * paddingSize * notchSize +
    ',' +
    -4 * paddingSize * notchSize +
    'c -1,-' +
    1 * notchSize +
    ' -2,-' +
    2 * notchSize +
    ' -4,-' +
    2 * notchSize;
  BlockSvg.INPUT_SHAPE_HEXAGONAL =
    'M ' +
    4 * GRID_UNIT * paddingSize +
    ',0 ' +
    ' h ' +
    4 * GRID_UNIT +
    ' l ' +
    4 * GRID_UNIT * paddingSize +
    ',' +
    4 * GRID_UNIT * paddingSize +
    ' l ' +
    -4 * GRID_UNIT * paddingSize +
    ',' +
    4 * GRID_UNIT * paddingSize +
    ' h ' +
    -4 * GRID_UNIT +
    ' l ' +
    -4 * GRID_UNIT * paddingSize +
    ',' +
    -4 * GRID_UNIT * paddingSize +
    ' l ' +
    4 * GRID_UNIT * paddingSize +
    ',' +
    -4 * GRID_UNIT * paddingSize +
    ' z';
  BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH = 12 * GRID_UNIT * paddingSize;
  BlockSvg.INPUT_SHAPE_ROUND =
    'M ' +
    4 * GRID_UNIT * paddingSize +
    ',0' +
    ' h ' +
    4 * GRID_UNIT * paddingSize +
    ' a ' +
    4 * GRID_UNIT * paddingSize +
    ' ' +
    4 * GRID_UNIT * paddingSize +
    ' 0 0 1 0 ' +
    8 * GRID_UNIT * paddingSize +
    ' h ' +
    -4 * GRID_UNIT * paddingSize +
    ' a ' +
    4 * GRID_UNIT * paddingSize +
    ' ' +
    4 * GRID_UNIT * paddingSize +
    ' 0 0 1 0 -' +
    8 * GRID_UNIT * paddingSize +
    ' z';
  BlockSvg.INPUT_SHAPE_ROUND_WIDTH = 12 * GRID_UNIT * paddingSize;
  BlockSvg.INPUT_SHAPE_HEIGHT = 8 * GRID_UNIT * paddingSize;
  BlockSvg.FIELD_HEIGHT = 8 * GRID_UNIT * paddingSize; // NOTE: Determines string input heights
  BlockSvg.FIELD_WIDTH = 6 * GRID_UNIT * Math.min(paddingSize, 1) + 10 * GRID_UNIT * Math.max(paddingSize - 1, 0);
  BlockSvg.FIELD_DEFAULT_CORNER_RADIUS = 4 * GRID_UNIT * paddingSize;
  BlockSvg.EDITABLE_FIELD_PADDING = 1.5 * GRID_UNIT * paddingSize;
  BlockSvg.BOX_FIELD_PADDING = 2 * GRID_UNIT * paddingSize;
  BlockSvg.DROPDOWN_ARROW_PADDING = 2 * GRID_UNIT * paddingSize;
  BlockSvg.FIELD_WIDTH_MIN_EDIT = 8 * GRID_UNIT * paddingSize;
  BlockSvg.INPUT_AND_FIELD_MIN_X = 12 * GRID_UNIT * paddingSize;
  BlockSvg.INLINE_PADDING_Y = 1 * GRID_UNIT * paddingSize; // For when reporters are inside reporters
  BlockSvg.SHAPE_IN_SHAPE_PADDING[1][0] = 5 * GRID_UNIT * paddingSize;
  BlockSvg.SHAPE_IN_SHAPE_PADDING[1][2] = 5 * GRID_UNIT * paddingSize;
  BlockSvg.SHAPE_IN_SHAPE_PADDING[1][3] = 5 * GRID_UNIT * paddingSize;

  ScratchBlocks.FieldDropdown.prototype.positionArrow = function (x) {
    const arrowHeight = 12;
    this.arrowY_ = (BlockSvg.FIELD_HEIGHT - arrowHeight) / 2 + 1;
    return originalDropdownPositionArrow.call(this, x);
  };

  // Corner setting
  BlockSvg.CORNER_RADIUS = (1 * GRID_UNIT * cornerSize * 100) / 100;

  BlockSvg.TOP_LEFT_CORNER_START = 'm 0,' + BlockSvg.CORNER_RADIUS;

  BlockSvg.TOP_LEFT_CORNER =
    'A ' + BlockSvg.CORNER_RADIUS + ',' + BlockSvg.CORNER_RADIUS + ' 0 0,1 ' + BlockSvg.CORNER_RADIUS + ',0';

  BlockSvg.TOP_RIGHT_CORNER =
    'a ' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS +
    ' 0 0,1 ' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS;

  BlockSvg.BOTTOM_RIGHT_CORNER =
    ' a ' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS +
    ' 0 0,1 -' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS;

  BlockSvg.BOTTOM_LEFT_CORNER =
    'a ' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS +
    ' 0 0,1 -' +
    BlockSvg.CORNER_RADIUS +
    ',-' +
    BlockSvg.CORNER_RADIUS;

  BlockSvg.INNER_TOP_LEFT_CORNER =
    ' a ' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS +
    ' 0 0,0 -' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS;

  BlockSvg.INNER_BOTTOM_LEFT_CORNER =
    'a ' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS +
    ' 0 0,0 ' +
    BlockSvg.CORNER_RADIUS +
    ',' +
    BlockSvg.CORNER_RADIUS;

  BlockSvg.TOP_RIGHT_CORNER_DEFINE_HAT =
    'a ' +
    BlockSvg.DEFINE_HAT_CORNER_RADIUS +
    ',' +
    BlockSvg.DEFINE_HAT_CORNER_RADIUS +
    ' 0 0,1 ' +
    BlockSvg.DEFINE_HAT_CORNER_RADIUS +
    ',' +
    BlockSvg.DEFINE_HAT_CORNER_RADIUS +
    ' v ' +
    (1 * GRID_UNIT - BlockSvg.CORNER_RADIUS);

  BlockSvg.STATEMENT_INPUT_INNER_SPACE = 2.8 * GRID_UNIT - 0.9 * GRID_UNIT * cornerSize;
};
