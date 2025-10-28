import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.dht.name"
      defaultMessage="DHT"
    />
  ),
  description: (
    <Text
      id="blocks.dht.description"
      defaultMessage="DHT11/DHT22 Temperature and humidity."
    />
  ),
  tags: ['device', 'arduino', 'sensor'],
};

addLocalesMessages({
  en: {
    'blocks.dht.name': 'DHT',
    'blocks.dht.description': 'DHT11/DHT22 Temperature and humidity.',
  },
  'zh-Hans': {
    'blocks.dht.name': 'DHT 温湿度',
    'blocks.dht.description': '使用 DHT11/DHT22 温湿度传感器。',
  },
  'zh-Hant': {
    'blocks.dht.name': 'DHT 溫濕度',
    'blocks.dht.description': '使用 DHT11/DHT22 溫濕度傳感器。',
  },
});
