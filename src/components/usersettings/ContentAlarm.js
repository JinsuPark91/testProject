import React, { useState, useRef } from 'react';
import { useCoreStores, Switch, Checkbox } from 'teespace-core';
import { Button } from 'antd';
import styled, { css } from 'styled-components';
import ContentTitle from './ContentTitle';
import { ReactComponent as SoundIcon } from '../../assets/sound_on.svg';
import AlarmSound from '../../assets/alarm_sound.wav';

const FormItemMain = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.25rem;
  padding: 1.625rem 0 1.188rem;
  border-top: 1px solid #d8d8d8;
`;
const AlarmList = styled.div`
  width: 20rem;
`;
const FormItem = styled(FormItemMain)`
  min-height: 3.313rem;
  margin-top: 0;
  padding: 0.5625rem 0;
  &:first-of-type {
    border-top: 0;
  }
  .ant-switch {
    margin: 0.4375rem 0 auto;
  }
`;
const ItemMain = styled.label`
  span {
    padding-left: 0.56rem;
    font-size: 0.75rem;
    vertical-align: middle;
  }
`;
const ItemInfo = styled.div`
  flex: 1;
`;
const ItemTitle = styled.label`
  display: block;
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #777;
`;
const ItemTitleBlack = styled(ItemTitle)`
  color: #000;
`;
const ItemSub = styled.div`
  margin: 0.63rem 0 0.4375rem;
  font-size: 0.81rem;
  .ant-checkbox-wrapper {
    font-size: 0.81rem;
    & + .ant-checkbox-wrapper {
      margin-left: 1.25rem;
    }
  }
  .ant-checkbox + span {
    padding: 0 0 0 0.38rem;
  }
`;
const SoundText = styled.span`
  vertical-align: middle;
