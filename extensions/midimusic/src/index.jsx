import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './lib/blocks';
import { files } from './lib/files';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.svg';
import blockIconImage from './icon-block.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  blockIcon: blockIconImage,
  name: (
    <Text
      id="blocks.midimusic.name"
      defaultMessage="MIDI Music"
    />
  ),
  files,
  blocks,
  menus,
  readme,
};
