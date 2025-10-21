import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './blocks';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.ainput.name"
      defaultMessage="Analog Input"
    />
  ),
  blocks,
  menus,
};
