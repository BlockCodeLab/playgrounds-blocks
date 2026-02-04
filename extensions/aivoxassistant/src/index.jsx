import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './blocks';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.aivoxassistant.name"
      defaultMessage="AI Vox Assistant"
    />
  ),
  blocks,
  menus,
  readme,
};
