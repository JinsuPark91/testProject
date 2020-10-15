import React, {Component} from 'react';
import CommonCheckbox from '../commons/Checkbox';


function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }

class SettingContentmeetingtoggle extends Component{

    
    render(){
        return(
           
            <div >
            <CommonCheckbox 
              onChange={() => {}}
              shape="round">회의 시작</CommonCheckbox>
            <CommonCheckbox 
              onChange={() => {}}
              shape="round">회의 종료</CommonCheckbox></div>
                
        );
    }
        }
    export default SettingContentmeetingtoggle;