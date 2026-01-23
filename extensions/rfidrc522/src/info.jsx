import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.rfidrc522.name"
      defaultMessage="RFID"
    />
  ),
  description: (
    <Text
      id="blocks.rfidrc522.description"
      defaultMessage="RFID."
    />
  ),
  tags: ['arduino', 'module'],
};

addLocalesMessages({
  en: {
    'blocks.rfidrc522.name': 'RFID',
    'blocks.rfidrc522.description': 'Driver for RFID RC522 based module.',
  },
  'zh-Hans': {
    'blocks.rfidrc522.name': 'RFID 模块',
    'blocks.rfidrc522.description': '基于 RC522 的 RFID 模块驱动。',
  },
  'zh-Hant': {
    'blocks.rfidrc522.name': 'RFID 模組',
    'blocks.rfidrc522.description': '基於 RC522 的 RFID 模組驅動。',
  },
});
