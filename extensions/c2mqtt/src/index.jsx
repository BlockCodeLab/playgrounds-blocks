import { addLocalesMessages, Text } from '@blockcode/core';
import { blocks, menus } from './lib/blocks';
import { files } from './lib/files';
import { lessons } from './lessons';
import { readme } from '../package.json';

import translations from './l10n.yaml';
import iconImage from './icon.svg';

addLocalesMessages(translations);

export default {
  icon: iconImage,
  name: (
    <Text
      id="blocks.c2mqtt.name"
      defaultMessage="ESP32-C2 MQTT"
    />
  ),
  files,
  blocks,
  menus,
  readme,
  lessons,
};
