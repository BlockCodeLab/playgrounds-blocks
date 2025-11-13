import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './lib/blocks';
import { files } from './lib/files';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.vk16k33.name"
      defaultMessage="VK16K33 4-Digit"
    />
  ),
  files,
  blocks,
  menus,
};
