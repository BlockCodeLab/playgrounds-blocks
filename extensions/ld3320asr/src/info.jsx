import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.svg';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ld3320asr.name"
      defaultMessage="Speech Recognition"
    />
  ),
  description: (
    <Text
      id="blocks.ld3320asr.description"
      defaultMessage="Speech Recognition using LD3320."
    />
  ),
  collaborator: (
    <Text
      id="blocks.ld3320asr.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['device', 'arduino', 'module'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.ld3320asr.name': 'Speech Recognition',
    'blocks.ld3320asr.description': 'Speech Recognition using LD3320.',
    'blocks.ld3320asr.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.ld3320asr.name': '语音识别',
    'blocks.ld3320asr.description': '使用 LD3320 芯片的语音识别模块。',
    'blocks.ld3320asr.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.ld3320asr.name': '語音識別',
    'blocks.ld3320asr.description': '使用 LD3320 芯片的語音識別模塊。',
    'blocks.ld3320asr.collaborator': 'Emakefun',
  },
});
