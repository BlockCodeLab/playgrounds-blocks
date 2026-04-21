import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.sentry.name"
      defaultMessage="Sentry/Sengo Vision"
    />
  ),
  description: (
    <Text
      id="blocks.sentry.description"
      defaultMessage="Intelligent Vision Sensor."
    />
  ),
  collaborator: (
    <Text
      id="blocks.sentry.collaborator"
      defaultMessage="AITosee"
    />
  ),
  tags: ['device', 'arduino', 'module'],
};

addLocalesMessages({
  en: {
    'blocks.sentry.name': 'Sentry/Sengo Vision',
    'blocks.sentry.description': 'Intelligent Vision Sensor.',
    'blocks.sentry.collaborator': '瞳芯智能',
  },
  'zh-Hans': {
    'blocks.sentry.name': 'Sentry/Sengo 视觉',
    'blocks.sentry.description': '智能视觉传感器。',
    'blocks.sentry.collaborator': '瞳芯智能',
  },
  'zh-Hant': {
    'blocks.sentry.name': 'Sentry/Sengo 視覺',
    'blocks.sentry.description': '智能視覺傳感器。',
    'blocks.sentry.collaborator': '瞳芯智能',
  },
});
