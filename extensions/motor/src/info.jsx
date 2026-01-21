import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.motor.name"
      defaultMessage="Motor"
    />
  ),
  description: (
    <Text
      id="blocks.motor.description"
      defaultMessage="Motor driver."
    />
  ),
  tags: ['device', 'arduino', 'actuator'],
};

addLocalesMessages({
  en: {
    'blocks.motor.name': 'Motor',
    'blocks.motor.description': 'Motor driver.',
  },
  'zh-Hans': {
    'blocks.motor.name': '电机',
    'blocks.motor.description': '通用电机控制。',
  },
  'zh-Hant': {
    'blocks.motor.name': '電機',
    'blocks.motor.description': '通用控制電機。',
  },
});
