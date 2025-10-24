import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.servo.name"
      defaultMessage="9g Servo"
    />
  ),
  description: (
    <Text
      id="blocks.servo.description"
      defaultMessage="Standard servo module."
    />
  ),
  tags: ['device', 'arduino', 'actuator'],
};

addLocalesMessages({
  en: {
    'blocks.servo.name': '9g Servo',
    'blocks.servo.description': 'Standard 9g servo module.',
  },
  'zh-Hans': {
    'blocks.servo.name': '9g 舵机',
    'blocks.servo.description': '通用 9g 舵机模块。',
  },
  'zh-Hant': {
    'blocks.servo.name': '9g 舵機',
    'blocks.servo.description': '通用 9g 舵機模組。',
  },
});
