import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './lib/blocks';
import { files } from './lib/files';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.stepmotor.name"
      defaultMessage="28BYJ-48 Stepper"
    />
  ),
  files,
  blocks,
};
