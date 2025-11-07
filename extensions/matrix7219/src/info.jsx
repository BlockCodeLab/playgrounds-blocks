import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.matrix7219.name"
      defaultMessage="LED Matrix"
    />
  ),
  description: (
    <Text
      id="blocks.matrix7219.description"
      defaultMessage="LED matrix screen using MAX7219."
    />
  ),
  tags: ['device', 'arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.matrix7219.name': 'LED Matrix',
    'blocks.matrix7219.description': 'LED matrix screen using MAX7219.',
  },
  'zh-Hans': {
    'blocks.matrix7219.name': 'LED 点阵屏',
    'blocks.matrix7219.description': '使用 MAX7219 的 LED 点阵屏。',
  },
  'zh-Hant': {
    'blocks.matrix7219.name': 'LED 點陣屏',
    'blocks.matrix7219.description': '使用 MAX7219 的 LED 點陣屏。',
  },
});
