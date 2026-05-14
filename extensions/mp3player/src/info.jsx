import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.mp3player.name"
      defaultMessage="MP3 Player"
    />
  ),
  description: (
    <Text
      id="blocks.mp3player.description"
      defaultMessage="MP3 player using GD5800."
    />
  ),
  collaborator: (
    <Text
      id="blocks.mp3player.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'module'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.mp3player.name': 'MP3 Player',
    'blocks.mp3player.description': 'MP3 player using GD5800.',
    'blocks.mp3player.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.mp3player.name': 'MP3 播放器',
    'blocks.mp3player.description': '使用 GD5800 芯片的 MP3 播放器。',
    'blocks.mp3player.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.mp3player.name': 'MP3 播放器',
    'blocks.mp3player.description': '使用 GD5800 晶片的 MP3 播放器。',
    'blocks.mp3player.collaborator': 'Emakefun',
  },
});
