import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './lib/blocks';
import { files } from './lib/files';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.mp3player.name"
      defaultMessage="MP3 Player"
    />
  ),
  files,
  blocks,
  readme,
};
