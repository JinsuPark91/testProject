import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Row, Col, Typography } from 'antd';
import ReactDOM from 'react-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import CommonButton from './Button';

const { Paragraph, Title } = Typography;

const messageRoot = document.createElement('div');
messageRoot.setAttribute('id', 'message-root');
document.body.appendChild(messageRoot);

const Mask = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  ${props =>
    !props.visible &&
    css`
      display: none;
    `}
`;

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  outline: 0;
  z-index: 1000;
  ${props =>
    !props.visible &&
    css`
      display: none;
    `}
`;

const MessageWrapper = styled.div`
  width: 360px;
  overflow: auto;
  height: auto;
  min-height: 190px;
  background-color: #ffffff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.35);
  border-radius: 4px;
`;

const MessageContent = styled.div`
  margin: 34px 32px 20px 32px;
`;

const MessageTitle = styled(Title)`
  font-size: 15px !important;
  line-height: 22px !important;
  margin-top: 13px !important;
`;

const MessageSubTitle = styled(Paragraph)`
  color: #777777;
  line-height: 19px;
  size: 13px;
  margin-top: 9px !important;
`;
const MessageActionContent = styled.div`
  margin-top: 22px;
  & > button:not(:first-child) {
    margin-left: 9.8px;
  }
`;

/**
 * Message Dialog
 * @param {Object} props
 * @param {Array} props.btns
 * @param {function} props.btns.onClick
 * @param {string} props.btns.text
 * @param {string} props.btns.type
 */
function Message({ visible = false, title = '', subtitle = '', btns = [] }) {
  const el = document.createElement('div');

  useEffect(() => {
    messageRoot.appendChild(el);
    return () => messageRoot.removeChild(el);
  });

  return ReactDOM.createPortal(
    <div>
      <Mask visible={visible} />
      <Wrapper visible={visible}>
        <Row justify="center" align="middle" style={{ height: '100%' }}>
          <Col align="center">
            <MessageWrapper>
              <MessageContent>
                <InfoCircleOutlined width={20} style={{ fontSize: 20 }} />
                <MessageTitle>
                  {title.split('\\n').map(line => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </MessageTitle>
                <MessageSubTitle>
                  {subtitle.split('\\n').map(line => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </MessageSubTitle>
                <MessageActionContent>
                  {btns.map(({ type, onClick, text }) => (
                    <CommonButton type={type} key={text} onClick={onClick}>
                      {text}
                    </CommonButton>
                  ))}
                </MessageActionContent>
              </MessageContent>
            </MessageWrapper>
          </Col>
        </Row>
      </Wrapper>
    </div>,
    el,
  );
}

export default Message;
