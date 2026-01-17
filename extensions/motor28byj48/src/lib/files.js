import stepperMotorPyUri from './files/stepper_motor.py';
import stepperMotorHUri from './files/stepper_motor.h';
import stepperMotorCppUri from './files/stepper_motor.cpp';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
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
