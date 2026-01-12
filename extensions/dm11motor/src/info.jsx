import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.dm11motor.name"
      defaultMessage="DM11 Motor Board"
    />
  ),
  description: (
    <Text
      id="blocks.dm11motor.description"
      defaultMessage="DM11 dual motor driver."
    />
  ),
  collaborator: (
    <Text
      id="blocks.dm11motor.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'actuator'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.dm11motor.name': 'DM11 Motor Board',
    'blocks.dm11motor.description': 'DM11 dual motor driver board.',
    'blocks.dm11motor.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.dm11motor.name': 'DM11 电机驱动板',
    'blocks.dm11motor.description': 'DM11 双电机驱动板。',
    'blocks.dm11motor.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.dm11motor.name': 'DM11 電機驅動板',
    'blocks.dm11motor.description': 'DM11 雙電機驅動板。',
    'blocks.dm11motor.collaborator': 'Emakefun',
  },
});
