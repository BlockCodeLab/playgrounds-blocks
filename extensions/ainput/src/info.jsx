import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ainput.name"
      defaultMessage="Analog Input"
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
    'blocks.ainput.name': 'Analog Input',
    'blocks.ainput.description': 'Device input analog value.',
  },
  'zh-Hans': {
    'blocks.ainput.name': '模拟输入',
    'blocks.ainput.description': '输入模拟值的设备。',
  },
  'zh-Hant': {
    'blocks.ainput.name': '模擬輸入',
    'blocks.ainput.description': '輸入模擬值的設備。',
  },
});
