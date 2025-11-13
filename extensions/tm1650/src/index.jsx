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
      id="blocks.tm1650.name"
      defaultMessage="TM1650 4-Digit"
    />
  ),
  files,
  blocks,
  menus,
};
