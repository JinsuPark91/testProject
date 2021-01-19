import React from 'react';
import styled, { css } from 'styled-components';

const Input = React.forwardRef(
  (
    {
      maxLength = 0,
      disabled = false,
      value = '',
      onChange = null,
      className,
      placeholder,
    },
    ref,
  ) => {
    const handleChange = e => {
      const inputValue = e.target.value;
      if (maxLength >= inputValue.length) {
        onChange(e.target.value);
        e.stopPropagation();
      }
    };
    return (
      <Wrapper disabled={disabled} className={className}>
        <input
          disabled={disabled}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          ref={ref}
        />
        {maxLength ? (
          <div className="input-counter">{`${value.length}/${maxLength}`}</div>
        ) : null}
      </Wrapper>
    );
  },
);

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
  border-radius: 0.25rem;
  border: 1px solid #d0ccc7;

  &:hover {
    background: #faf8f7;
  }

  &:not(:disabled):focus-within {
    border: 1px solid #7b7671;
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
      color: #c9c4be;
    }

    :disabled::placeholder {
      color: #fff;
    }

    :focus {
      outline: 0;
    }
  }

  & .input-counter {
    color: ${({ disabled }) => (disabled ? '#fff' : '#C9C4BE')};
  }
`;

export default Input;
