import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ainput.name"
      defaultMessage="Analog Values"
    />
  ),
  description: (
    <Text
      id="blocks.ainput.description"
      defaultMessage="Device input analog value."
    />
  ),
  tags: ['device', 'arduino', 'controller'],
};

addLocalesMessages({
  en: {
    'blocks.ainput.name': 'Analog Values',
    'blocks.ainput.description': 'Device input analog values.',
  },
  'zh-Hans': {
    'blocks.ainput.name': '模拟值转换',
    'blocks.ainput.description': '设备输入的模拟值。',
  },
  'zh-Hant': {
    'blocks.ainput.name': '模擬值轉換',
    'blocks.ainput.description': '設備輸入的模擬值。',
  },
});
