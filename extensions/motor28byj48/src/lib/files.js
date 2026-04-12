import stepperMotorPyUri from './files/stepper_motor.py';
import stepperMotorHUri from './files/stepper_motor.h';
import stepperMotorCppUri from './files/stepper_motor.cpp';

const isArduino = (meta) => ['@blockcode/gui-arduino', '@nulllab/gui-lgtuino'].includes(meta.editor);

export const files = (meta) => {
  if (isArduino(meta)) {
    return [
      {
        header: true,
        name: 'stepper_motor.h',
        type: 'text/x-c',
        uri: stepperMotorHUri,
      },
      {
        name: 'stepper_motor.cpp',
        type: 'text/x-c',
        uri: stepperMotorCppUri,
      },
    ];
  }

  return [
    {
      name: 'stepper_motor',
      type: 'text/x-python',
      uri: stepperMotorPyUri,
    },
  ];
};
