import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './blocks';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.ultrasonic.name"
      defaultMessage="Ultrasonic Ranging"
    />
  ),
  blocks,
};
