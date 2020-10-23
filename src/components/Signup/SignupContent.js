import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Checkbox, Row, Col, Input, Button } from 'antd';
import CommonButton from '../commons/Button';
import CommonCheckbox from '../commons/Checkbox';
import CommonTextArea from '../commons/TextArea';
import useLocalStorage from '../../libs/useLocalStroage';

const CommonContent = styled.div`
  height: auto;
  width: 40.26rem;
  border-style: solid;
  padding: 58px 70px;
  border-width: 1px;
  border-radius: 15px;
  box-shadow: 0 0 12px 1px rgba(125, 138, 148, 0.1);
  border-color: #e3e7eb;
  display: flex;
  flex-direction: column;
  .ant-col-24 {
    padding: 22px 0 18px;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 12px 0 22px 23px;
  border-bottom: 1px solid #e3e7eb;
  margin: 0;
`;

const InfoItem = styled.li`
  font-size: 0.75rem;
  line-height: 1.13rem;
  color: #888888;
`;

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['agreeAge', 'agreeTerms', 'agreePersonal', 'agreeAd'];

const SignupContent = () => {
  const [storedCheckedList, setStoredCheckedList] = useLocalStorage(
    'RegisterCheckedList',
    [],
  );
  const [checkedList, setCheckedList] = useState(storedCheckedList);
  const [checkAll, setCheckAll] = useState(
    storedCheckedList.length === plainOptions.length,
  );
  const history = useHistory();

  const onChange = checkedList => {
    setCheckedList(checkedList);

    checkedList.length === plainOptions.length
      ? setCheckAll(true)
      : setCheckAll(false);
  };
  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? plainOptions : []);

    setCheckAll(e.target.checked);
  };
  const handleGoSignUpForm = () => {
    setStoredCheckedList(checkedList);
    history.push(`/registerForm`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <CommonContent>
          <CommonCheckbox
            shape="round"
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            전체 약관에 동의합니다.
          </CommonCheckbox>
          <InfoList>
            <InfoItem>전체 동의는 필수 및 선택 정보에 대한 동의를 포함하고 있습니다.</InfoItem>
            <InfoItem>선택 항목에 대한 동의를 거부하시는 경우에도 서비스 이용이 가능합니다.</InfoItem>
          </InfoList>
        <CheckboxGroup
          value={checkedList}
          onChange={onChange}
          style={{ display: `flex`, flexDirection: `column` }}
        >
          <Row>
            <Col span={24}>
              <CommonCheckbox shape="round" value="agreeAge">
                (필수) 만 14세 이상입니다.
              </CommonCheckbox>
            </Col>
            <Col span={24}>
              <CommonCheckbox shape="round" value="agreeTerms">
                (필수) 서비스 이용약관 동의
              </CommonCheckbox>
            </Col>
            <CommonTextArea
              rows={4}
              disabled
              defaultValue="
제 1 조 목적         
본 약관은 (주)티맥스에이앤씨가 제공하는 TeeSpace의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.         

제 2 조 정의         
2.1. 본 약관에서 사용하는 용어의 의미는 다음과 같습니다.              
1) TeeSpace는 회사가 제공하는 메신저, 메일, 스케줄, 노트, 오피스, 화상회의, 파일저장소 등을 포함하는 TeeSpace앱 서비스와 TeeSpace이용을 위한    기술지원 등 관련 제반 서비스를 의미합니다.             
2) 회원이라 함은 회사의 TeeSpace에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사로부터 TeeSpace이용 자격을 부여 받은 개인을 의미합니다.              
3) TeeSpace아이디(ID)라 함은 회원의 식별과 TeeSpace의 이용을 위하여 회원이 설정한 문자와 숫자, 특수문자의 조합을 의미합니다.              
4) TeeSpace비밀번호라 함은 회원의 비밀보호를 위하여 TeeSpace회원이 설정한 문자와 숫자, 특수문자의 조합을 말합니다.              
5) 계정 탈퇴라 함은 TeeSpace 계정을 탈퇴하는 것으로 (주)티맥스에이앤씨 타 개별 서비스의 계정은 독립적으로 운영됩니다.          
6) 서비스 탈퇴라 함은 통합서비스 중 TeeSpace개별 서비스만 탈퇴하는 것으로 향후 해당 서비스만 사용할 수 없으며 나머지 개별서비스는 유효한 탈퇴 방식을 의미합니다.         

