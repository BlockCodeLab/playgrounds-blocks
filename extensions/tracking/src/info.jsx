import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.tracking.name"
      defaultMessage="Tracking"
    />
  ),
  description: (
    <Text
      id="blocks.tracking.description"
      defaultMessage="Infrared and grayscale tracking."
    />
  ),
  collaborator: (
    <Text
      id="blocks.tracking.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['device', 'arduino', 'sensor'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.tracking.name': 'Tracking',
    'blocks.tracking.description': 'Infrared and grayscale tracking.',
    'blocks.tracking.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.tracking.name': '循迹模块',
    'blocks.tracking.description': '红外和灰度循迹模块。',
    'blocks.tracking.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.tracking.name': '循跡模組',
    'blocks.tracking.description': '紅外和灰度循跡模組。',
    'blocks.tracking.collaborator': 'Emakefun',
  },
});
