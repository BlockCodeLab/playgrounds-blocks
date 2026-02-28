import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.tm1637.name"
      defaultMessage="TM1637 Clock"
    />
  ),
  description: (
    <Text
      id="blocks.tm1637.description"
      defaultMessage="Display on 4-digit clock."
    />
  ),
  tags: ['device', 'arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.tm1637.name': 'TM1637 Clock',
    'blocks.tm1637.description': 'Display on 4-digit clock.',
  },
  'zh-Hans': {
    'blocks.tm1637.name': 'TM1637 时钟数码管',
    'blocks.tm1637.description': '在时钟数码管上显示时间。',
  },
  'zh-Hant': {
    'blocks.tm1637.name': 'TM1637 時鐘數碼管',
    'blocks.tm1637.description': '在時鐘數碼管上顯示時間。',
  },
});