2.2. 본 약관에서 사용하는 용어 중 본 조에서 정하지 아니한 것은, 관계법령 및 상관례에 따릅니다.         

제 3 조 약관의 효력 및 변경         
3.1. 본 약관의 내용은 TeeSpace서비스 화면에 게시하거나 개별 서비스 홈페이지에 공지하고, 본 약관에 동의한 모두에게 효력이 있습니다.         
3.2. 본 약관에 규정되지 않은 사항에 대해서는 관련 법령 및 상관례의 순서로 적용됩니다.         
3.3. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다.본 약관이 변경되는 경우 회사는 변경사항을 시행 일자 15일 전부터 서비스 공지사항에서 공지 또는 통지하는 것을 원칙으로 하며, 회원에게 불리한 내용으로 변경될 경우에는 그 시행일자 30일 전부터 TeeSpace 계정에 등록된 이메일 주소로 전자메일(이메일 주소가 없는 경우 서비스 내 메일 및 알림 메시지를 띄우는 등의 별도의 전자적 수단)을 발송하는 방법 등으로 개별적으로 공지하겠습니다. 회원이 기간이 지난 후에도 TeeSpace를 계속 사용하면 새 약관에 동의한 것으로 간주합니다. 새 약관은 회원의 모든 서비스(과거에 이용했거나 구매한 서비스 포함) 이용과 향후의 모든 이용 및 구매에 적용됩니다.    
3.4. 변경 사항에 동의하지 않는 경우에는 TeeSpace계정 설정 메뉴 안의 계정 탈퇴 및 서비스 탈퇴를 통해TeeSpace의 이용계약을 해지신청을 할 수 있습니다. 계정 탈퇴는 TeeSpace홈페이지에서 가능하며, 계정 탈퇴 시 다른 연동 서비스의 이용계약은 자동해지되지 않습니다.서비스 탈퇴를 통해 개인정보의 제공 및 활용과 관련한 동의를 철회할 수 있습니다.개인 정보 파기를 위해서는 서비스 탈퇴가 아닌 계정 탈퇴를 선택하여야 합니다.   

제 4 조 회원가입 및 서비스 이용 방법   
4.1. TeeSpace이용계약은 TeeSpace회원이 되고자 하는 자(이하 “TeeSpace이용신청자”라 함)가 회사가 제공하는 회원가입 방법에 따라 TeeSpace회원가입 절차를 완료함으로써 체결됩니다. 단 아동의 보호를 위하여 만 14세 미만의 회원가입이 제한됩니다.    
4.2. TeeSpace이용신청자는 TeeSpace회원가입 및 서비스 이용 시 회사에서 요구하는 제반 정보(이름, 생년월일, 핸드폰 번호, 이메일 주소, 아이디, 비밀번호, 프로필 사진, 친구목록, 서비스 이용 내역 등)를 제공하고, 회사는 서비스 제공 등을 위해 이를 이용합니다.    
4.3. TeeSpace이용신청자가 회사가 제공하는 그 외 서비스를 제공받기 위해서는 별도의 이용신청을 거치거나 그 과정에서 추가적인 정보제공이 필요할 수 있습니다.   
4.4. TeeSpace는 가입 후 무료로 사용 가능합니다. 단, 향후 별도로 유료임을 명시한 정보에 대해서는 해당 정보에 명시된 요금을 지불하여야 사용이 가능합니다.   
4.5. TeeSpace가입 후 서비스 이용 중 제 3자의 앱 서비스에 대해서는 별도의 약관 동의 및 정보제공이 필요할 수 있습니다.   

