import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ws2812pixels.name"
      defaultMessage="WS2812 LEDs"
    />
  ),
  description: (
    <Text
      id="blocks.ws2812pixels.description"
      defaultMessage="WS2812 LEDs controller."
    />
  ),
  tags: ['device', 'arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.ws2812pixels.name': 'WS2812 LEDs',
    'blocks.ws2812pixels.description': 'WS2812 LEDs controller.',
  },
  'zh-Hans': {
    'blocks.ws2812pixels.name': 'WS2812 彩灯',
    'blocks.ws2812pixels.description': 'WS2812 彩灯控制器。',
  },
  'zh-Hant': {
    'blocks.ws2812pixels.name': 'WS2812 彩燈',
    'blocks.ws2812pixels.description': 'WS2812 彩燈控制器。',
  },
});
