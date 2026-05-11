import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.svg';
import iconImage from './icon.svg';

export default {
  beta: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.qmc5883l.name"
      defaultMessage="QMC5883L Compass"
    />
  ),
  description: (
    <Text
      id="blocks.qmc5883l.description"
      defaultMessage="Compass module base on QMC5883L."
    />
  ),
  tags: ['device', 'arduino', 'module'],
};

addLocalesMessages({
  en: {
    'blocks.qmc5883l.name': 'QMC5883L Compass',
    'blocks.qmc5883l.description': 'Compass module base on QMC5883L.',
  },
  'zh-Hans': {
    'blocks.qmc5883l.name': 'QMC5883L 指南针',
    'blocks.qmc5883l.description': '基于 QMC5883L 的指南针模块。',
  },
  'zh-Hant': {
    'blocks.qmc5883l.name': 'QMC5883L 指南針',
    'blocks.qmc5883l.description': '基於 QMC5883L 的指南針模塊。',
  },
});
