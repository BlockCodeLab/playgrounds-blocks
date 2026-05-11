import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  beta: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.rtci2c.name"
      defaultMessage="RTC"
    />
  ),
  description: (
    <Text
      id="blocks.rtci2c.description"
      defaultMessage="DS1307/DS3231/PCF8563/PCF8523/ MCP7940 I2C based RTCs."
    />
  ),
  tags: ['device', 'arduino', 'module'],
};

addLocalesMessages({
  en: {
    'blocks.rtci2c.name': 'RTC',
    'blocks.rtci2c.description': 'DS1307/DS3231/PCF8563/PCF8523/ MCP7940 I2C based RTCs.',
  },
  'zh-Hans': {
    'blocks.rtci2c.name': '时钟模块',
    'blocks.rtci2c.description': '基于 I2C 的时钟模块，支持 DS1307/ DS3231/PCF8563/PCF8523/MCP7940。',
  },
  'zh-Hant': {
    'blocks.rtci2c.name': '時鐘模塊',
    'blocks.rtci2c.description': '基於 I2C 的时钟模块，支持 DS1307/ DS3231/PCF8563/PCF8523/MCP7940。',
  },
});
