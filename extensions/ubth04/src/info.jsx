import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.ubth04.name"
      defaultMessage="UBT-H04"
    />
  ),
  description: (
    <Text
      id="blocks.ubth04.description"
      defaultMessage="UBTECH UBT-H04 servo."
    />
  ),
  collaborator: (
    <Text
      id="blocks.ubth04.collaborator"
      defaultMessage="UBTECH"
    />
  ),
  tags: ['arduino', 'actuator'],
};

// 多语言信息，只包含信息显示需要的多语言，积木的多语言另外添加
addLocalesMessages({
  en: {
    'blocks.ubth04.name': 'UBT-H04 Servo',
    'blocks.ubth04.description': 'UBTECH UBT-H04 servo.',
    'blocks.ubth04.collaborator': 'UBTECH',
  },
  'zh-Hans': {
    'blocks.ubth04.name': 'UBT-H04 舵机',
    'blocks.ubth04.description': 'UBTECH UBT-H04 舵机。',
    'blocks.ubth04.collaborator': 'UBTECH',
  },
  'zh-Hant': {
    'blocks.ubth04.name': 'UBT-H04 舵機',
    'blocks.ubth04.description': 'UBTECH UBT-H04 舵機。',
    'blocks.ubth04.collaborator': 'UBTECH ',
  },
});
