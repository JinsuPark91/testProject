import React, { useEffect, useState, useCallback } from 'react';
import { useCoreStores, Switch, Checkbox, AlarmSetting } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import ContentTitle from './ContentTitle';
// import { ReactComponent as SoundIcon } from '../../assets/sound_on.svg';
import AlarmSound from '../../assets/alarm_sound.wav';
import { ALARM_TYPE, ALARM_TYPE_SEND } from './SettingConstants';
import { isBasicPlan } from '../../utils/GeneralUtil';
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

const DesktopAlarm = React.memo(
  ({ isAlarmChecked, handleDeskTopNotification }) => {
    const { t } = useTranslation();
    return (
      <FormItemMain valuePropName="alarmchecked">
        <ItemMain>
          <Switch
            defaultChecked={isAlarmChecked}
            onChange={handleDeskTopNotification}
          />
          <span>{t('CM_SETTING_NOTI_02')}</span>
        </ItemMain>
      </FormItemMain>
    );
  },
);

const TalkAlarm = React.memo(
  ({
    isMessageChecked,
    handleMessage,
    isMessagePreviewChecked,
    handleMessagePreview,
  }) => {
    const { t } = useTranslation();
    return (
      <FormItem>
        <ItemInfo>
          <ItemTitle htmlFor="newmessagetoggle">
            {t('CM_SETTING_NOTI_05')}
          </ItemTitle>
          {isMessageChecked && (
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
          defaultChecked={isMessageChecked}
          onChange={handleMessage}
        />
      </FormItem>
    );
  },
);

const MentionAlarm = React.memo(({ isMentionChecked, handleMention }) => {
  const { t } = useTranslation();
  return (
    <FormItem>
      <ItemInfo>
        <ItemTitle htmlFor="mentiontoggle">{t('CM_SETTING_NOTI_14')}</ItemTitle>
        <ItemSub isSmall>{t('CM_SETTING_NOTI_15')}</ItemSub>
      </ItemInfo>
      <Switch
        id="mentiontoggle"
        defaultChecked={isMentionChecked}
        onChange={handleMention}
      />
    </FormItem>
  );
});

const MeetingStartCheckBox = React.memo(
  ({ isMeetingStartChecked, handleMeetingStart }) => {
    const { t } = useTranslation();
    return (
      <Checkbox
        checked={isMeetingStartChecked}
        onChange={handleMeetingStart}
        shape="round"
      >
        {t('CM_SETTING_NOTI_09')}
      </Checkbox>
    );
  },
);

const MeetingEndCheckBox = React.memo(
  ({ isMeetingEndChecked, handleMeetingEnd }) => {
    const { t } = useTranslation();
    return (
      <Checkbox
        checked={isMeetingEndChecked}
        onChange={handleMeetingEnd}
        shape="round"
      >
        {t('CM_SETTING_NOTI_10')}
      </Checkbox>
    );
  },
);

const MeetingAlarm = React.memo(
  ({
    isMeetingChecked,
    handleMeeting,
    isMeetingStartChecked,
    handleMeetingStart,
    isMeetingEndChecked,
    handleMeetingEnd,
  }) => {
    const { t } = useTranslation();
    return (
      <FormItem>
        <ItemInfo>
          <ItemTitle htmlFor="Meetingtoggle">
            {t('CM_SETTING_NOTI_08')}
          </ItemTitle>
          {isMeetingChecked && (
            <ItemSub>
              <MeetingStartCheckBox
                isMeetingStartChecked={isMeetingStartChecked}
                handleMeetingStart={handleMeetingStart}
              />
              <MeetingEndCheckBox
                isMeetingEndChecked={isMeetingEndChecked}
                handleMeetingEnd={handleMeetingEnd}
              />
            </ItemSub>
          )}
        </ItemInfo>
        <Switch
          id="Meetingtoggle"
          defaultChecked={isMeetingChecked}
          onChange={handleMeeting}
        />
      </FormItem>
    );
  },
);

const MailAlarm = React.memo(({ isMailChecked, handleMail }) => {
  const { t } = useTranslation();
  return (
    <FormItem>
      <ItemInfo>
        <ItemTitle htmlFor="Newlettertoggle">
          {t('CM_SETTING_NOTI_07')}
        </ItemTitle>
        {isBasicPlan() && <ItemSub isMail>{t('CM_SETTING_NOTI')}</ItemSub>}
      </ItemInfo>
      <Switch
        id="Newlettertoggle"
        defaultChecked={isMailChecked}
        onChange={handleMail}
        disabled={isBasicPlan()}
      />
    </FormItem>
  );
});

const CalendarAlarm = React.memo(({ isCalendarChecked, handleCalendar }) => {
  const { t } = useTranslation();
  return (
    <FormItem>
      <ItemInfo>
        <ItemTitleBlack htmlFor="scheduletoggle">
          {t('CM_SETTING_NOTI_11')}
        </ItemTitleBlack>
      </ItemInfo>
      <Switch
        id="scheduletoggle"
        defaultChecked={isCalendarChecked}
        onChange={handleCalendar}
      />
    </FormItem>
  );
});

const ContentAlarm = () => {
  const { t } = useTranslation();
  const { configStore } = useCoreStores();
  const [isLoading, setIsLoading] = useState(true);

  const [isAlarmChecked, setIsAlarmChecked] = useState(true);
  const [isSoundChecked, setIsSoundChecked] = useState(true);

  const [isMessageChecked, setIsMessageChecked] = useState(true);
  const [isMessagePreviewChecked, setIsMessagePreviewChecked] = useState(true);
  const [isMentionChecked, setIsMentionChecked] = useState(true);

  const [isMeetingChecked, setIsMeetingChecked] = useState(true);
  const [isMeetingStartChecked, setIsMeetingStartChecked] = useState(true);
  const [isMeetingEndChecked, setIsMeetingEndChecked] = useState(true);

  const [isMailChecked, setIsMailChecked] = useState(true);
  const [isCalendarChecked, setIsCalendarChecked] = useState(true);

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
        setIsMessageChecked(false);
        break;
      }
      case ALARM_TYPE.TALK_CONTENTS: {
        setIsMessagePreviewChecked(false);
        break;
      }
      case ALARM_TYPE.TALK_MENTION: {
        setIsMentionChecked(false);
        break;
      }
      case ALARM_TYPE.MEETING: {
        setIsMeetingChecked(false);
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
        setIsMailChecked(false);
        break;
      }
      case ALARM_TYPE.CALENDAR: {
        setIsCalendarChecked(false);
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    const { alarmSet } = AlarmSetting; // Map
    alarmSet.forEach((value, key) => {
      if (value) handleInitState(key);
    });
    setIsLoading(false);
  }, []);

  const getOnOffText = value => {
    return value ? 'on' : 'off';
  };

  // value - On: True, Off: False
  // 알람 설정 변경은 async이긴 하지만, 굳이 await 후 toggle할 필요는 없어 보임
  const handleDeskTopNotification = useCallback(value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.DESKTOP, getOnOffText(value));
      setIsAlarmChecked(value);
    } catch (e) {
      console.log(`Desktop Alarm Change Failed${e}`);
    }
  }, []);

  const handleAlarmSound = useCallback(value => {
    AlarmSetting.save(ALARM_TYPE_SEND.SOUND, getOnOffText(value));
    setIsSoundChecked(value);
  }, []);

  const handleMessage = useCallback(value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.TALK, getOnOffText(value));
      setIsMessageChecked(value);
    } catch (e) {
      console.log(`Message Alarm Change Failed${e}`);
    }
  }, []);

  const handleMessagePreview = useCallback(() => {
    try {
      const value = !isMessagePreviewChecked;
      AlarmSetting.save(ALARM_TYPE_SEND.TALK_CONTENTS, getOnOffText(value));
      setIsMessagePreviewChecked(value);
    } catch (e) {
      console.log(`Message Preview Alarm Change Failed${e}`);
    }
  }, [isMessagePreviewChecked]);

  const handleMention = useCallback(value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.TALK_MENTION, getOnOffText(value));
      setIsMentionChecked(value);
    } catch (e) {
      console.log(`Mention Alarm Change Failed${e}`);
    }
  }, []);

  const handleMeeting = useCallback(value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.MEETING, getOnOffText(value));
      setIsMeetingChecked(value);
    } catch (e) {
      console.log(`Meeting Alarm Change Failed${e}`);
    }
  }, []);

  const handleMeetingStart = useCallback(() => {
    try {
      const value = !isMeetingStartChecked;
      AlarmSetting.save(ALARM_TYPE_SEND.MEETING_START, getOnOffText(value));
      setIsMeetingStartChecked(value);
    } catch (e) {
      console.log(`Meeting Start Alarm Change Failed${e}`);
    }
  }, [isMeetingStartChecked]);

  const handleMeetingEnd = useCallback(() => {
    try {
      const value = !isMeetingEndChecked;
      AlarmSetting.save(ALARM_TYPE_SEND.MEETING_END, getOnOffText(value));
      setIsMeetingEndChecked(value);
    } catch (e) {
      console.log(`Meeting End Alarm Change Failed${e}`);
    }
  }, [isMeetingEndChecked]);

  const handleMail = useCallback(value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.MAIL, getOnOffText(value));
      setIsMailChecked(value);
    } catch (e) {
      console.log(`Mail Alarm Change Failed${e}`);
    }
  }, []);

  const handleCalendar = useCallback(value => {
    try {
      AlarmSetting.save(ALARM_TYPE_SEND.CALENDAR, getOnOffText(value));
      setIsCalendarChecked(value);
    } catch (e) {
      console.log(`Calendar Alarm Change Failed${e}`);
    }
  }, []);

  // const alarmSound = new Audio();
  // alarmSound.src = AlarmSound;
  if (isLoading) return null;

  return (
    <>
      <ContentTitle title={t('CM_NOTI')} subTitle={t('CM_SETTING_NOTI_03')} />
      <ContentDataWrap>
        <form>
          <DesktopAlarm
            isAlarmChecked={isAlarmChecked}
            handleDeskTopNotification={handleDeskTopNotification}
          />
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
              <TalkAlarm
                isMessageChecked={isMessageChecked}
                handleMessage={handleMessage}
                isMessagePreviewChecked={isMessagePreviewChecked}
                handleMessagePreview={handleMessagePreview}
              />
              <MentionAlarm
                isMentionChecked={isMentionChecked}
                handleMention={handleMention}
              />
              {configStore.isActivateForCNU('Meeting') ? (
                <MeetingAlarm
                  isMeetingChecked={isMeetingChecked}
                  handleMeeting={handleMeeting}
                  isMeetingStartChecked={isMeetingStartChecked}
                  handleMeetingStart={handleMeetingStart}
                  isMeetingEndChecked={isMeetingEndChecked}
                  handleMeetingEnd={handleMeetingEnd}
                />
              ) : null}
              {configStore.isActivateForCNU('Mail') ? (
                <MailAlarm
                  isMailChecked={isMailChecked}
                  handleMail={handleMail}
                />
              ) : null}
              <CalendarAlarm
                isCalendarChecked={isCalendarChecked}
                handleCalendar={handleCalendar}
              />
            </AlarmList>
          )}
        </form>
      </ContentDataWrap>
    </>
  );
};

export default ContentAlarm;
