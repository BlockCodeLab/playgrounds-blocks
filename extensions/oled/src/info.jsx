import { addLocalesMessages, Text } from '@blockcode/core';

import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  disabled: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.oled.name"
      defaultMessage="OLED"
    />
  ),
  description: (
    <Text
      id="blocks.oled.description"
      defaultMessage="OLED"
    />
  ),
  tags: ['arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.oled.name': 'OLED',
    'blocks.oled.description': 'SSD1306/SSD1315 I2C Monochrome OLED.',
  },
  'zh-Hans': {
    'blocks.oled.name': 'OLED',
    'blocks.oled.description': 'SSD1306/SSD1315 I2C 单色 OLED 屏幕。',
  },
  'zh-Hant': {
    'blocks.oled.name': 'OLED',
    'blocks.oled.description': 'SSD1306/SSD1315 I2C 單色 OLED 屏幕。',
  },
});
