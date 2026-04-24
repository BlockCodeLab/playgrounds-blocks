import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './lib/blocks';
import { files } from './lib/files';
import { lessons } from './lessons';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.ld3320asr.name"
      defaultMessage="Speech Recognition"
    />
  ),
  readme,
  files,
  blocks,
  lessons,
};
