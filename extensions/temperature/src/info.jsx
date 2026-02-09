import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.temperature.name"
      defaultMessage="Temperature"
    />
  ),
  description: (
    <Text
      id="blocks.temperature.description"
      defaultMessage="Kinds temperature sensors."
    />
  ),
  tags: ['device', 'arduino', 'sensor'],
};

addLocalesMessages({
  en: {
    'blocks.temperature.name': 'Temperature',
    'blocks.temperature.description': 'LM35/NL50/SD8B20 temperature sensors.',
  },
  'zh-Hans': {
    'blocks.temperature.name': '温度模块',
    'blocks.temperature.description': '使用 LM35/NL50/SD8B20 温度传感器。',
  },
  'zh-Hant': {
    'blocks.temperature.name': '溫度模組',
    'blocks.temperature.description': '使用 LM35/NL50/SD8B20 溫度傳感器。',
  },
});
