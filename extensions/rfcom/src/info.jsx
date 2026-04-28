import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.rfcom.name"
      defaultMessage="RF Communication"
    />
  ),
  description: (
    <Text
      id="blocks.rfcom.description"
      defaultMessage="Communicates via the nRF24L01+ wireless module."
    />
  ),
  tags: ['arduino', 'communication'],
};

addLocalesMessages({
  en: {
    'blocks.rfcom.name': 'RF Communication',
    'blocks.rfcom.description': 'Communicates via the nRF24L01+ wireless module.',
  },
  'zh-Hans': {
    'blocks.rfcom.name': 'RF 通讯',
    'blocks.rfcom.description': '通过 nRF24L01+ 无线模块进行通讯。',
  },
  'zh-Hant': {
    'blocks.rfcom.name': 'RF 通訊',
    'blocks.rfcom.description': '通過 nRF24L01+ 無線模塊進行通訊。',
  },
});
