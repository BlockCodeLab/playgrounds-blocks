import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './lib/blocks';
import servoFile from './lib/servo.py';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.geekservo.name"
      defaultMessage="Geekservo"
    />
  ),
  files(meta) {
    if (meta.editor !== '@blockcode/gui-arduino') {
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
