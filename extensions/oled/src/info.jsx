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
      defaultMessage="OLED Display"
    />
  ),
  description: (
    <Text
      id="blocks.oled.description"
      defaultMessage="SSD1306/SSD1315 I2C monochrome OLED."
    />
  ),
  tags: ['arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.oled.name': 'OLED Display',
    'blocks.oled.description': 'SSD1306/SSD1315 I2C monochrome OLED display.',
  },
  'zh-Hans': {
    'blocks.oled.name': 'OLED 显示屏',
    'blocks.oled.description': 'SSD1306/SSD1315 I2C 单色 OLED 显示屏。',
  },
  'zh-Hant': {
    'blocks.oled.name': 'OLED 顯示屏',
    'blocks.oled.description': 'SSD1306/SSD1315 I2C 單色 OLED 顯示屏。',
  },
});
