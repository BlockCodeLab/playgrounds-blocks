import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.motor28byj48.name"
      defaultMessage="28BYJ-48 Stepper"
    />
  ),
  description: (
    <Text
      id="blocks.motor28byj48.description"
      defaultMessage="28BYJ-48 stepper motor driver."
    />
  ),
  tags: ['device', 'actuator'],
};

addLocalesMessages({
  en: {
    'blocks.motor28byj48.name': '28BYJ-48 Stepper',
    'blocks.motor28byj48.description': '28BYJ-48 stepper motor driver.',
  },
  'zh-Hans': {
    'blocks.motor28byj48.name': '28BYJ-48 步进电机',
    'blocks.motor28byj48.description': '控制 28BYJ-48 步进电机。',
  },
  'zh-Hant': {
    'blocks.motor28byj48.name': '28BYJ-48 步進電機',
    'blocks.motor28byj48.description': '控制 28BYJ-48 步進電機。',
  },
});
