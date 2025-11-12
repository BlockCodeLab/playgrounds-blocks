import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './lib/blocks';
import { files } from './lib/files';

import translations from './l10n.yaml';
import iconImage from './icon-tool.svg';
import iconBlockImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  blockIcon: iconBlockImage,
  name: (
    <Text
      id="blocks.ws2812pixels.name"
      defaultMessage="LED Pixels"
    />
  ),
  files,
  blocks,
  menus,
};
