import { AIInteractionContainer } from './AIInteractionContainer';
import React, {useEffect, useState} from 'react';
import styles from '../styles/ai_response.module.scss';
import clsx from 'clsx';
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";
import { dracula } from "@uiw/codemirror-theme-dracula";

interface Props {
  responseTitle: string;
  cornerLeftButtons?: React.ReactNode;
  code: string;
  lang: string;
  editable?: boolean;
  onCodeChange?: (value: string) => void;
  isUnderReview?: boolean;
}

export const AIResponse = ({ 
  responseTitle, 
  cornerLeftButtons, 
  code, 
  lang, 
  onCodeChange = () => {}, 
  editable = false,
  isUnderReview = false
}: Props) => {
  const countLines = (text: string): number => {
    return text.split("\n").length;
  }

  const calculateHeigh = (numLines: number) => {
      if (numLines <= 12) {
          return 240; // 240px for 0 to 12 lines
      } else if (numLines >= 34) {
          return 640; // max size for 34 lines or more
      } else {
          let incrementPerLines = (640 - 240) / (34 - 12);
          return 240 + (numLines - 13) * incrementPerLines;
      }
  }

  const [componentHeigh, setComponentHeigh] = useState(calculateHeigh(countLines(code)));

  useEffect(() => {
    setComponentHeigh(calculateHeigh(countLines(code)));
  }, [code]);

  return (
    <AIInteractionContainer
      interactionTitle={responseTitle}
      leftSideChildren={cornerLeftButtons}
    >
      <div className={clsx(styles.codeContainer)}>
          {
            isUnderReview && <div 
              className={styles.codeBlock} 
              style={{
                height: `${componentHeigh}px`,
                marginBottom: `${-componentHeigh}px`,
              }}
            />
          }
          <CodeMirror
            value={code}
            minHeight='240px'
            className={styles.codeMirror}
            extensions={lang === 'rust' ? [rust()] : [javascript()]}
            theme={dracula}
            editable={editable}
            onChange={(value, _) => {
              setComponentHeigh(calculateHeigh(countLines(value)));
              onCodeChange(value);
            }}
          />
      </div>
    </AIInteractionContainer>
  );
};
