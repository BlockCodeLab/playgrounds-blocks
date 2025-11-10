import stepperMotorPyUri from './stepper_motor.py';

export const files = (meta) => {
  if (meta.editor === '@blockcode/gui-arduino') {
    return [];
  }

  return [
    {
      name: 'stepper_motor',
      type: 'text/x-python',
      uri: stepperMotorPyUri,
    },
  ];
};
