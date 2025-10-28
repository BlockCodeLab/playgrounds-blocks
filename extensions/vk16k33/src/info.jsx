import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  beta: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.vk16k33.name"
      defaultMessage="VK16K33 4-Digit"
    />
  ),
  description: (
    <Text
      id="blocks.vk16k33.description"
      defaultMessage="Display on 4-digit 7-segment."
    />
  ),
  tags: ['device', 'arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.vk16k33.name': 'VK16K33 4-Digit',
    'blocks.vk16k33.description': 'Display on 4-digit 7-segment.',
  },
  'zh-Hans': {
    'blocks.vk16k33.name': 'VK16K33 四位数码管',
    'blocks.vk16k33.description': '在四位数码管上显示。',
  },
  'zh-Hant': {
    'blocks.vk16k33.name': 'VK16K33 四位數碼管',
    'blocks.vk16k33.description': '在四位數碼管上顯示。',
  },
});
