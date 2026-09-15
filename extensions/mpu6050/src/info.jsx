import { addLocalesMessages, Text } from '@blockcode/core';
import featureImage from './feature.png';
import iconImage from './icon.png';

export default {
  beta: true,
  image: featureImage,
  icon: iconImage,
  name: (
    <Text
      id="blocks.mpu6050.name"
      defaultMessage="MPU6050"
    />
  ),
  description: (
    <Text
      id="blocks.mpu6050.description"
      defaultMessage="MPU6050 6-axis gyroscope."
    />
  ),
  tags: ['device', 'arduino', 'module'],
};

addLocalesMessages({
  en: {
    'blocks.mpu6050.name': 'MPU6050',
    'blocks.mpu6050.description': 'MPU6050 6-axis gyroscope.',
  },
  'zh-Hans': {
    'blocks.mpu6050.name': 'MPU6050 陀螺仪',
    'blocks.mpu6050.description': '基于 mpu6050 的六轴陀螺仪。',
  },
  'zh-Hant': {
    'blocks.mpu6050.name': 'MPU6050 陀螺儀',
    'blocks.mpu6050.description': '基於 mpu6050 的六軸陀螺儀。',
  },
});
