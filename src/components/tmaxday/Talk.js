import React from 'react';
import styled, { css } from 'styled-components';
import { Observer } from 'mobx-react';
import { CloseOutlined } from '@ant-design/icons';
import { messages, getUser, myId } from '../../data';
import Photos from '../Photos';
import Footer from './Footer';
import { MeetingIcon, PDFIcon } from './Icons';
import ScheduleMessage from './ScheduleMessage';

const Talk = ({ roomId }) => {
  return (
    <TalkWrapper>
      <Content>
        <Observer>
          {() =>
            messages
              .filter(message => roomId === message.roomId)
              .map(message => <Message key={message.id} message={message} />)
          }
        </Observer>
      </Content>
      <Footer />
    </TalkWrapper>
  );
};

const Message = ({ message }) => {
  const isMyMessage = message.sender === myId;
  const profile = getUser(message.sender);

  const getMessageComponent = type => {
    switch (type) {
      case 'text':
      case 'startMeeting':
      case 'endMeeting': {
        const isMeeting = type !== 'text';
        return (
          <>
            <MessageBody isMyMessage={isMyMessage}>
              <MessageContent isMyMessage={isMyMessage}>
                {isMeeting && (
                  <IconWrapper>
                    <MeetingIcon state="active" />
                  </IconWrapper>
                )}
                <Text isMeeting={isMeeting}>{message.text}</Text>
              </MessageContent>
              {message.unreadCount ? (
                <UnreadCount>{message.unreadCount}</UnreadCount>
              ) : null}
            </MessageBody>
          </>
        );
      }
      case 'file':
        return (
          <FileWrapper>
            <PDFIcon state="active" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '0.375rem',
                marginRight: '0.625rem',
              }}
            >
              <span style={{ fontSize: '11px', color: '#45474A' }}>
                {message.fileName}
              </span>
              <span style={{ fontSize: '10px', color: '#888D96' }}>
                {message.fileSize}
              </span>
            </div>
            <CloseOutlined style={{ marginTop: '0.125rem' }} />
          </FileWrapper>
        );
      case 'schedule':
        return <ScheduleMessage message={message} />;
      case 'timeline':
        return <Timeline>{message.time}</Timeline>;
      case 'newline':
        return <Newline>New</Newline>;
      default:
        return null;
    }
  };
  return (
    <MessageWrapper isMyMessage={isMyMessage}>
      {message.isHead && (
        <MessageHeader>
          {!isMyMessage && <Photos srcList={[profile.photo]} maxCount={1} />}
          {!isMyMessage ||
            (message.isAI && (
              <UserName isAI={message.isAI}>{`${profile.name} ${
                message.isAI && '(Hi-T)'
              }`}</UserName>
            ))}
          <Time>{message.time}</Time>
        </MessageHeader>
      )}
      {getMessageComponent(message.type)}
    </MessageWrapper>
  );
};

const TalkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 0.625rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 0 20px;
  height: calc(100% - 123px);
`;

const FileWrapper = styled.div`
  display: flex;
  padding: 6px;
  border: 1px solid #e0e5e9;
  border-radius: 8px;
  border-radius: 8px;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #000000;
  margin: 0.625rem 0;
  width: 100%;
  align-items: ${({ isMyMessage }) =>
    isMyMessage ? 'flex-end' : 'flex-start'};
`;

const MessageHeader = styled.div`
  display: flex;
`;

const IconWrapper = styled.div`
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.375rem;
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  ${({ isAI }) =>
    isAI &&
    css`
      background-color: #f3ec78;
      background-image: linear-gradient(45deg, blue, pink);
      background-size: 100%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `}
  margin: 0 0.375rem;
`;

const Text = styled.span`
  font-size: 13px;
  ${({ isMeeting }) =>
    isMeeting &&
    css`
      font-weight: 600;
      display: flex;
      align-items: center;
    `}
`;
const Time = styled.div`
  display: flex;
  align-items: center;
  font-size: 10px;
  color: #787d81;
`;

const MessageBody = styled.div`
  display: flex;
  margin-left: 2.625rem;
  ${({ isMyMessage }) =>
    isMyMessage &&
    css`
      flex-flow: row-reverse;
      margin-top: 0.3125rem;
    `}
`;

const MessageContent = styled.div`
  display: flex;
  background: ${({ isMyMessage }) => (isMyMessage ? '#C0C3FF' : '#ffffff')};
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: ${({ isMyMessage }) =>
    isMyMessage ? '12px 0 12px 12px' : '0 12px 12px 12px'};
  padding: 9px;
`;

const UnreadCount = styled.div`
  align-self: flex-end;
  margin: 0 0.375rem;
  font-size: 12px;
  color: #4647c0;
  font-weight: 600;
`;
const Timeline = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  width: 100%;
  color: #787d81;
  position: relative;
  &:after {
    position: absolute;
    right: 0;
    top: 50%;
    width: 48%;
    content: '';
    display: inline-block;
    border-bottom: 2px solid #e3e7eb;
  }
  &:before {
    position: absolute;
    left: 0;
    top: 50%;
    width: 48%;
    content: '';
    display: inline-block;
    border-bottom: 2px solid #e3e7eb;
  }
`;

const Newline = styled.div`
  display: flex;
  justify-content: center;
  background: #f5f5fb;
  border-radius: 11.5px;
  font-size: 11px;
  color: #5c5c5c;
  letter-spacing: 0;
  padding: 2px 0;
  width: 100%;
`;

export default Talk;
