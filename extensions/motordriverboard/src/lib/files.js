import MS_PWMServoDriver_cpp from './files/MS_PWMServoDriver.cpp';
import MS_PWMServoDriver_h from './files/MS_PWMServoDriver.h';
import MotorDriver_cpp from './files/MotorDriver.cpp';
import MotorDriver_h from './files/MotorDriver.h';
import PinChangeInt_h from './files/PinChangeInt.h';
import PS2X_lib_cpp from './files/PS2X_lib.cpp';
import PS2X_lib_h from './files/PS2X_lib.h';

export const files = [
  {
    header: true,
    name: 'MotorDriver.h',
    type: 'text/x-c',
    uri: MotorDriver_h,
  },
  {
    name: 'MotorDriver.cpp',
    type: 'text/x-c',
    uri: MotorDriver_cpp,
  },
  {
    name: 'MS_PWMServoDriver.h',
    type: 'text/x-c',
    uri: MS_PWMServoDriver_h,
  },
  {
    name: 'MS_PWMServoDriver.cpp',
    type: 'text/x-c',
    uri: MS_PWMServoDriver_cpp,
  },
  {
    name: 'PinChangeInt.h',
    type: 'text/x-c',
    uri: PinChangeInt_h,
  },
  {
    header: true,
    name: 'PS2X_lib.h',
    type: 'text/x-c',
    uri: PS2X_lib_h,
  },
  {
    name: 'PS2X_lib.cpp',
    type: 'text/x-c',
    uri: PS2X_lib_cpp,
  },
];
