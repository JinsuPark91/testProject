import React, { Component, useState } from 'react';
import SettingContentmessagetoggle from './SettingContentmessagetoggle';
import SettingContentmeetingtoggle from './SettingContentmeetingtoggle';
import CommonSwitch from '../commons/Switch';
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
  console.log(`switch to ${checked}`);
}

function SettingContentalarmtoggle(){
  const [Checked, setChecked] = useState(true);
  const [Checked2, setChecked2] = useState(true);
  
     return (<>
      
      <div>
        
        <Bordertop>
        <div>

          TeeTalk 새 메시지 수신 
          <CommonSwitch  defaultChecked onChange={(Checked) => setChecked(Checked)}
             /><br/><br/><br/>
            {Checked ? <SettingContentmessagetoggle></SettingContentmessagetoggle>: null}
                         </div> </Bordertop>
        <br />
        <br />
        <Bordertop>
        <div>
          TeeMeeting 회의 알림
          <CommonSwitch 
            defaultChecked onChange={(Checked2) => setChecked2(Checked2)}
             /><br/><br/><br/>
            {Checked2 ? <SettingContentmeetingtoggle></SettingContentmeetingtoggle>: null}
          <br />
          <br />
        </div> </Bordertop>
        <Bordertop>
        <div >
          TeeMail 새 편지 수신 <CommonSwitch defaultChecked onChange={onChange} />{' '}
          <br />
          <br />
        </div>
        </Bordertop>
        <Bordertop>
        <div>
          TeeCalendar 일정 미리 알림{' '}
          <CommonSwitch defaultChecked onChange={onChange} /> <br />
          <br />
        </div> </Bordertop>
        <Bordertop>
        <div >
          그룹 스페이스 초대 알림 <CommonSwitch defaultChecked onChange={onChange} />{' '}
          <br />
          <br />
        </div> </Bordertop>
      </div> </>
    );
  
}
export default SettingContentalarmtoggle;
