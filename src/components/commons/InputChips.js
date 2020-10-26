import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Input } from 'antd';
import CommonChip from './Chip';

const NoStyledInput = styled(Input)`
  background-color: transparent !important;
  appearance: none !important;
  border: none !important;
  height: inherit;
  font-size: inherit;
  flex: 1;
  &:focus {
    border-color: none;
    box-shadow: none;
    outline: none !important;
  }
`;

const StyledInputChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: auto;
  min-height: 30px;
  ${props =>
    !props.noinput &&
    css`
      border: 1px solid #c6ced6;
      border-radius: 25px;
    `}
  padding: 1px 12px;
  font-size: 0.75rem;
  color: #3b3b3b;
  align-items: center;
  &::placeholder {
    color: #bdc6d3;
  }
`;

/**
 * Common Input Chips
 * @param {Object}    props
 * @param {Array.<{icon: string, alert: boolean, checked: boolean, text: string, disabled: boolean}>} props.chips
 * @param {boolean}   props.noInput
 * @param {function}  props.onAddChip
 * @param {function}  props.onDeleteChip
 */
function InputChips({
  size,
  chips = [],
  onAddChip,
  onDeleteChip,
  placeholder,
  noInput,
}) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = e => {
    const { value: text } = e.target;
    if (e.key === ' ' || e.key === 'Enter') {
      if (onAddChip) {
        onAddChip(text);
      }
      setInputValue('');
    }
  };

  const handleOnCloseChip = chip => (onDeleteChip ? onDeleteChip(chip) : null);

  return (
    <StyledInputChipsWrapper style={{ width: size }} noinput={noInput}>
      {chips.map(chip => (
        <CommonChip
          style={{}}
          key={chip.text}
          text={chip.text}
          size="small"
          onClose={() => handleOnCloseChip(chip)}
          disabled={chip.disabled}
          checked={chip.checked}
          alert={chip.alert}
          icon={chip.icon}
        />
      ))}
      {!noInput && (
        <NoStyledInput
          onKeyPress={handleKeyPress}
          onChange={handleInputChange}
          value={inputValue}
          placeholder={chips.length === 0 && placeholder}
        />
      )}
    </StyledInputChipsWrapper>
  );
}

export default InputChips;
