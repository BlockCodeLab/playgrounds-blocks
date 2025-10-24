import { resolve, dirname } from 'node:path';
import { readExtensions } from './read-extensions' with { type: 'macro' };

const extensions = readExtensions();

export default function () {
  // 读取本地扩展积木信息
  let locals = [];
  if (window.electron?.localBlocks) {
    locals = Object.values(window.electron.localBlocks);
  }
  return Promise.all(
    [].concat(
      locals.map(async (ext) => {
        const { default: info } = await import(ext.info);
        info.id = ext.id;
        info.icon = resolve(dirname(ext.info), info.icon);
        info.image = resolve(dirname(ext.info), info.image);
        return info;
      }),
      extensions.map(async (id) => {
        const { default: info } = await import(`${id}/info`);
        info.id = id;
        return info;
      }),
    ),
  );
}
