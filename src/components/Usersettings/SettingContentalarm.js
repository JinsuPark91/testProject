import React, {Component, useState} from 'react';
import SettingContentalarmtoggle from './SettingContentalarmtoggle';
import SettingContentTitle from './SettingContentTitle';
import CommonSwitch from '../commons/Switch';


function onChange(checked) {
    console.log(`switch to ${checked}`);
  }

function SettingContentalarm(){
    const [Checked, setChecked] = useState(true);
  

        return(
            <div  >
                <SettingContentTitle title="알림" subTitle="바탕화면 알림을 허용하면, 다른 작업중에도 놓치지 않고 알림을 받아보실 수 있습니다."></SettingContentTitle>
                  <div>
                바탕화면 알림 허용</div>
            <div> <CommonSwitch 
            defaultChecked onChange={(Checked) => setChecked(Checked)}
             /><br/><br/><br/>
            {Checked ? <SettingContentalarmtoggle></SettingContentalarmtoggle>: "  "}
            </div>
            
                    
                
            </div>
        );
    }
        
    export default SettingContentalarm;