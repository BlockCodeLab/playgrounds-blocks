import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './blocks';
import bmx280PyUri from './bmx280.py';

import translations from './l10n.yaml';
import iconImage from './icon.png';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.bmx280.name"
      defaultMessage="BMP280"
    />
  ),
  files(meta) {
    if (meta.editor !== '@blockcode/gui-arduino') {
      return [
        {
          name: 'bmx280',
          type: 'text/x-python',
          uri: bmx280PyUri,
        },
      ];
    }
    return [];
  },
  blocks,
  menus,
};
