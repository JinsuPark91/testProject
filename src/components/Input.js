import React from 'react';
import styled, { css } from 'styled-components';

const Input = ({
  maxLength = 0,
  disabled = false,
  value = '',
  onChange = null,
}) => {
  const handleChange = e => {
    const inputValue = e.target.value;
    if (maxLength >= inputValue.length) onChange(e.target.value);
  };

  return (
    <Wrapper disabled={disabled}>
      <input disabled={disabled} value={value} onChange={handleChange} />
      {maxLength ? (
        <div className="input-counter">{`${value.length}/${maxLength}`}</div>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  height: 1.8rem;
  background: ${({ disabled }) => (disabled ? '#cccccc' : '#fff')};
  ${({ disabled }) =>
    disabled &&
    css`
      color: #fff;
      cursor: not-allowed;
    `}
  border-radius: 25px;
  border: 1px solid #e3e7eb;
  &:not(:disabled):focus-within {
    border: 1px solid #6c56e5;
  }

  & input {
    background: transparent;
    margin-right: 0.5rem;
    height: 1.13rem;
    border: 0;

    ${({ disabled }) =>
      disabled &&
      css`
        cursor: not-allowed;
      `}

    font-size: 0.75rem;
    width: 100%;

    ::placeholder {
      color: #bdc6d3;
    }

    :disabled::placeholder {
      color: #fff;
    }

    :focus {
      outline: 0;
    }
  }

  & .input-count {
    color: ${({ disabled }) => (disabled ? '#fff' : '#bdc6d3')};
  }
`;

export default Input;
