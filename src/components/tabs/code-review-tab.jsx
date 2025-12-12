import { Text } from '@blockcode/core';
import { CodeReview } from '../code-review/code-review';

import codeReviewIcon from './icon-code.svg';

export const codeReviewTab = {
  icon: codeReviewIcon,
  label: (
    <Text
      id="blocks.tabs.code"
      defaultMessage="Code"
    />
  ),
  Content: CodeReview,
};
