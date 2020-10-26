import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import styled, { css } from 'styled-components';
import { CloseOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';

const messageRoot = document.createElement('div');
messageRoot.setAttribute('id', 'toast-root');
document.body.appendChild(messageRoot);

const Wrapper = styled.div`
  position: fixed;
  right: 0;
  bottom: 20px;
  left: 0;
  overflow: auto;
  text-align: center;
  outline: 0;
  z-index: 2000;
  ${props =>
    !props.visible &&
    css`
      display: none;
    `}
`;

const ToastWrapper = styled.div`
  z-index: 1000;
  text-align: left;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: auto;
  display: inline-block;
  ${props => {
    switch (props.size) {
      case 'large':
        return css`
          min-width: 600px;
        `;
      case 'small':
        return css`
          min-width: 113px;
        `;
      case 'medium':
      default:
        return css`
          min-width: 326px;
        `;
    }
  }}
  height: 38px;
  overflow: auto;
  height: auto;
  background-color: rgba(11, 29, 65, 0.95);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  border-radius: 19px;
`;

const ToastContent = styled.div`
  margin: 0.375rem;
  line-height: 18px;
  font-size: 12px;
  color: #ffffff;
`;

const ToastClose = styled(CloseOutlined)`
  cursor: pointer;
  font-size: 10.9px;
`;

/**
 *
 * @param {Object} props
 * @param {boolean} props.visible
 * @param {('small'|'medium'|'large')} props.size
 * @param {ReactNode} props.children
 * @param {function} props.onClose
 * @param {number} props.timeoutMs
 */
function Toast({
  children,
  visible,
  onClose,
  size = 'medium',
  timeoutMs = 2000,
}) {
  const el = document.createElement('div');

  useEffect(() => {
    messageRoot.appendChild(el);
    const timeoutFunc = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, timeoutMs);
    return () => {
      clearTimeout(timeoutFunc);
      messageRoot.removeChild(el);
    };
  }, [el, onClose, timeoutMs, visible]);

  return ReactDOM.createPortal(
    <Wrapper visible={visible}>
      <ToastWrapper size={size}>
        <ToastContent>
          <Row align="middle">
            <Col
              style={{
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <CheckCircleOutlined style={{ fontSize: 28 }} />
              <div style={{ flex: 1, marginLeft: 10 }}>{children}</div>
              <ToastClose onClick={onClose} />
            </Col>
          </Row>
        </ToastContent>
      </ToastWrapper>
    </Wrapper>,
    el,
  );
}

export default Toast;
