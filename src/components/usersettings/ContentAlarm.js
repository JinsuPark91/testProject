import React, { useEffect, useState } from 'react';
import { useCoreStores, Switch, Checkbox, AlarmSetting } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import styled, { css } from 'styled-components';
import ContentTitle from './ContentTitle';
import { ReactComponent as SoundIcon } from '../../assets/sound_on.svg';
import AlarmSound from '../../assets/alarm_sound.wav';
import { ALARM_TYPE, ALARM_TYPE_SEND, EDIT_TYPE } from './SettingConstants';

const FormItemMain = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem 0 2rem 0;
`;

const AlarmList = styled.div`
  width: 26rem;
`;

const FormItem = styled(FormItemMain)`
  min-height: 3.313rem;
  margin-top: 0;
  padding: 0.5625rem 0;
  border-top: 1px solid #d8d8d8;
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
  color: ${props => (props.isEmail ? '#818181' : '#000000')};
  font-size: ${props => (props.isSmall ? '0.75rem' : '0.81rem')};
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
  min-width: auto;
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
    background-color: #f7f4ef;
    border-color: #f7f4ef;
    svg {
      color: #7b7671;
    }
  }
  &:active,
  &:focus {
    background-color: #ddd7cd;
    border-color: #ddd7cd;
    svg {
      color: #48423b;
    }
  }
  ${props =>
    props.checked &&
    css`
      svg {
        color: #48423b;
      }
    `}
