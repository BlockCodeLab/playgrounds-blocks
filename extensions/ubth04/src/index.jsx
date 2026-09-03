import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './lib/blocks';
import { files } from './lib/files';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.ubth04.name"
      defaultMessage="UBT-H04 Servo"
    />
  ),
  blocks,
  files,
};
