import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.colors.name"
      defaultMessage="Color Sensor"
    />
  ),
  description: (
    <Text
      id="blocks.colors.description"
      defaultMessage="TCS34725/NLCS11 color sensor."
    />
  ),
  tags: ['arduino', 'sensor'],
};

addLocalesMessages({
  en: {
    'blocks.colors.name': 'Color Sensor',
    'blocks.colors.description': 'TCS34725/NLCS11 color sensor.',
  },
  'zh-Hans': {
    'blocks.colors.name': '颜色识别',
    'blocks.colors.description': '使用 TCS34725/NLCS11 颜色传感器。',
  },
  'zh-Hant': {
    'blocks.colors.name': '顏色識別',
    'blocks.colors.description': '使用 TCS34725/NLCS11 顏色传感器。',
  },
});
