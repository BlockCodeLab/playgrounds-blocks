import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.matrixkeypad.name"
      defaultMessage="Matrix Keypad"
    />
  ),
  description: (
    <Text
      id="blocks.matrixkeypad.description"
      defaultMessage="4×4 matrix keypad using VK36N16I."
    />
  ),
  collaborator: (
    <Text
      id="blocks.matrixkeypad.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'controller'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.matrixkeypad.name': 'Matrix Keypad',
    'blocks.matrixkeypad.description': '4×4 matrix keypad using VK36N16I.',
    'blocks.matrixkeypad.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.matrixkeypad.name': '矩阵键盘',
    'blocks.matrixkeypad.description': '使用 VK36N16I 芯片的 4×4 矩阵键盘。',
    'blocks.matrixkeypad.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.matrixkeypad.name': '矩陣鍵盤',
    'blocks.matrixkeypad.description': '使用 VK36N16I 芯片的 4×4 觸摸鍵盤。',
    'blocks.matrixkeypad.collaborator': 'Emakefun',
  },
});
