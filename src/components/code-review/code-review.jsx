import { useEffect, useCallback } from 'preact/hooks';
import { useAppContext, useProjectContext, setAlert, delAlert, setMeta, Text } from '@blockcode/core';
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
    button: {
      label: (
        <Text
          id="blocks.alert.openManualCoding"
          defaultMessage="Turn on Coding Mode"
        />
      ),
      onClick() {
        setMeta('manualCoding', true);
      },
    },
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
