import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './lib/blocks';
import { files } from './lib/files';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.wirelesscodingkit.name"
      defaultMessage="Wireless Coding Kit"
    />
  ),
  readme,
  files,
  blocks,
  menus,
};
