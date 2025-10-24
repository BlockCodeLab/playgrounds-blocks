import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon-block.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.buzzer.name"
      defaultMessage="Buzzer"
    />
  ),
  description: (
    <Text
      id="blocks.buzzer.description"
      defaultMessage="Let creation speak for you."
    />
  ),
  tags: ['device', 'arduino', 'actuator'],
};

addLocalesMessages({
  en: {
    'blocks.buzzer.name': 'Buzzer',
    'blocks.buzzer.description': 'Let creation speak for you.',
  },
  'zh-Hans': {
    'blocks.buzzer.name': '蜂鸣器',
    'blocks.buzzer.description': '让造物为你发声。',
  },
  'zh-Hant': {
    'blocks.buzzer.name': '蜂鳴器',
    'blocks.buzzer.description': '讓造物為你發聲。',
  },
});
