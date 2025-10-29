import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  preview: true,
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
    'blocks.temperature.description': 'Kinds temperature sensors.',
  },
  'zh-Hans': {
    'blocks.temperature.name': '温度模块',
    'blocks.temperature.description': '各种侦测温度的传感器。',
  },
  'zh-Hant': {
    'blocks.temperature.name': '溫度模組',
    'blocks.temperature.description': '各種偵測溫度的傳感器。',
  },
});
