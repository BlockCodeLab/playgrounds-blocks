import { addLocalesMessages, Text } from '@blockcode/core';
import { readme } from '../package.json';
import featureImage from './feature.png';
import iconImage from './icon.svg';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.wirelesscodingkit.name"
      defaultMessage="Wireless Coding Kit"
    />
  ),
  description: (
    <Text
      id="blocks.wirelesscodingkit.description"
      defaultMessage="Wireless coding, Unlimited creativity."
    />
  ),
  collaborator: (
    <Text
      id="blocks.wirelesscodingkit.collaborator"
      defaultMessage="Emakefun"
    />
  ),
  tags: ['device', 'arduino', 'kit'],
  readme,
};

addLocalesMessages({
  en: {
    'blocks.wirelesscodingkit.name': 'Wireless Coding Kit',
    'blocks.wirelesscodingkit.description': 'Wireless coding, Unlimited creativity.',
    'blocks.wirelesscodingkit.collaborator': 'Emakefun',
  },
  'zh-Hans': {
    'blocks.wirelesscodingkit.name': '无线编程套装',
    'blocks.wirelesscodingkit.description': '无线编程，无限创意。',
    'blocks.wirelesscodingkit.collaborator': '易创空间',
  },
  'zh-Hant': {
    'blocks.wirelesscodingkit.name': '無線編程套裝',
    'blocks.wirelesscodingkit.description': '無線編程，無限創意。',
    'blocks.wirelesscodingkit.collaborator': 'Emakefun',
  },
});
