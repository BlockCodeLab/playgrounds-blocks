import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.encoder.name"
      defaultMessage="Encoder"
    />
  ),
  description: (
    <Text
      id="blocks.encoder.description"
      defaultMessage="AB Signal Rotary Encoder."
    />
  ),
  tags: ['device', 'arduino', 'controller'],
};

addLocalesMessages({
  en: {
    'blocks.encoder.name': 'Encoder',
    'blocks.encoder.description': 'AB Signal Rotary Encoder.',
  },
  'zh-Hans': {
    'blocks.encoder.name': '旋转编码器',
    'blocks.encoder.description': 'AB信号旋转编码器。',
  },
  'zh-Hant': {
    'blocks.encoder.name': '旋轉編碼器',
    'blocks.encoder.description': 'AB信號旋轉編碼器。',
  },
});
