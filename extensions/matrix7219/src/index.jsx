import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './lib/blocks';
import { files } from './lib/files';

import translations from './l10n.yaml';
import iconImage from './icon.svg';
import iconBlockImage from './icon-block.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  blockIcon: iconBlockImage,
  name: (
    <Text
      id="blocks.matrix7219.name"
      defaultMessage="LED Matrix"
    />
  ),
  files,
  blocks,
  menus,
};
