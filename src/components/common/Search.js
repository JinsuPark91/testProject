import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { SearchIcon, CancelIcon } from '../Icons';

const Search = ({
  onChange = () => {},
  placeholder = '',
  onEnterDown = () => {},
  onClear = () => {},
  className,
}) => {
  const inputRef = useRef(null);
  const [keyword, setKeyword] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isClearActive, setIsClearActive] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const handleChange = e => {
    const { value } = e.target;
    setKeyword(value);
    onChange(value);
  };

  const handleKeyDown = e => {
    if (e.keyCode === 13) onEnterDown(e);
  };

  const handleInputFocus = () => {
    if (inputRef) {
      inputRef.current.focus();
      setIsFocus(true);
    }
  };

  const handleClear = () => {
    setKeyword('');
    onClear();
  };

  const handleFocus = () => {
    setIsFocus(true);
    setIsSearchActive(true);
    setIsClearActive(true);
  };

  const handleBlur = () => {
    setIsFocus(false);
    setIsSearchActive(false);
    setIsClearActive(false);
  };

  const handleSearchMouseEnter = () => {
    setIsSearchActive(true);
  };

  const handleSearchMouseLeave = () => {
    if (!isFocus) {
      setIsSearchActive(false);
    }
  };

  const handleClearMouseEnter = () => {
    setIsClearActive(true);
  };

  const handleClearMouseLeave = () => {
    if (!isFocus) {
      setIsClearActive(false);
    }
  };

  return (
    <Wrapper className={className}>
      <IconWrapper
        onMouseEnter={handleSearchMouseEnter}
        onMouseLeave={handleSearchMouseLeave}
        onClick={handleInputFocus}
        className="search-icon"
      >
        <SearchIcon
          width={1}
          height={1}
          color={isSearchActive ? '#17202B' : '#C6CED6'}
        />
      </IconWrapper>
      <input
        placeholder={placeholder}
        onChange={handleChange}
        value={keyword}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />

      {keyword.length ? (
        <IconWrapper
          onMouseEnter={handleClearMouseEnter}
          onMouseLeave={handleClearMouseLeave}
          onClick={handleClear}
        >
          <CancelIcon
            width={0.69}
            height={0.69}
            color={isClearActive ? '#000' : '#C6CED6'}
          />
        </IconWrapper>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  height: 1.75rem;
  padding: 0 0.4rem;
  align-items: center;
  background-color: #fff;
  background-color: transparent;
  border-bottom: 0.09rem solid #17202b;

  &:hover {
    .search-icon path {
      fill: #17202b;
    }
  }

  // &:focus-within {
  //   border: 1px solid #6c56e5;
  // }

  input {
    width: 100%;
    height: 1.13rem;
    margin-left: 0.44rem;
    font-size: 0.75rem;
    background-color: transparent;
    border: 0;

    &::placeholder {
      color: #bdc6d3;
    }

    &:focus {
      outline: 0;
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  padding: 0.2rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export default Search;
