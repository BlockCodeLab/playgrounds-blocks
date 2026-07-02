import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ainput.name"
      defaultMessage="Simple Inputs"
    />
  ),
  description: (
    <Text
      id="blocks.ainput.description"
      defaultMessage="Simple digital/analog/jokstick inputs or sensors."
    />
  ),
  tags: ['device', 'arduino', 'sensor', 'controller'],
};

addLocalesMessages({
  en: {
    'blocks.ainput.name': 'Simple Inputs',
    'blocks.ainput.description': 'Simple digital/analog/jokstick inputs or sensors.',
  },
  'zh-Hans': {
    'blocks.ainput.name': '简单输入',
    'blocks.ainput.description': '简单数字/模拟/摇杆输入和传感器。',
  },
  'zh-Hant': {
    'blocks.ainput.name': '簡單輸入',
    'blocks.ainput.description': '簡單數字/模擬/摇杆輸入和傳感器。',
  },
});
