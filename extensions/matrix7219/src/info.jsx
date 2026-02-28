import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
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
    'blocks.matrix7219.name': 'MAX7219 Matrix',
    'blocks.matrix7219.description': 'LED matrix using MAX7219.',
  },
  'zh-Hans': {
    'blocks.matrix7219.name': 'MAX7219 灯点阵',
    'blocks.matrix7219.description': '使用 MAX7219 的 LED 点阵。',
  },
  'zh-Hant': {
    'blocks.matrix7219.name': 'MAX7219 燈點陣',
    'blocks.matrix7219.description': '使用 MAX7219 的 LED 點陣。',
  },
});
