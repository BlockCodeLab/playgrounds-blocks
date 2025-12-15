import { useEffect, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { useAppContext, useProjectContext, setAlert, delAlert, Text } from '@blockcode/core';
import { CodeEditor } from '@blockcode/code';

const hideAlert = () => delAlert('manual-coding');

const showAlert = () =>
  setAlert({
    id: 'manual-coding',
    mode: 'warn',
    message: (
      <Text
        id="blocks.alert.blockCoding"
        defaultMessage="Coding is disabled; code changes will not be saved."
      />
    ),
    onClose: hideAlert,
  });

export function CodeReview({ keyName, readOnly, onRegisterCompletionItems }) {
  const { tabIndex } = useAppContext();

  const { meta } = useProjectContext();

  useEffect(() => {
    if (!readOnly && tabIndex.value !== 0 && !meta.value.manualCoding) {
      showAlert();
    } else {
      hideAlert();
    }
  }, [readOnly, meta.value.manualCoding]);

  useEffect(() => hideAlert, []);

  return (
    <CodeEditor
      options={{
        minimap: {
          enabled: true,
        },
      }}
      keyName={keyName}
      readOnly={readOnly}
      onRegisterCompletionItems={onRegisterCompletionItems}
    />
  );
}
