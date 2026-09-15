import mpu6050Py from './mpu6050.py';
import mpu6050H from './ino/mpu6050.h';
import mpu6050Cpp from './ino/mpu6050.cpp';
import i2cDeviceH from './ino/I2cDevice.h';
import i2cDeviceCpp from './ino/I2cDevice.cpp';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta))
    return [
      {
        header: true,
        name: 'mpu6050.h',
        type: 'text/x-c',
        uri: mpu6050H,
      },
      {
        name: 'mpu6050.cpp',
        type: 'text/x-c',
        uri: mpu6050Cpp,
      },
      {
        name: 'I2cDevice.h',
        type: 'text/x-c',
        uri: i2cDeviceH,
      },
      {
        name: 'I2cDevice.cpp',
        type: 'text/x-c',
        uri: i2cDeviceCpp,
      },
    ];

  return [
    {
      header: true,
      name: 'mpu6050.py',
      type: 'text/x-python',
      uri: mpu6050Py,
    },
  ];
};
