import React, { useEffect, useState, useRef } from 'react';
import { useCoreStores, Switch, Checkbox } from 'teespace-core';
import { Button } from 'antd';
import styled, { css } from 'styled-components';
import ContentTitle from './ContentTitle';
import { ReactComponent as SoundIcon } from '../../assets/sound_on.svg';
import AlarmSound from '../../assets/alarm_sound.wav';
import { ALARM_TYPE, EDIT_TYPE } from './SettingConstants';

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
  const { userStore } = useCoreStores();

  const [isAlarmChecked, setIsAlarmChecked] = useState(true);
  const [isSoundChecked, setIsSoundChecked] = useState(true);

  const [isMessageNoticeChecked, setIsMessageNoticeChecked] = useState(true);
  const [isMessagePreviewChecked, setIsMessagePreviewChecked] = useState(true);

  const [isMeetingNoticeChecked, setIsMeetingNoticeChecked] = useState(true);
  const [isMeetingStartChecked, setIsMeetingStartChecked] = useState(true);
  const [isMeetingEndChecked, setIsMeetingEndChecked] = useState(true);

  const [isMailNoticeChecked, setIsMailNoticeChecked] = useState(true);
  const [isCalendarNoticeChecked, setIsCalendarNoticeChecked] = useState(true);

  const handleInitState = value => {
    switch (value) {
      case ALARM_TYPE.DESKTOP: {
        setIsAlarmChecked(false);
        break;
      }

      case ALARM_TYPE.TALK: {
        setIsMessageNoticeChecked(false);
        break;
      }

      case ALARM_TYPE.TALK_CONTENTS: {
        setIsMessagePreviewChecked(false);
        break;
      }

      case ALARM_TYPE.MEETING: {
        setIsMeetingNoticeChecked(false);
        break;
      }

      case ALARM_TYPE.MEETING_START: {
        setIsMeetingStartChecked(false);
        break;
      }

      case ALARM_TYPE.MEETING_END: {
        setIsMeetingEndChecked(false);
        break;
      }

      case ALARM_TYPE.MAIL: {
        setIsMailNoticeChecked(false);
        break;
      }

      case ALARM_TYPE.CALENDAR: {
        setIsCalendarNoticeChecked(false);
        break;
      }

      default:
        break;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        console.log(EDIT_TYPE.INSERT);
        const res = await userStore.getAlarmList(userStore.myProfile.id);
        console.log(res);
        // if (res) {
        //   res.forEach(elem => handleInitState(elem));
        // }
      } catch (e) {
        console.log(`getalarmlist error${e}`);
      }
    })();
  }, [userStore]);

  // value - On: True, Off: False
  const handleDeskTopNotification = async value => {
    setIsAlarmChecked(value);
    await userStore.updateAlarm({
      userId: userStore.myProfile.id,
      type: value ? EDIT_TYPE.INSERT : EDIT_TYPE.DELETE,
      alarmCode: ALARM_TYPE.DESKTOP,
    });
  };

  const handleAlarmSound = value => {
    setIsSoundChecked(value);
  };

  const handleTalkMessage = async value => {
    setIsMessageNoticeChecked(value);
    await userStore.updateAlarm({
      userId: userStore.myProfile.id,
      type: value ? EDIT_TYPE.INSERT : EDIT_TYPE.DELETE,
      alarmCode: ALARM_TYPE.TALK,
    });
  };

  const handleMessagePreview = async () => {
    setIsMessagePreviewChecked(!isMessagePreviewChecked);
    await userStore.updateAlarm({
      userId: userStore.myProfile.id,
      type: !isMessagePreviewChecked ? EDIT_TYPE.INSERT : EDIT_TYPE.DELETE,
      alarmCode: ALARM_TYPE.TALK_CONTENTS,
    });
  };

  const handleMeetingNotice = async value => {
    setIsMeetingNoticeChecked(value);
    await userStore.updateAlarm({
      userId: userStore.myProfile.id,
      type: value ? EDIT_TYPE.INSERT : EDIT_TYPE.DELETE,
      alarmCode: ALARM_TYPE.MEETING,
    });
  };

  const handleMeetingStart = async () => {
    setIsMeetingStartChecked(!isMeetingStartChecked);
    userStore.updateAlarm({
      userId: userStore.myProfile.id,
      type: !isMeetingStartChecked ? EDIT_TYPE.INSERT : EDIT_TYPE.DELETE,
      alarmCode: ALARM_TYPE.MEETING_START,
    });
  };

  const handleMeetingEnd = () => {
    setIsMeetingEndChecked(!isMeetingEndChecked);
    userStore.updateAlarm({
      userId: userStore.myProfile.id,
      type: !isMeetingEndChecked ? EDIT_TYPE.INSERT : EDIT_TYPE.DELETE,
      alarmCode: ALARM_TYPE.MEETING_END,
    });
  };

  const handleMailNotice = async value => {
    setIsMailNoticeChecked(value);
    await userStore.updateAlarm({
      userId: userStore.myProfile.id,
      type: value ? EDIT_TYPE.INSERT : EDIT_TYPE.DELETE,
      alarmCode: ALARM_TYPE.MAIL,
    });
  };

  const handleCalendarNotice = async value => {
    setIsCalendarNoticeChecked(value);
    await userStore.updateAlarm({
      userId: userStore.myProfile.id,
      type: value ? EDIT_TYPE.INSERT : EDIT_TYPE.DELETE,
      alarmCode: ALARM_TYPE.CALENDAR,
    });
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
                defaultChecked={isAlarmChecked}
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
                defaultChecked={isMessageNoticeChecked}
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
                defaultChecked={isMeetingNoticeChecked}
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
                defaultChecked={isMailNoticeChecked}
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
                defaultChecked={isCalendarNoticeChecked}
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
