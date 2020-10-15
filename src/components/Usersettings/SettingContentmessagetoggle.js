import React, {Component} from 'react';
import CommonCheckbox from '../commons/Checkbox';


function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
class SettingContentmessagetoggle extends Component{

    
    render(){
        return(
           
            <div  >
            <CommonCheckbox 
              onChange={() => {}}
              shape="round">메시지 내용 미리보기</CommonCheckbox></div>
                
        );
    }
        }
    export default SettingContentmessagetoggle;