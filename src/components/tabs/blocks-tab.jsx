import { Text } from '@blockcode/core';
import { BlocksEditor } from '../blocks-editor/blocks-editor';

import blocksIcon from './icon-blocks.svg';

export const blocksTab = {
  icon: blocksIcon,
  label: (
    <Text
      id="blocks.tabs.blocks"
      defaultMessage="Blocks"
    />
  ),
  Content: BlocksEditor,
};
