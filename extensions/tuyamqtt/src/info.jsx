import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  beta: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.tuyamqtt.name"
      defaultMessage="Tuya Link"
    />
  ),
  description: (
    <Text
      id="blocks.tuyamqtt.description"
      defaultMessage="The Tuya MQTT Service."
    />
  ),
  collaborator: (
    <Text
      id="blocks.tuyamqtt.collaborator"
      defaultMessage="Tuya"
    />
  ),
  tags: ['device', 'communication'],
  internetRequired: true,
};

addLocalesMessages({
  en: {
    'blocks.tuyamqtt.name': 'Tuya Link',
    'blocks.tuyamqtt.description': 'The Tuya MQTT Service.',
    'blocks.tuyamqtt.collaborator': 'Tuya',
  },
  'zh-Hans': {
    'blocks.tuyamqtt.name': '涂鸦 Link',
    'blocks.tuyamqtt.description': '接入涂鸦 MQTT 服务。',
    'blocks.tuyamqtt.collaborator': '涂鸦',
  },
  'zh-Hant': {
    'blocks.tuyamqtt.name': '涂鸦 Link',
    'blocks.tuyamqtt.description': '接入塗鴉 MQTT 服務。',
    'blocks.tuyamqtt.collaborator': 'Tuya',
  },
});
