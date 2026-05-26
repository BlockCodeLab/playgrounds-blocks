import { addLocalesMessages, Text } from '@blockcode/core';
import { files } from './lib/files';
import { blocks } from './lib/blocks';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.minijoystick.name"
      defaultMessage="Mini-JoyStick"
    />
  ),
  files,
  blocks,
  readme,
};
