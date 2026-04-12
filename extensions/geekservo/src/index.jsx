import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './lib/blocks';
import servoFile from './lib/servo.py';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

const notArduino = (meta) => !['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.geekservo.name"
      defaultMessage="Geekservo"
    />
  ),
  files(meta) {
    if (notArduino(meta)) {
      return [
        {
          common: true,
          name: 'servo',
          type: 'text/x-python',
          uri: servoFile,
        },
      ];
    }
    return [];
  },
  blocks,
};