제 5 조 개인정보의 보호 회원의 개인정보는 서비스의 원활한 제공을 위하여 회원이 동의한 목적과 범위 내에서만 이용됩니다. 관련 법령에 의하지 아니하는 한 회사가 개인정보를 제 3자에게 제공하는 경우 회원의 별도 동의를 받아야 합니다. 기타 자세한 사항은 TeeSpace개인정보처리방침 등을 참고해 주시기 바랍니다.    

제 6 조 TeeSpace의 이용   
6.1. TeeSpace는 회사가 정한 운영정책에 따라 제공되는 것이며, 회사는 운영, 기술 상의 필요에 따라 언제든 위 운영정책을 변경하거나 TeeSpace의 제공을 중단할 수 있습니다.   
6.2. 전항에 따라 TeeSpace이용이 중단될 경우 회사는 제 8 조에서 정한 방법으로 TeeSpace 회원에게 사전에 통지해야 합니다. 단, 불가항력적인 사유로 중단될 경우에는 통지하지 않을 수 있습니다.    
6.3. 회원이 본 약관에 기초하여 TeeSpace를 이용하던 중 회사가 본 약관에서 정한 기준을 충족시키지 못하게 되는 경우, 회사는 즉시 해당 회원에게 제공하던 TeeSpace의 제공을 중단할 수 있습니다.    
6.4. 전항에 따라 이용이 중단된 회원이 계속하여 TeeSpace를 제공받기 위해서는 별도로 마련된 고객문의 이메일(teesupport@tmax.co.kr)을 통해서 서비스 이용과 관련된 문의 절차를 거쳐야 합니다.    

제 7 조 회사의 통지회사가 회원에게 고지할 내용이 있는 경우 회원가입 시 기재한 이메일 주소로 통지를 합니다.    

제 8 조 회사의 TeeSpace이용 계약 해지 등   
8.1 회사는 다음 각 호의 경우 해당 회원에 관련된 일체의 데이터를 삭제하고 회원과의 TeeSpace이용계약을 해지할 수 있습니다.         
1) 본 약관 상 의무를 위반하는 경우        
2) 회사의 정상적인 TeeSpace운영을 방해한 경우        
3) 불법 혹은 부당한 방법으로 TeeSpace를 이용하는 경우        
4) 위 각 호에 준하는 사유로 TeeSpace이용계약의 해지가 필요하다고 회사가 판단한 경우    
8.2 본 조에 기초하여 회원이 TeeSpace를 이용하지 못하게 되는 경우에도 회사는 회원에게 어떠한 손해배상의무도 부담하지 아니합니다.   

제 9 조 회원의 TeeSpace이용 계약 해지   
9.1. 회원은 언제든지 TeeSpace이용 계약을 해지할 수 있습니다.    
9.2. TeeSpace이용 계약 해지 시, 회원은 TeeSpace이용기간 동안 사용한 모든 자원에 대하여 해지 전 직접 백업하여야 합니다.    
9.3. 제 1 항에 따라 회원이 TeeSpace이용 계약을 해지할 경우 관계법령 및 개인정보처리방침에 따라 회사가 회원의 정보를 보유하거나 9.4.에 따라 회원의 게시물 정보를 보유하는 경우를 제외하고는 회원에게 제공된 모든 자원이 회수되며 TeeSpace상에 저장되어 있는 모든 정보는 삭제되고, 삭제된 자료는 어떠한 이유로도 복원되지 않습니다.   
9.4. 제3자와 공유되고 있는 회원의 게시글 또는 댓글 등의 경우에는 삭제되지 않으므로 반드시 이용 종료 전에 스스로 삭제하시기 바랍니다.   
9.5. 회원은 TeeSpace홈페이지에서 탈퇴가 가능합니다.   

