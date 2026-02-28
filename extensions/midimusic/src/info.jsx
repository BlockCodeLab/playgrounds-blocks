import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';

import featureImage from './feature.png';
import iconImage from './icon-block.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.midimusic.name"
      defaultMessage="MIDI Music"
    />
  ),
  description: (
    <Text
      id="blocks.midimusic.description"
      defaultMessage="The music synthesis module based on MIDI 2.0."
    />
  ),
  collaborator: (
    <Text
      id="blocks.midimusic.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'module'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.midimusic.name': 'MIDI Music',
    'blocks.midimusic.description': 'The music synthesis module based on MIDI 2.0.',
    'blocks.midimusic.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.midimusic.name': 'MIDI 音乐',
    'blocks.midimusic.description': '基于 MIDI 2.0 的专业音乐合成模块。',
    'blocks.midimusic.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.midimusic.name': 'MIDI 音樂',
    'blocks.midimusic.description': '基於 MIDI 2.0 的專業音樂合成模模組。',
    'blocks.midimusic.collaborator': 'Emakefun',
  },
});
