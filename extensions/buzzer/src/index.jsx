import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './lib/blocks';
import { files } from './lib/files';

import translations from './l10n.yaml';
import iconImage from './icon.svg';
import blockIconImage from './icon-block.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  blockIcon: blockIconImage,
  name: (
    <Text
      id="blocks.buzzer.name"
      defaultMessage="Buzzer"
    />
  ),
  files,
  blocks,
  menus,
};
