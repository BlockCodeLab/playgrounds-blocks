import { addLocalesMessages, Text } from '@blockcode/core';

import iconImage from './icon.svg';
import translations from './l10n.yaml';
import { blocks, menus } from './lib/blocks';
import { files } from './lib/files';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.encodermotor.name"
      defaultMessage="Encoder Motor"
    />
  ),
  files,
  blocks,
  menus,
};
