import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import CommonChip from './Chip';

const NoStyledInput = styled(Input)`
  background-color: transparent !important;
  appearance: none !important;
  border: none !important;
  height: inherit;
  font-size: inherit;
  &:focus {
    border-color: none;
    box-shadow: none;
    outline: none !important;
  }
`;

const StyledInputChipsWrapper = styled.div`
  display: inline-block;
  height: auto;
  min-height: 30px;
  border: 1px solid #c6ced6;
  padding: 1px 12px;
  border-radius: 25px;
  font-size: 12px;
  color: #3b3b3b;
  align-items: center;
  &::placeholder {
    color: #bdc6d3;
  }
`;

/**
 * Common Input Chips
 * @param {Object} props
 * @param {Array} props.chips
 * @param {function} props.onAddChip
 * @param {function} props.onDeleteChip
 */
function InputChips({
  size,
  chips = [],
  onAddChip,
  onDeleteChip,
  placeholder,
}) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = e => {
    const { value: text } = e.target;
    if (e.key === ' ' || e.key === 'Enter') {
      onAddChip(text);
      setInputValue('');
    }
  };
  return (
    <StyledInputChipsWrapper style={{ width: size }}>
      {chips.map(chip => (
        <CommonChip
          key={chip}
          text={chip}
          size="small"
          onClose={() => onDeleteChip(chip)}
        />
      ))}
      <NoStyledInput
        onKeyPress={handleKeyPress}
        onChange={handleInputChange}
        value={inputValue}
        placeholder={chips.length === 0 && placeholder}
      />
    </StyledInputChipsWrapper>
  );
}

export default InputChips;
