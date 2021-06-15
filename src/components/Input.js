import React from 'react';
import styled, { css } from 'styled-components';

const Input = React.forwardRef(
  (
    {
      maxLength = 0,
      disabled = false,
      value = '',
      onChange = null,
      className = '',
      placeholder = '',
      style = {},
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
      <Wrapper disabled={disabled} className={className} style={style}>
        <input
          disabled={disabled}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          ref={ref}
          autoFocus
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
  height: 1.75rem;
  background: ${({ disabled, theme }) =>
    disabled ? `${theme.DisabledShape}` : `${theme.StateNormal}`};
  ${({ disabled, theme }) =>
    disabled &&
    css`
      color: ${theme.TextMain};
      cursor: not-allowed;
    `}
  border-radius: 0.25rem;
  border: 1px solid ${props => props.theme.LineOut};

  &:hover {
    ${({ disabled }) =>
      !disabled &&
      css`
        background: transparent;
      `}
  }

  &:not(:disabled):focus-within {
    border: 1px solid ${props => props.theme.IconNormal};
  }

  input {
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
      color: ${props => props.theme.IconHinted};
    }

    :disabled::placeholder {
      color: ${props => props.theme.DisabledText};
    }

    :focus {
      outline: 0;
    }
  }

  .input-counter {
    color: ${({ disabled, theme }) =>
      disabled ? `${theme.DisabledText}` : `${theme.TextSub}`};
  }
`;

export default Input;
