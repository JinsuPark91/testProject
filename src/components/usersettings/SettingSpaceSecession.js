import React, { Component } from 'react';
import { Button, Radio, Checkbox, PageHeader } from 'antd';
import SettingContentTitle from './SettingContentTitle';

function onChange(e) {
  console.log('checked = ${e.target.checked}');
}

// 현재 사용하지 않는 js 파일 - 참고용으로 둔 후 추후 삭제
class SettingSpaceSecession extends Component {
  constructor() {
    super();
    this.state = {
      checked: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(checked) {
    this.setState({ checked });
  }

  render() {
    return (
      <div>
        <SettingContentTitle
          title="스페이스 탈퇴"
          subTitle="스페이스 탈퇴에 대한 유의사항을 꼭 확인해 주세요."
        />
        <div style={{ fontSize: 30, color: '#8d8d8d' }}>현재 스페이스 </div>
        <div style={{ fontSize: 30 }}>탈퇴 전 유의사항</div>
        <div style={{ fontSize: 15 }}>
          · 현재 스페이스의 프로필, 별명 및 비밀번호, 그리고 보관 중인 메일 등
          개인형 서비스 이용기록은 모두 삭제되며, 복구가 불가능합니다. 참여 중인
          모든 룸에서 나가게 되고, 룸에서 주고받은 사진이나 파일 등 모든
          데이터에 접근할 수 없게 됩니다. 단, 남아 있는 멤버들은 회원님이 남긴
          메시지나 파일에 계속해서 접근할 수 있습니다. 중요한 데이터는 스페이스
          탈퇴 전에 삭제하거나 백업해 주세요.
          <br />
          {/* <Button>이용 약관</Button>
          <Button>개인정보처리방침</Button> */}
        </div>
        <Checkbox onChange={this.handleChange} />
        유의 사항을 모두 확인하였으며, 이에 동의합니다.
        <Button disabled={!this.state.checked} onClick={this.props.onClick}>
          탈퇴 계속
        </Button>
      </div>
    );
  }
}
export default SettingSpaceSecession;
