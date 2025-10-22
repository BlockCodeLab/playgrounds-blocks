import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './blocks';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.leds.name"
      defaultMessage="LED"
    />
  ),
  blocks,
  menus,
};
