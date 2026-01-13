import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.geekservo.name"
      defaultMessage="Geekservo"
    />
  ),
  description: (
    <Text
      id="blocks.geekservo.description"
      defaultMessage="Geekservo servo module."
    />
  ),
  collaborator: (
    <Text
      id="blocks.geekservo.collaborator"
      defaultMessage="Geekservo"
    />
  ),
  tags: ['device', 'arduino', 'actuator'],
};

addLocalesMessages({
  en: {
    'blocks.geekservo.name': 'Geekservo',
    'blocks.geekservo.description': 'Geekservo servo module.',
    'blocks.geekservo.collaborator': 'Geekservo',
  },
  'zh-Hans': {
    'blocks.geekservo.name': 'Geekservo 舵机',
    'blocks.geekservo.description': 'Geekservo 舵机模块。',
    'blocks.geekservo.collaborator': 'Geekservo',
  },
  'zh-Hant': {
    'blocks.geekservo.name': 'Geekservo 舵機',
    'blocks.geekservo.description': 'Geekservo 舵機模組。',
    'blocks.geekservo.collaborator': 'Geekservo',
  },
});
