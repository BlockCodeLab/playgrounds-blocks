import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';
import { readme } from '../package.json';

export default {
  disabled: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.tts20.name"
      defaultMessage="TTS20"
    />
  ),
  description: (
    <Text
      id="blocks.tts20.description"
      defaultMessage="Speech synthesis module based on SNR9816."
    />
  ),
  collaborator: (
    <Text
      id="blocks.tts20.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['decive', 'arduino', 'module'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.tts20.name': 'TTS20',
    'blocks.tts20.description': 'Speech synthesis module based on SNR9816.',
    'blocks.tts20.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.tts20.name': 'TTS20 语音合成',
    'blocks.tts20.description': '基于 SNR9816 的语音合成模块。',
    'blocks.tts20.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.tts20.name': 'TTS20 語音合成',
    'blocks.tts20.description': '基於 SNR9816 的語音合成模組。',
    'blocks.tts20.collaborator': 'Emakefun',
  },
});
