import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './blocks';

import ultrasonicPy from './ultrasonic.py';
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
  files(meta) {
    if (meta.editor === '@blockcode/gui-arduino') {
      return [];
    }

    return [
      {
        common: true,
        name: 'ultrasonic.py',
        type: 'text/x-python',
        uri: ultrasonicPy,
      },
    ];
  },
  blocks,
  menus,
};
