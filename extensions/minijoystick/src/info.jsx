import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';

import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.minijoystick.name"
      defaultMessage="minijoystick"
    />
  ),
  description: (
    <Text
      id="blocks.minijoystick.description"
      defaultMessage="Mini-JoyStick controller with PH2.0."
    />
  ),
  collaborator: (
    <Text
      id="blocks.minijoystick.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['arduino', 'controller'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.minijoystick.name': 'Mini-JoyStick',
    'blocks.minijoystick.description': 'Mini-JoyStick controller with PH2.0.',
    'blocks.minijoystick.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.minijoystick.name': 'Mini-JoyStick 手柄',
    'blocks.minijoystick.description': 'PH2.0 接口 Mini-JoyStick 小手柄。',
    'blocks.minijoystick.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.minijoystick.name': 'Mini-JoyStick 手柄',
    'blocks.minijoystick.description': 'PH2.0 接口 Mini-JoyStick 小手柄。',
    'blocks.minijoystick.collaborator': 'Emakefun',
  },
});
