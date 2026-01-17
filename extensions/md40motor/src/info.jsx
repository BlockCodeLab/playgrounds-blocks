import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  beta: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.md40motor.name"
      defaultMessage="DM11 Motor"
    />
  ),
  description: (
    <Text
      id="blocks.md40motor.description"
      defaultMessage="DM11 dual motor driver."
    />
  ),
  collaborator: (
    <Text
      id="blocks.md40motor.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'actuator'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.md40motor.name': 'MD40 Encoder Motor Board',
    'blocks.md40motor.description': 'MD40 4-channel encoder motor driver board.',
    'blocks.md40motor.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.md40motor.name': 'MD40 编码电机驱动板',
    'blocks.md40motor.description': 'MD40 四路编码电机驱动板。',
    'blocks.md40motor.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.md40motor.name': 'MD40 編碼電機驅動板',
    'blocks.md40motor.description': 'MD40 四路編碼電機驅動板。',
    'blocks.md40motor.collaborator': 'Emakefun',
  },
});
