import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks } from './lib/blocks';

import translations from './l10n.yaml';
import iconImage from './icon.png';
import servoFile from './lib/servo.py';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.servo.name"
      defaultMessage="9g Servo"
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
