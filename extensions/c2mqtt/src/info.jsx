import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';
import { readme } from '../package.json';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.c2mqtt.name"
      defaultMessage="ESP32C2 MQTT"
    />
  ),
  description: (
    <Text
      id="blocks.c2mqtt.description"
      defaultMessage="IoT communication module based on ESP32C2."
    />
  ),
  collaborator: (
    <Text
      id="blocks.c2mqtt.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'module'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.c2mqtt.name': 'ESP32C2 MQTT',
    'blocks.c2mqtt.description': 'IoT communication module based on ESP32C2.',
    'blocks.c2mqtt.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.c2mqtt.name': 'ESP32C2 MQTT',
    'blocks.c2mqtt.description': '基于 ESP32C2 的物联网通信模块。',
    'blocks.c2mqtt.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.c2mqtt.name': 'ESP32C2 MQTT',
    'blocks.c2mqtt.description': '基於 ESP32C2 的物聯網通信模塊。',
    'blocks.c2mqtt.collaborator': 'Emakefun',
  },
});
