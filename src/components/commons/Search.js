import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import CommonInput from './Input';

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${props =>
    props.disabled &&
    css`
      color: #ffffff;
    `}
`;
const StyledSearch = styled(CommonInput)`
  padding-left: 30px;
  ${props =>
    props.shape === 'square' &&
    css`
      border-radius: 0;
    `}

  ${props =>
    props.size === 'large'
      ? css`
          height: 40px;
        `
      : css`
          height: 30px;
        `}
`;

const SearchIcon = styled(SearchOutlined)`
  color: inherit;
  font-size: 14px;
  position: absolute;
  z-index: 10;
  ${props =>
    props.size === 'large'
      ? css`
          margin-left: 16px;
        `
      : css`
          margin-left: 9px;
        `}
`;

const SearchCloseButton = styled(CloseOutlined)`
  z-index: 10;
  margin-left: -26px;
  cursor: pointer;
`;

/**
 * Common Search
 * @param {Object} props
 * @param {('default'|'large')} props.size
 * @param {function} props.onChange
 * @param {function} props.onClear
 * @param {boolean} props.disabled
 * @param {string} props.value
 * @param {('round'|'square')} props.shape
 */
function CommonSearch(props) {
  const { size, style, onChange, disabled, value, shape, onClear } = props;
  console.log('value', value);
  const [visibleClose, setVisibleClose] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleOnMouseEnter = () => {
    setVisibleClose(true);
  };
  const handleOnMouseLeave = () => {
    if (!isFocused) {
      setVisibleClose(false);
    }
  };

  const handleOnChange = e => {
    if (onChange) {
      onChange(e.target.value);
    }
    setInputValue(e.target.value);
  };

  const handleInputClear = () => {
    setInputValue('');
    if (onClear) {
      onClear();
    }
  };

  const handleOnFocus = () => setIsFocused(true);
  const handleOnBlur = () => setIsFocused(false);
  return (
    <SearchWrapper
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      disabled={disabled}
    >
      <SearchIcon />
      <StyledSearch
        size={size}
        style={style}
        value={inputValue}
        onChange={handleOnChange}
        disabled={disabled}
        shape={shape}
        {...props}
      />
      {visibleClose && !disabled && (
        <SearchCloseButton onClick={handleInputClear} />
      )}
    </SearchWrapper>
  );
}

export default CommonSearch;
