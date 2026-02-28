import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.tm1650.name"
      defaultMessage="TM1650 4-Digit"
    />
  ),
  description: (
    <Text
      id="blocks.tm1650.description"
      defaultMessage="Display on 4-digit 7-segment."
    />
  ),
  tags: ['device', 'arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.tm1650.name': 'TM1650 4-Digit',
    'blocks.tm1650.description': 'Display on 4-digit 7-segment.',
  },
  'zh-Hans': {
    'blocks.tm1650.name': 'TM1650 四位数码管',
    'blocks.tm1650.description': '在四位数码管上显示。',
  },
  'zh-Hant': {
    'blocks.tm1650.name': 'TM1650 四位數碼管',
    'blocks.tm1650.description': '在四位數碼管上顯示。',
  },
});
