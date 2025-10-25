import { useCallback, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { setAlert, delAlert, Text, Library } from '@blockcode/core';
import styles from './extensions-library.module.css';
import plusIcon from './icon-plus.svg';

import getExtensions from '../../lib/get-extensions';

export function ExtensionsLibrary({ tags, disableCustom, onSelect, onClose, onFilter }) {
  const data = useSignal([]);

  const handleFilter = useCallback(
    (info) => {
      if (info.hidden) {
        return false;
      }

      // 正式版本不显示禁用或beta
      if (!BETA && !DEBUG && (info.beta || info.disabled)) {
        return false;
      }

      // 没有标签的不过滤
      const tags = info.tags;
      if (!tags) {
        return true;
      }

      let result = true; // 不过滤
      if (onFilter) {
        result = onFilter(tags);
      }
      if (Array.isArray(result)) {
        // [some-tag, [every-tag, every-tag], some-tag]
        return result.some((subfilter) => {
          if (Array.isArray(subfilter)) {
            return subfilter.every((item) => (item[0] === '!' ? !tags.includes(item.slice(1)) : tags.includes(item)));
          }
          return tags.includes(subfilter);
        });
      }
      return result;
    },
    [onFilter],
  );

  const updateExtensions = useCallback(async () => {
    let result = await getExtensions();
    result = result.map((info) =>
      Object.assign(info, {
        beta: info.beta || (DEBUG && info.disabled), // 正式版 beta 显示为禁用，DEBUG 时禁用也显示为 beta
        disabled: !DEBUG && (info.disabled || (!BETA && info.beta)), // DEBUG 时没有禁用，正式版 beta 也显示为禁用
        uri: info.readme,
        onSelect: () => {
          onSelect(info.id);
          onClose();
        },
      }),
    );
    result = result.filter(handleFilter);

    // 离线版能显示自定义积木添加按钮
    if (window.electron) {
      result.unshift({
        eeggTag: 'custom',
        className: styles.addCustomButton,
        custom: <img src={plusIcon} />,
        async onSelect() {
          const id = setAlert('importing');
          await window.electron.loadBlocksZip();
          updateExtensions();
          delAlert(id);
        },
      });
    }

    data.value = result;
  }, []);
  useEffect(updateExtensions, []);

  // 离线版能显示自定义积木分类
  if (window.electron && !disableCustom) {
    tags = tags || [];
    tags.push({
      tag: 'custom',
      label: (
        <Text
          id="blocks.extensions.custom"
          defaultMessage="Custom"
        />
      ),
    });
  }

  return (
    <Library
      featured
      filterable
      tags={tags}
      items={data.value}
      filterPlaceholder={
        <Text
          id="gui.library.search"
          defaultMessage="Search"
        />
      }
      title={
        <Text
          id="blocks.extensions.addExtension"
          defaultMessage="Add Extension"
        />
      }
      emptyMessage={
        <Text
          id="blocks.extensions.empty"
          defaultMessage="No extension!"
        />
      }
      onClose={onClose}
    />
  );
}
