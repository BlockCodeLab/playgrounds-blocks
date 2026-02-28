import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.touchpiano.name"
      defaultMessage="Touch Piano"
    />
  ),
  description: (
    <Text
      id="blocks.touchpiano.description"
      defaultMessage="8-key piano keyboard using TTP229."
    />
  ),
  collaborator: (
    <Text
      id="blocks.touchpiano.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'controller'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.touchpiano.name': 'Touch Piano',
    'blocks.touchpiano.description': '8-key piano keyboard using TTP229.',
    'blocks.touchpiano.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.touchpiano.name': '触摸钢琴',
    'blocks.touchpiano.description': '使用 TTP229 的 8 琴键钢琴键盘。',
    'blocks.touchpiano.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.touchpiano.name': '觸摸鋼琴',
    'blocks.touchpiano.description': '使用 TTP229 的 8 琴鍵觸摸鍵盤。',
    'blocks.touchpiano.collaborator': 'Emakefun',
  },
});
