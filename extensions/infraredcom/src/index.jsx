import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './lib/blocks';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.infraredcom.name"
      defaultMessage="Infrared Communication"
    />
  ),
  blocks,
  menus,
};
