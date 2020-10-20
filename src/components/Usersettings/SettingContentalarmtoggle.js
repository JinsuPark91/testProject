import React, { Component, useState } from 'react';
import { Form } from 'antd';
import SettingContentmessagetoggle from './SettingContentmessagetoggle';
import SettingContentmeetingtoggle from './SettingContentmeetingtoggle';
import { Switch } from 'teespace-core';
import styled from 'styled-components';

const Bordertop = styled.div`
  display: flex;
  border-top: 1px solid;
  border-top-color: #d8d8d8;
  font-size: 15px;
  font-weight: bold;
  font-color: #777777;
`;

function onChange(checked) {
  // console.log(`switch to ${checked}`);
}

function SettingContentalarmtoggle(props) {
  const [Checked, setChecked] = useState(true);
  const [Checked2, setChecked2] = useState(true);
  const { form } = props;


  return (
    <>
      <div>
        <Bordertop>
          <div>
            TeeTalk 새 메시지 수신
            <Form.Item name="newmessagetoggle" valuePropName="checked">
              <Switch
                defaultChecked
                onChange={Checked => setChecked(Checked)}
              />
            </Form.Item>
            {Checked ? (
              <SettingContentmessagetoggle></SettingContentmessagetoggle>
            ) : null}
          </div>{' '}
        </Bordertop>
        <br />
        <br />
        <Bordertop>
          <div>
            TeeMeeting 회의 알림
            <Form.Item name="TeeMeetingalarmtoggle" valuePropName="checked">
              <Switch
                defaultChecked
                onChange={Checked2 => setChecked2(Checked2)}
              />
            </Form.Item>
            {Checked2 ? (
              <SettingContentmeetingtoggle></SettingContentmeetingtoggle>
            ) : null}
            <br />
            <br />
          </div>{' '}
        </Bordertop>
        <Bordertop>
          <div>
            TeeMail 새 편지 수신
            <Form.Item name="Newlettertoggle" valuePropName="checked">
              <Switch defaultChecked onChange={onChange} />
            </Form.Item>{' '}
            <br />
            <br />
          </div>
        </Bordertop>
        <Bordertop>
          <div>
            TeeCalendar 일정 미리 알림{' '}
            <Form.Item name="TeeCalenderscheduletoggle" valuePropName="checked">
              <Switch defaultChecked onChange={onChange} />
            </Form.Item>{' '}
            <br />
            <br />
          </div>{' '}
        </Bordertop>
        <Bordertop>
          <div>
            그룹 스페이스 초대 알림{' '}
            <Form.Item name="Teespaceinvitetoggle" valuePropName="checked">
              <Switch defaultChecked onChange={onChange} />
            </Form.Item>{' '}
            <br />
            <br />
          </div>{' '}
        </Bordertop>
      </div>{' '}
    </>
  );
}
export default SettingContentalarmtoggle;
