import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.leds.name"
      defaultMessage="LED"
    />
  ),
  description: (
    <Text
      id="blocks.leds.description"
      defaultMessage="Light up the world."
    />
  ),
  tags: ['device', 'arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.leds.name': 'LED',
    'blocks.leds.description': 'Light up the world.',
  },
  'zh-Hans': {
    'blocks.leds.name': 'LED 灯',
    'blocks.leds.description': '用光彩点亮世界。',
  },
  'zh-Hant': {
    'blocks.leds.name': 'LED 燈',
    'blocks.leds.description': '用光彩點亮世界。',
  },
});
