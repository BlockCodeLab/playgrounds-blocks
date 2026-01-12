import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  preview: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.infraredcom.name"
      defaultMessage="Infrared Communication"
    />
  ),
  description: (
    <Text
      id="blocks.infraredcom.description"
      defaultMessage="Wireless communication via infrared."
    />
  ),
  tags: ['arduino', 'communication'],
};

addLocalesMessages({
  en: {
    'blocks.infraredcom.name': 'Infrared Communication',
    'blocks.infraredcom.description': 'Wireless communication via infrared.',
  },
  'zh-Hans': {
    'blocks.infraredcom.name': '红外线通讯',
    'blocks.infraredcom.description': '通过红外线进行无线通讯。',
  },
  'zh-Hant': {
    'blocks.infraredcom.name': '紅外線通訊',
    'blocks.infraredcom.description': '通過紅外線進行無線通訊。',
  },
});
