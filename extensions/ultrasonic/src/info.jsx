import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ultrasonic.name"
      defaultMessage="Ultrasonic Ranging"
    />
  ),
  description: (
    <Text
      id="blocks.ultrasonic.description"
      defaultMessage="Ultrasound to measure distance."
    />
  ),
  tags: ['arduino', 'sensor'],
};

addLocalesMessages({
  en: {
    'blocks.ultrasonic.name': 'Ultrasonic Ranging',
    'blocks.ultrasonic.description': 'Ultrasound to measure distance.',
  },
  'zh-Hans': {
    'blocks.ultrasonic.name': '超声波测距',
    'blocks.ultrasonic.description': '使用超声波测定距离。',
  },
  'zh-Hant': {
    'blocks.ultrasonic.name': '超聲波測距',
    'blocks.ultrasonic.description': '使用超聲波測定距離。',
  },
});
