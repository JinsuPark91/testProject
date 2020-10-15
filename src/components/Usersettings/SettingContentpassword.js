import React, { Component } from 'react';
import { Button } from 'antd';
import SettingContentTitle from './SettingContentTitle';
import CommonButton from '../commons/Button';


class SettingContentpassword extends Component {
constructor(props){
  super(props)
  this.state={date:new Date(), 
  checked : false
}
  this.handleChange = this.handleChange.bind(this)
}
handleChange(checked){
  this.setState({checked})
}

  render() {
    return (
      <div>
              <SettingContentTitle title="비밀번호 변경" 
      subTitle="보안을 위해 비밀번호를 항상 최신 상태로 업데이트하세요."></SettingContentTitle>

        <div>
          최종 변경일 {this.state.date.toLocaleDateString()}   {this.state.date.toLocaleTimeString()} <CommonButton type="system" onClick= {this.props.onClick} onChange={this.handleChange}>비밀번호 변경</CommonButton>
        </div>
      </div>
    );
  }
}
export default SettingContentpassword;
