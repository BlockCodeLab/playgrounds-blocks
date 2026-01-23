import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './lib/blocks';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.rfidrc522.name"
      defaultMessage="RFID"
    />
  ),
  blocks,
};