`;

const ContentAlarm = () => {
  const { t } = useTranslation();
  const { spaceStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);
  const [isAlarmChecked, setIsAlarmChecked] = useState(true);
  const [isSoundChecked, setIsSoundChecked] = useState(true);

  const [isMessageNoticeChecked, setIsMessageNoticeChecked] = useState(true);
  const [isMessagePreviewChecked, setIsMessagePreviewChecked] = useState(true);
  const [isMentionNoticeChecked, setIsMentionNoticeChecked] = useState(true);

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
      case ALARM_TYPE.SOUND: {
        setIsSoundChecked(false);
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
      case ALARM_TYPE.TALK_MENTION: {
        setIsMentionNoticeChecked(false);
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
    const { alarmSet } = AlarmSetting;
    const alarmArray = [...alarmSet.keys()];
    alarmArray.forEach(elem => handleInitState(elem));
    setIsLoading(false);
  }, []);

  const getOnOffText = value => {
    return value ? 'on' : 'off';
  };

  // value - On: True, Off: False
  const handleDeskTopNotification = value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.DESKTOP, getOnOffText(value));
      setIsAlarmChecked(value);
    } catch (e) {
      console.log(`Alarm Change All Failed${e}`);
    }
  };
  const handleAlarmSound = async value => {
    setIsSoundChecked(value);
    AlarmSetting.save(ALARM_TYPE_SEND.SOUND, getOnOffText(value));
  };
  const handleTalkMessage = value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.TALK, getOnOffText(value));
      setIsMessageNoticeChecked(value);
    } catch (e) {
      console.log(`Alarm Change Talk Failed${e}`);
    }
  };
  const handleMessagePreview = () => {
    try {
      const value = !isMessagePreviewChecked;
      AlarmSetting.save(ALARM_TYPE_SEND.TALK_CONTENTS, getOnOffText(value));
      setIsMessagePreviewChecked(value);
    } catch (e) {
      console.log(`Alarm Change Talk_Preview Failed${e}`);
    }
  };
  const handleMention = value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.TALK_MENTION, getOnOffText(value));
      setIsMentionNoticeChecked(value);
    } catch (e) {
      console.log(`Alarm Change Mention Failed${e}`);
    }
  };
  const handleMeetingNotice = value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.MEETING, getOnOffText(value));
      setIsMeetingNoticeChecked(value);
    } catch (e) {
      console.log(`Alarm Change Meeting Failed${e}`);
    }
  };
  const handleMeetingStart = () => {
    try {
      const value = !isMeetingStartChecked;
      AlarmSetting.save(ALARM_TYPE_SEND.MEETING_START, getOnOffText(value));
      setIsMeetingStartChecked(value);
    } catch (e) {
      console.log(`Alarm Change Meeting_Start Failed${e}`);
    }
  };
  const handleMeetingEnd = () => {
    try {
      const value = !isMeetingEndChecked;
      AlarmSetting.save(ALARM_TYPE_SEND.MEETING_END, getOnOffText(value));
      setIsMeetingEndChecked(value);
    } catch (e) {
      console.log(`Alarm Change Meeting_End Failed${e}`);
    }
  };
  const handleMailNotice = value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.MAIL, getOnOffText(value));
      setIsMailNoticeChecked(value);
    } catch (e) {
      console.log(`Alarm Change Mail Failed${e}`);
    }
  };
  const handleCalendarNotice = value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.CALENDAR, getOnOffText(value));
      setIsCalendarNoticeChecked(value);
    } catch (e) {
      console.log(`Alarm Change Calendar Failed${e}`);
    }
  };

  const alarmSound = new Audio();
  alarmSound.src = AlarmSound;
  const isBasicPlan = spaceStore.currentSpace?.plan === 'BASIC';

  if (isLoading) return null;

  return (
    <>
      <ContentTitle title={t('CM_NOTI')} subTitle={t('CM_SETTING_NOTI_03')} />
      <form>
        <FormItemMain valuePropName="alarmchecked">
          <ItemMain>
            <Switch
              defaultChecked={isAlarmChecked}
              onChange={handleDeskTopNotification}
            />
            <span>{t('CM_SETTING_NOTI_02')}</span>
          </ItemMain>
        </FormItemMain>
        {isAlarmChecked && (
          <AlarmList>
            {/* <FormItem valuePropName="alarmchecked">
              <ItemInfo>
                <ItemTitle htmlFor="alarmsound">소리 알림</ItemTitle>
                <ItemSub>
                  <SoundText>알림 소리 - WAPL</SoundText>
                  <SoundButton type="circle">
                    <SoundIcon
                      onClick={() => {
                        alarmSound.pause();
                        if (alarmSound.currentTime > 0) {
                          alarmSound.currentTime = 0;
                        }
                        alarmSound.play();
                      }}
                    />
                  </SoundButton>
                </ItemSub>
              </ItemInfo>
              <Switch
                id="alarmsound"
                defaultChecked={isSoundChecked}
                onChange={handleAlarmSound}
              />
            </FormItem> */}
            <FormItem>
              <ItemInfo>
                <ItemTitle htmlFor="newmessagetoggle">
                  {t('CM_SETTING_NOTI_05')}
                </ItemTitle>
                {isMessageNoticeChecked && (
                  <ItemSub>
                    <Checkbox
                      checked={isMessagePreviewChecked}
                      onChange={handleMessagePreview}
                      shape="round"
                    >
                      {t('CM_SETTING_NOTI_06')}
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
                <ItemTitle htmlFor="mentiontoggle">
                  {t('CM_SETTING_NOTI_14')}
                </ItemTitle>
                <ItemSub isSmall>{t('CM_SETTING_NOTI_15')}</ItemSub>
              </ItemInfo>
              <Switch
                id="mentiontoggle"
                defaultChecked={isMentionNoticeChecked}
                onChange={handleMention}
              />
            </FormItem>
            <FormItem>
              <ItemInfo>
                <ItemTitle htmlFor="Meetingtoggle">
                  {t('CM_SETTING_NOTI_08')}
                </ItemTitle>
                {isMeetingNoticeChecked && (
                  <ItemSub>
                    <Checkbox
                      checked={isMeetingStartChecked}
                      onChange={handleMeetingStart}
                      shape="round"
                    >
                      {t('CM_SETTING_NOTI_09')}
                    </Checkbox>
                    <Checkbox
                      checked={isMeetingEndChecked}
                      onChange={handleMeetingEnd}
                      shape="round"
                    >
                      {t('CM_SETTING_NOTI_10')}
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
                  {t('CM_SETTING_NOTI_07')}
                </ItemTitle>
                {isBasicPlan && (
                  <ItemSub isMail>{t('CM_SETTING_NOTI')}</ItemSub>
                )}
              </ItemInfo>
              <Switch
                id="Newlettertoggle"
                defaultChecked={isMailNoticeChecked}
                onChange={handleMailNotice}
                disabled={isBasicPlan}
              />
            </FormItem>
            <FormItem>
              <ItemInfo>
                <ItemTitleBlack htmlFor="scheduletoggle">
                  {t('CM_SETTING_NOTI_11')}
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
};

export default React.memo(ContentAlarm);
