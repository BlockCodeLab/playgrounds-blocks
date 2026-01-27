import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';

import featureImage from './feature.svg';
import iconImage from './icon.png';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ioexpansion.name"
      defaultMessage="I/O Expansion"
    />
  ),
  description: (
    <Text
      id="blocks.ioexpansion.description"
      defaultMessage="Expand more I/O ports via I2C."
    />
  ),
  collaborator: (
    <Text
      id="blocks.ioexpansion.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'module'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.ioexpansion.name': 'I/O Expansion',
    'blocks.ioexpansion.description': 'Expand more I/O ports via I2C.',
    'blocks.ioexpansion.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.ioexpansion.name': 'I/O 扩展',
    'blocks.ioexpansion.description': '通过 I2C 扩展更多 I/O 口。',
    'blocks.ioexpansion.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.ioexpansion.name': 'I/O 擴展',
    'blocks.ioexpansion.description': '通過 I2C 擴展更多 I/O 口。',
    'blocks.ioexpansion.collaborator': 'Emakefun',
  },
});
