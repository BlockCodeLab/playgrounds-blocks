import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './blocks';

import translations from './l10n.yaml';
import iconImage from './icon.png';
import onebuttonPyFile from './onebutton.py';

addLocalesMessages(translations);

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.switchkey.name"
      defaultMessage="Key Input"
    />
  ),
  files(meta) {
    if (notArduino(meta)) {
      return [
        {
          name: 'onebutton',
          common: true,
          type: 'text/x-python',
          uri: onebuttonPyFile,
        },
      ];
    }
    return [];
  },
  blocks,
  menus,
};
