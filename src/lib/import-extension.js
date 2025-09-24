import { batch } from '@preact/signals';
import { addAsset } from '@blockcode/core';

const escape = (name) => name.replaceAll(/[^a-z0-9]/gi, '_');

export async function importExtension(meta, extId) {
  const { default: extObj } = await import(extId);
  extObj.id = extId;

  // 载入扩展附带的静态文件（库文件）
  if (extObj.files) {
    const assets = [];
    const files = typeof extObj.files === 'function' ? extObj.files(meta) : extObj.files;
    for (const file of files) {
      const asset = Object.assign(file, {
        id: file.name,
        content: await fetch(file.uri).then((res) => res.arrayBuffer()),
      });
      // micropython 库文件
      if (file.type === 'text/x-python') {
        asset.id = file.common
          ? `lib/${file.name}` // 公共文件
          : `lib/${escape(extId)}/${file.name}`;
      }
      assets.push(asset);
    }
    batch(() => {
      for (const asset of assets) {
        addAsset(asset);
      }
    });
  }

  return extObj;
}
