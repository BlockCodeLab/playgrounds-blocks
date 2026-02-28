import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';

import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.aivoxassistant.name"
      defaultMessage="AI Vox Assistant"
    />
  ),
  description: (
    <Text
      id="blocks.aivoxassistant.description"
      defaultMessage="Control devices using natural language."
    />
  ),
  collaborator: (
    <Text
      id="blocks.aivoxassistant.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['device', 'arduino', 'module'],
  readme,
};

// 多语言信息，只包含信息显示需要的多语言，积木的多语言另外添加
addLocalesMessages({
  en: {
    'blocks.aivoxassistant.name': 'AI Vox Assistant',
    'blocks.aivoxassistant.description': 'Control devices using natural language.',
    'blocks.aivoxassistant.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.aivoxassistant.name': 'AI 语音助手',
    'blocks.aivoxassistant.description': '通过自然语言发出控制设备的指令。',
    'blocks.aivoxassistant.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.aivoxassistant.name': 'AI 語音助手',
    'blocks.aivoxassistant.description': '通過自然語言發出控制設備的指令。',
    'blocks.aivoxassistant.collaborator': 'Emakefun',
  },
});
