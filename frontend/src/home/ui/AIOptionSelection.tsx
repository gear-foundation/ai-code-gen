import { GrayContainer } from '@/shared/ui/Containers/GrayContainer/GrayContainer';
import { WhiteContainer } from '@/shared/ui/Containers/WhiteContainer/WhiteContainer';
import { useState } from 'react';
import type { AIPromptOptions } from '../models/ai_options';
import styles from '../styles/ai_option_selection.module.scss';
import clsx from 'clsx';

interface Props {
    options: string[];
    currentSelected: AIPromptOptions;
    waitingForResponse?: boolean;
    selected?: (name: string, id: AIPromptOptions) => void;
}

const whiteContainerStyles = {
  display: 'flex', 
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '10.5rem',
  transition: 'all ease-in-out 0.2s'
};

export const AIOptionSelection = ({ options, currentSelected, waitingForResponse = false, selected = (name: string, id: AIPromptOptions) => {} }: Props) => {
  const [optionSelected, setOptionSelected] = useState<AIPromptOptions>(currentSelected);

  return (
    <div>
        <GrayContainer 
          style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '3px', 
            gap: '20px',
          }}
        >
          {
            options.map((value, index) => (
              <WhiteContainer 
                key={index}
                onClick={() => {
                  if (waitingForResponse) return;
                  setOptionSelected(options[index] as AIPromptOptions);
                  selected(value, options[index] as AIPromptOptions);
                }}
                style={
                  optionSelected == options[index] as AIPromptOptions
                    ? whiteContainerStyles
                    : { 
                        ...whiteContainerStyles,  
                        background: 'none',
                        boxShadow: 'none',
                        cursor: waitingForResponse ? 'not-allowed' : 'pointer',
                      }
                }
              >
                <p
                  className={clsx(
                    styles.text,
                    (optionSelected != options[index] as AIPromptOptions) && styles.textUnSelected,
                    (optionSelected != options[index] as AIPromptOptions) && waitingForResponse && styles.cursorNotAllowed
                  )}
                >
                  {value}
                </p>  
              </WhiteContainer>
            ))
          }
        </GrayContainer>
    </div>
  )
}
