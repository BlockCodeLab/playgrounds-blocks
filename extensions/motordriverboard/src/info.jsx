import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.motordriverboard.name"
      defaultMessage="Motor Driver Board"
    />
  ),
  description: (
    <Text
      id="blocks.motordriverboard.description"
      defaultMessage="Motor Driver Board with PS2 socket."
    />
  ),
  collaborator: (
    <Text
      id="blocks.motordriverboard.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'module'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.motordriverboard.name': 'Motor Driver Board',
    'blocks.motordriverboard.description': 'Motor Driver Board with PS2 socket.',
    'blocks.motordriverboard.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.motordriverboard.name': 'Motor Driver Board',
    'blocks.motordriverboard.description': '带PS2手柄接口的电机驱动扩展板。',
    'blocks.motordriverboard.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.motordriverboard.name': 'Motor Driver Board',
    'blocks.motordriverboard.description': '帶PS2手柄接口的電機驅動擴展板。',
    'blocks.motordriverboard.collaborator': 'Emakefun',
  },
});
