import codexpad from './codexpad.mpy';
import aioble from './aioble/__init__.mpy';
import central from './aioble/central.mpy';
import client from './aioble/client.mpy';
import core from './aioble/core.mpy';
import device from './aioble/device.mpy';
import l2cap from './aioble/l2cap.mpy';
import peripheral from './aioble/peripheral.mpy';
import security from './aioble/security.mpy';
import server from './aioble/server.mpy';

export const files = [
  { name: 'codexpad.mpy', type: 'text/x-python', uri: codexpad },
  { common: true, name: 'aioble/__init__.mpy', type: 'text/x-python', uri: aioble },
  { common: true, name: 'aioble/central.mpy', type: 'text/x-python', uri: central },
  { common: true, name: 'aioble/client.mpy', type: 'text/x-python', uri: client },
  { common: true, name: 'aioble/core.mpy', type: 'text/x-python', uri: core },
  { common: true, name: 'aioble/device.mpy', type: 'text/x-python', uri: device },
  { common: true, name: 'aioble/l2cap.mpy', type: 'text/x-python', uri: l2cap },
  { common: true, name: 'aioble/peripheral.mpy', type: 'text/x-python', uri: peripheral },
  { common: true, name: 'aioble/security.mpy', type: 'text/x-python', uri: security },
  { common: true, name: 'aioble/server.mpy', type: 'text/x-python', uri: server },
];
