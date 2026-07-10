import { pathResolve } from '@blockcode/utils';
import { readExtensions } from './read-extensions' with { type: 'macro' };

const extensions = readExtensions();

export default function () {
  // 读取本地扩展积木信息
  const locals = window.electron?.getLocalBlocks() ?? [];
  return Promise.all(
    [].concat(
      Object.values(locals).map(async (ext) => {
        const { default: info } = await import(ext.info);
        return {
          ...info,
          id: ext.id,
          icon: pathResolve(ext.basepath, info.icon),
          image: pathResolve(ext.basepath, info.image),
          tags: [...info.tags, 'custom'],
        };
      }),
      extensions.map(async (id) => {
        const { default: info } = await import(`${id}/info`);
        info.id = id;
        return info;
      }),
    ),
  );
}
