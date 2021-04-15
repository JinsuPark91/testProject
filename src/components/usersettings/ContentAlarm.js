import React, { useEffect, useState } from 'react';
import { useCoreStores, Switch, Checkbox, AlarmSetting } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import ContentTitle from './ContentTitle';
import { ReactComponent as SoundIcon } from '../../assets/sound_on.svg';
import AlarmSound from '../../assets/alarm_sound.wav';
import { ALARM_TYPE, ALARM_TYPE_SEND } from './SettingConstants';
import {
  ContentDataWrap,
  FormItemMain,
  AlarmList,
  FormItem,
  ItemMain,
  ItemInfo,
  ItemTitle,
  ItemTitleBlack,
  ItemSub,
  SoundText,
  SoundButton,
} from '../../styles/usersettings/ContentAlarmStyle';

const ContentAlarm = () => {
  const { t } = useTranslation();
  const { spaceStore, configStore } = useCoreStores();
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
    alarmArray.forEach(elem => {
      if (alarmSet.get(elem)) handleInitState(elem);
    });
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
    AlarmSetting.save(ALARM_TYPE_SEND.SOUND, getOnOffText(value));
    setIsSoundChecked(value);
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

  // const alarmSound = new Audio();
  // alarmSound.src = AlarmSound;
  const isBasicPlan = spaceStore.currentSpace?.plan === 'BASIC';

  if (isLoading) return null;

  return (
    <>
      <ContentTitle title={t('CM_NOTI')} subTitle={t('CM_SETTING_NOTI_03')} />
      <ContentDataWrap>
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
              {configStore.isActivateForCNU('Meeting') ? (
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
              ) : null}
              {configStore.isActivateForCNU('Mail') ? (
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
              ) : null}
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
      </ContentDataWrap>
    </>
  );
};

export default React.memo(ContentAlarm);
