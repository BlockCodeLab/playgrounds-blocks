import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './blocks';
import { lessons } from './lessons';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.rfcom.name"
      defaultMessage="RF Communication"
    />
  ),
  lessons,
  blocks,
};
