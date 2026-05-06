import codexpad from './codexpad.py';
import aioble from './aioble/__init__.py';
import central from './aioble/central.py';
import client from './aioble/client.py';
import core from './aioble/core.py';
import device from './aioble/device.py';
import l2cap from './aioble/l2cap.py';
import peripheral from './aioble/peripheral.py';
import security from './aioble/security.py';
import server from './aioble/server.py';

export const files = [
  { name: 'codexpad.py', type: 'text/x-python', uri: codexpad },
  { common: true, name: 'aioble/__init__.py', type: 'text/x-python', uri: aioble },
  { common: true, name: 'aioble/central.py', type: 'text/x-python', uri: central },
  { common: true, name: 'aioble/client.py', type: 'text/x-python', uri: client },
  { common: true, name: 'aioble/core.py', type: 'text/x-python', uri: core },
  { common: true, name: 'aioble/device.py', type: 'text/x-python', uri: device },
  { common: true, name: 'aioble/l2cap.py', type: 'text/x-python', uri: l2cap },
  { common: true, name: 'aioble/peripheral.py', type: 'text/x-python', uri: peripheral },
  { common: true, name: 'aioble/security.py', type: 'text/x-python', uri: security },
  { common: true, name: 'aioble/server.py', type: 'text/x-python', uri: server },
];