제 10 조 휴면계정   
10.1. 서비스를 1년 동안 이용(로그인)하지 않을 경우 휴면계정으로 분리됩니다.    
10.2. 휴면계정으로 분리하기 30일 전 회원이 회원가입시 기재한 이메일 주소로 전자우편을 보내사전 공지를 할 예정입니다. 사전공지 이후 30일 동안 별다른 이의신청이 없으면 휴면계정   으로 분리됩니다.   
10.3. 휴면계정으로 분리되면 별도의 휴면 해제 절차를 거쳐야 서비스 사용이 가능하며 휴면 해제 절차는 회원 가입 시 입력한 이메일 인증을 통하여 이루어집니다.   
10.4. 휴면계정으로 분리되면 수집된 회원들의 개인정보가 분리 보관됩니다.   
10.5. 휴면계정으로 분리되면 TeeSpace의 경우 해당 회원의 데이터가 삭제될 수 있습니다. 이로 인한 회원들의 손해에 대하여 회사는 어떠한 책임도 지지 않습니다   

제 11 조 손해배상   
11.1. 회사는 본 약관에 따른 TeeSpace의 제공과 관련하여, 회원에게 발생한 어떠한손해에 대하여도 책임지지 않습니다.    
11.2. 회원은 자신의 TeeSpace의이용과 관련하여 회사에 손해가 발생한 경우, 회사에게 발생한 모든 손실, 손해를 책임지고 배상하여야 합니다.   

제 12 조 기타   
12.1. 분리가능본 약관의 일부 조항이 관할 지역의 관련 법률에 의하여 무효로 해석되거나 법률에 위반하게 되는 경우 해당 조항은 관련 법률에 따라 합법적인 범위 내로 해석되거나 무효가 될 수 있습니다. 해당 조항의 무효 등은 본 약관의 유효성 및 다른 조항의 내용에 영향을 미치지 않습니다.   
12.2. 계약서의 인정회원은 본 약관에 명시된 모든 내용을 읽고 이해, 동의한 것임을 인정합니다.   
12.3. 분쟁의 해결본 약관은 대한민국의 법률에 따라 규율되며, TeeSpace사용에 관련된 소송 등 모든 법적인 문제에 대해서는 대한민국 서울중앙지방법원에 전속관할권이 있습니다.   
12.4. 본 약관에 대한 문의 사항본 약관에 대한 의문 사항은 아래 연락처를 참고하시기 바랍니다.   


(주)티맥스에이앤씨    
경기도 성남시 분당구 황새울로 BS 타워6 ~ 9층   
홈페이지: https://tmaxanc.com/   

부칙 본 약관은 2020년 6월 22일부터 적용됩니다"
            />
            <Col span={24}>
              <CommonCheckbox shape="round" value="agreePersonal">
                (필수) 개인정보 수집 및 이용 동의
              </CommonCheckbox>
            </Col>
            <CommonTextArea
              rows={4}
              disabled
              defaultValue="        
(주)티맥스에이앤씨(이하 “회사”)는 최초 회원 가입 또는 서비스 이용 시 이용자로부터 아래와 같은 개인정보를 수집하고 있습니다.          
수집항목 : 아이디, 비밀번호, 이름, 이메일(선택), 휴대폰 번호, 프로필 사진, 친구 목록, 서비스 이용 내역 등         
수집/이용목적 : 회원제 서비스 이용에 따른 본인 확인 절차에 이용         
보유 및 이용기간 : 회원 탈퇴 후 5일 이내 혹은 개인정보의 수집 및 이용목적이 달성 이후 즉시 파기이용자는 상기 개인정보 수집 및 이용 동의를 거부할 권리가 있습니다. 다만, 동의 거부 시 회원 가입이 불가하여 회원 서비스를 이용하실 수 없습니다. 상세 내용은 개인정보처리방침을 참고 바랍니다."
            />
            <Col span={24}>
              <CommonCheckbox shape="round" value="agreeAd">
                (선택) 뉴스레터, 프로모션 등 안내 메일을 받겠습니다.
              </CommonCheckbox>
            </Col>
          </Row>
        </CheckboxGroup>
        <CommonButton
          type="solid"
          disabled={
            !(
              checkedList.includes('agreeAge') &&
              checkedList.includes('agreeTerms') &&
              checkedList.includes('agreePersonal')
            )
          }
          onClick={handleGoSignUpForm}
        >
          동의
        </CommonButton>
      </CommonContent>
    </div>
  );
};

export default SignupContent;
