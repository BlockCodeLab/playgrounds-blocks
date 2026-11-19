import { addLocalesMessages, Text } from '@blockcode/core';

import featureImage from './feature.png';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.encodermotor.name"
      defaultMessage="Encoder Motor"
    />
  ),
  description: (
    <Text
      id="blocks.encodermotor.description"
      defaultMessage="Encoder motor library."
    />
  ),
  tags: ['device', 'actuator'],
};

addLocalesMessages({
  en: {
    'blocks.encodermotor.name': 'Encoder Motor',
    'blocks.encodermotor.description': 'Encoder motor library.',
  },
  'zh-Hans': {
    'blocks.encodermotor.name': '编码电机',
    'blocks.encodermotor.description': '通用编码电机。',
  },
  'zh-Hant': {
    'blocks.encodermotor.name': '編碼電機',
    'blocks.encodermotor.description': '通用編碼電機。',
  },
});
