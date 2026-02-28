import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.bmx280.name"
      defaultMessage="BMx280"
    />
  ),
  description: (
    <Text
      id="blocks.bmx280.description"
      defaultMessage="Atmospheric pressure using BMP280/BME280."
    />
  ),
  tags: ['device', 'arduino', 'sensor'],
};

addLocalesMessages({
  en: {
    'blocks.bmx280.name': 'BMx280',
    'blocks.bmx280.description': 'Atmospheric pressure using BMP280/BME280.',
  },
  'zh-Hans': {
    'blocks.bmx280.name': 'BMx280 气压',
    'blocks.bmx280.description': '使用 BMP280/BME280 测量大气压。',
  },
  'zh-Hant': {
    'blocks.bmx280.name': 'BMx280 氣壓',
    'blocks.bmx280.description': '使用 BMP280/BME280 測量大氣壓。',
  },
});
