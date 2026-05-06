import { addLocalesMessages, Text } from '@blockcode/core';
import { files } from './lib/files';
import { blocks, menus } from './lib/blocks';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.codexpad.name"
      defaultMessage="CodexPad"
    />
  ),
  files,
  blocks,
  menus,
  readme,
};
