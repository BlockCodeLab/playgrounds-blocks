import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ainput.name"
      defaultMessage="Simple Sensors"
    />
  ),
  description: (
    <Text
      id="blocks.ainput.description"
      defaultMessage="Simple analog/digital sensors."
    />
  ),
  tags: ['device', 'arduino', 'sensor'],
};

addLocalesMessages({
  en: {
    'blocks.ainput.name': 'Simple Sensors',
    'blocks.ainput.description': 'Simple analog/digital sensors.',
  },
  'zh-Hans': {
    'blocks.ainput.name': '简单传感器',
    'blocks.ainput.description': '简单模拟/数字传感器。',
  },
  'zh-Hant': {
    'blocks.ainput.name': '簡單模擬傳感器',
    'blocks.ainput.description': '簡單模擬/數字傳感器。',
  },
});
