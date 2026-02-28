import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './blocks';
import { lessons } from './lessons';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.png';

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
  lessons,
};
