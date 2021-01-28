export const SELECTED_TAB = {
  GENERAL: '1',
  ALARM: '2',
  MY_INFO: '4',
  SECESSION: '7',
};

export const ALARM_TYPE = {
  DESKTOP: 'desktop_all',
  SOUND: 'alarm_sound',
  TALK: 'ttalk_all',
  TALK_CONTENTS: 'ttalk_showContents',
  MEETING: 'cloudmeeting_all',
  MEETING_START: 'cloudmeeting_meetingstart',
  MEETING_END: 'cloudmeeting_meetingend',
  MAIL: 'tmail_all',
  CALENDAR: 'tschedule_all',
};

export const ALARM_TYPE_SEND = {
  DESKTOP: 'desktop_all',
  SOUND: 'alarm_sound',
  TALK: 'talk_all',
  TALK_CONTENTS: 'talk_showContents',
  MEETING: 'meeting_all',
  MEETING_START: 'meeting_start',
  MEETING_END: 'meeting_end',
  MAIL: 'mail_all',
  CALENDAR: 'schedule_all',
};

export const EDIT_TYPE = {
  INSERT: 'insert',
  DELETE: 'delete',
};

// ALARM LIST
// 바탕화면 알림 허용: desktop_all
// Talk 새 메시지 수신: ttalk_all
// 메시지 내용 미리보기: ttalk_showContents
// TeeMeeting 회의 알림: cloudmeeting_all
// 회의 시작: cloudmeeting_meetingstart
// 회의 종료: cloudmeeting_meetingend
// Mail 새 편지 수신: tmail_all
// Calendar 알림: tschedule_all
// 그룹 스페이스 초대 알림: space_invite
// 그룹 스페이스: space_all
