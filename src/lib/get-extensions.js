import { resolve, dirname } from 'node:path';
import { readExtensions } from './read-extensions' with { type: 'macro' };

const extensions = readExtensions();

export default function () {
  // 读取本地扩展积木信息
  const locals = window.electron?.getLocalBlocks() ?? [];
  return Promise.all(
    [].concat(
      Object.values(locals).map(async (ext) => {
        const { default: info } = await import(ext.info);
        info.id = ext.id;
        info.icon = resolve(dirname(ext.info), info.icon);
        info.image = resolve(dirname(ext.info), info.image);
        info.tags.push('custom');
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