`;
const SoundButton = styled(Button)`
  width: 1.5rem;
  height: 1.5rem;
  margin-left: 0.19rem;
  line-height: 0;
  background-color: transparent;
  border: 1px solid;
  border-color: transparent;
  svg {
    width: 1rem;
    height: 1rem;
    color: #75757f;
    vertical-align: middle;
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  &:hover {
    background-color: #e3e7eb;
    border-color: #e3e7eb;
    svg {
      color: #43434a;
    }
  }
  &:active,
  &:focus {
    background-color: #dcddff;
    border-color: #dcddff;
    svg {
      color: #523dc7;
    }
  }
  ${props =>
    props.checked &&
    css`
      svg {
        color: #523dc7;
      }
    `}
`;

function ContentAlarm({
  desktopAlarm,
  soundAlarm,
  messageAlarm,
  messagePreviewAlarm,
  meetingAlarm,
  meetingStartAlarm,
  meetingEndAlarm,
  mailAlarm,
  calendarAlarm,
}) {
  const { authStore } = useCoreStores();

  const [isAlarmChecked, setIsAlarmChecked] = useState(true);
  const [isSoundChecked, setIsSoundChecked] = useState(true);

  const [isMessageNoticeChecked, setIsMessageNoticeChecked] = useState(true);
  const [isMessagePreviewChecked, setIsMessagePreviewChecked] = useState(true);

  const [isMeetingNoticeChecked, setIsMeetingNoticeChecked] = useState(true);
  const [isMeetingStartChecked, setIsMeetingStartChecked] = useState(true);
  const [isMeetingEndChecked, setIsMeetingEndChecked] = useState(true);

  const [isMailNoticeChecked, setisMailNoticeChecked] = useState(true);
  const [isCalendarNoticeChecked, setIsCalendarNoticeChecked] = useState(true);

  // value - On: True, Off: False
  const handleDeskTopNotification = value => {
    setIsAlarmChecked(value);
  };

  const handleAlarmSound = value => {
    setIsSoundChecked(value);
  };

  const handleTalkMessage = value => {
    setIsMessageNoticeChecked(value);
  };

  const handleMessagePreview = () => {
    setIsMessagePreviewChecked(!isMessagePreviewChecked);
  };

  const handleMeetingNotice = value => {
    setIsMeetingNoticeChecked(value);
  };

  const handleMeetingStart = () => {
    setIsMeetingStartChecked(!isMeetingStartChecked);
  };

  const handleMeetingEnd = () => {
    setIsMeetingEndChecked(!isMeetingEndChecked);
  };

  const handleMailNotice = value => {
    setisMailNoticeChecked(value);
  };

  const handleCalendarNotice = value => {
    setIsCalendarNoticeChecked(value);
  };

  const alarmSound = new Audio();
  alarmSound.src = AlarmSound;

  return (
    <>
      <ContentTitle
        title="알림"
        subTitle="바탕화면 알림을 허용하면, 다른 작업중에도 놓치지 않고 알림을 받아보실 수 있습니다."
      />
      <form>
        <FormItemMain valuePropName="alarmchecked">
          <ItemMain>
            <Switch defaultChecked onChange={handleDeskTopNotification} />
            <span>바탕화면 알림 허용</span>
          </ItemMain>
        </FormItemMain>
        {isAlarmChecked && (
          <AlarmList>
            <FormItem valuePropName="alarmchecked">
              <ItemInfo>
                <ItemTitle htmlFor="alarmsound">소리 알림</ItemTitle>
                {isSoundChecked && (
                  <ItemSub>
                    <SoundText>알림 소리 - WAPL</SoundText>
                    {/* click시 checked */}
                    <SoundButton type="circle">
                      <SoundIcon onClick={() => alarmSound.play()} />
                    </SoundButton>
                  </ItemSub>
                )}
              </ItemInfo>
              <Switch
                id="alarmsound"
                defaultChecked
                onChange={handleAlarmSound}
              />
            </FormItem>
            <FormItem>
              <ItemInfo>
                <ItemTitle htmlFor="newmessagetoggle">
                  Talk 새 메시지 수신
                </ItemTitle>
                {isMessageNoticeChecked && (
                  <ItemSub>
                    <Checkbox
                      checked={isMessagePreviewChecked}
                      onChange={handleMessagePreview}
                      shape="round"
                    >
                      메시지 내용 미리보기
                    </Checkbox>
                  </ItemSub>
                )}
              </ItemInfo>
              <Switch
                id="newmessagetoggle"
                defaultChecked
                onChange={handleTalkMessage}
              />
            </FormItem>
            <FormItem>
              <ItemInfo>
                <ItemTitle htmlFor="Meetingtoggle">Meeting 회의 알림</ItemTitle>
                {isMeetingNoticeChecked && (
                  <ItemSub>
                    <Checkbox
                      checked={isMeetingStartChecked}
                      onChange={handleMeetingStart}
                      shape="round"
                    >
                      회의 시작
                    </Checkbox>
                    <Checkbox
                      checked={isMeetingEndChecked}
                      onChange={handleMeetingEnd}
                      shape="round"
                    >
                      회의 종료
                    </Checkbox>
                  </ItemSub>
                )}
              </ItemInfo>
              <Switch
                id="Meetingtoggle"
                defaultChecked
                onChange={handleMeetingNotice}
              />
            </FormItem>
            <FormItem>
              <ItemInfo>
                <ItemTitle htmlFor="Newlettertoggle">
                  Mail 새 편지 수신
                </ItemTitle>
                <ItemSub>BASIC 플랜에서는 제공하지 않는 서비스 입니다.</ItemSub>
              </ItemInfo>
              <Switch
                id="Newlettertoggle"
                defaultChecked
                onChange={handleMailNotice}
              />
            </FormItem>
            <FormItem>
              <ItemInfo>
                <ItemTitleBlack htmlFor="scheduletoggle">
                  TeeCalendar 일정 미리 알림
                </ItemTitleBlack>
              </ItemInfo>
              <Switch
                id="scheduletoggle"
                defaultChecked
                onChange={handleCalendarNotice}
              />
            </FormItem>
          </AlarmList>
        )}
      </form>
    </>
  );
}

export default ContentAlarm;
