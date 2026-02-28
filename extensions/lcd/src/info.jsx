import { addLocalesMessages, Text } from '@blockcode/core';

import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.lcd.name"
      defaultMessage="LCD"
    />
  ),
  description: (
    <Text
      id="blocks.lcd.description"
      defaultMessage="I2C LCD module."
    />
  ),
  tags: ['arduino', 'display'],
};

addLocalesMessages({
  en: {
    'blocks.lcd.name': 'LCD',
    'blocks.lcd.description': 'I2C LCD module.',
  },
  'zh-Hans': {
    'blocks.lcd.name': 'LCD 显示屏',
    'blocks.lcd.description': 'I2C LCD 显示屏。',
  },
  'zh-Hant': {
    'blocks.lcd.name': 'LCD 顯示屏',
    'blocks.lcd.description': 'I2C LCD 顯示屏。',
  },
});
