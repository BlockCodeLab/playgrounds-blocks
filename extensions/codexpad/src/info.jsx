import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';

import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.codexpad.name"
      defaultMessage="CodexPad"
    />
  ),
  description: (
    <Text
      id="blocks.codexpad.description"
      defaultMessage="CodexPad-C10/S10 wireless gamepad."
    />
  ),
  collaborator: (
    <Text
      id="blocks.codexpad.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['device', 'controller', 'module'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.codexpad.name': 'CodexPad',
    'blocks.codexpad.description': 'CodexPad-C10/S10 wireless gamepad.',
    'blocks.codexpad.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.codexpad.name': 'CodexPad 无线手柄',
    'blocks.codexpad.description': 'CodexPad-C10/S10 无线手柄。',
    'blocks.codexpad.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.codexpad.name': 'CodexPad 無線手柄',
    'blocks.codexpad.description': 'CodexPad-C10/S10 無線手柄。',
    'blocks.codexpad.collaborator': 'Emakefun',
  },
});
