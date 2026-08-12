import tuyaclient from './mpy/tuyaclient.py';
import hmac from './mpy/hmac.py';
import mqtt from './mpy/mqtt.py';

export const files = [
  {
    header: true,
    name: 'tuyaclient.py',
    uri: tuyaclient,
  },
  {
    common: true,
    name: 'hmac.py',
    uri: hmac,
  },
  {
    common: true,
    name: 'umqtt/simple.py',
    uri: mqtt,
  },
];
