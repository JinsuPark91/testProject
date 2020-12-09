import React, { Component, useState, useEffect } from 'react';
import { SoundOutlined } from '@ant-design/icons';
import { Switch, Form } from 'teespace-core';
import styled from 'styled-components';
import SettingContentmessagetoggle from './SettingContentmessagetoggle';
import SettingContentmeetingtoggle from './SettingContentmeetingtoggle';

const Bordertop = styled.div`
  display: flex;
  border-top: 1px solid;
  border-top-color: #d8d8d8;
  font-size: 0.9375rem;
  font-weight: bold;
  font-color: #777777;
`;

function onChange(checked) {
  // console.log(`switch to ${checked}`);
}

function SettingContentalarmtoggle(props) {
  // const [soundChecked, setsoundChecked] = useState(false);
  const [messageChecked, setmessageChecked] = useState(true);
  const [meetingChecked, setmeetingChecked] = useState(true);
  const { form } = props;

  return (
    <>
      <div>
        <Bordertop>
          <div>
            알림 소리 - 티키타카
            <Form.Item name="alarmsound" valuePropName="checked">
              <Switch
                defaultChecked
                // onChange={soundChecked => setsoundChecked(soundChecked)}
              />
            </Form.Item>{' '}
            <SoundOutlined />
            {/* {Checked ? (
              <SettingContentmessagetoggle></SettingContentmessagetoggle>
            ) : null} */}
          </div>{' '}
        </Bordertop>

        <Bordertop>
          <div>
            TeeTalk 새 메시지 수신
            <Form.Item name="newmessagetoggle" valuePropName="checked">
              <Switch
                defaultChecked
                onChange={messageChecked => setmessageChecked(messageChecked)}
              />
            </Form.Item>
            {messageChecked ? <SettingContentmessagetoggle /> : null}
          </div>{' '}
        </Bordertop>
        <Bordertop>
          <div>
            TeeMeeting 회의 알림
            <Form.Item name="TeeMeetingalarmtoggle" valuePropName="checked">
              <Switch
                defaultChecked
                onChange={meetingChecked => setmeetingChecked(meetingChecked)}
              />
            </Form.Item>
            {meetingChecked ? <SettingContentmeetingtoggle /> : null}
          </div>{' '}
        </Bordertop>
        <Bordertop>
          <div>
            TeeMail 새 편지 수신
            <Form.Item name="Newlettertoggle" valuePropName="checked">
              <Switch defaultChecked onChange={onChange} />
            </Form.Item>{' '}
          </div>
        </Bordertop>
        <Bordertop>
          <div>
            TeeCalendar 일정 미리 알림{' '}
            <Form.Item name="TeeCalenderscheduletoggle" valuePropName="checked">
              <Switch defaultChecked onChange={onChange} />
            </Form.Item>{' '}
          </div>{' '}
        </Bordertop>
        <Bordertop>
          <div>
            그룹 스페이스 초대 알림{' '}
            <Form.Item name="Teespaceinvitetoggle" valuePropName="checked">
              <Switch defaultChecked onChange={onChange} />
            </Form.Item>{' '}
          </div>{' '}
        </Bordertop>
      </div>{' '}
    </>
  );
}
export default SettingContentalarmtoggle;
