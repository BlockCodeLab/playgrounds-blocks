import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.switchkey.name"
      defaultMessage="Key Input"
    />
  ),
  description: (
    <Text
      id="blocks.switchkey.description"
      defaultMessage="Button control input."
    />
  ),
  tags: ['device', 'arduino', 'controller'],
};

addLocalesMessages({
  en: {
    'blocks.switchkey.name': 'Key Input',
    'blocks.switchkey.description': 'Button control input.',
  },
  'zh-Hans': {
    'blocks.switchkey.name': '按键输入',
    'blocks.switchkey.description': '按键控制输入。',
  },
  'zh-Hant': {
    'blocks.switchkey.name': '按鍵輸入',
    'blocks.switchkey.description': '按鍵控制輸入。',
  },
});
