import React, { useEffect, useState, useCallback } from 'react';
import { Button, Radio, Select, Dropdown, Menu } from 'antd';
import Upload from 'rc-upload';
import { useObserver } from 'mobx-react';
import { useCoreStores, Input } from 'teespace-core';
import styled from 'styled-components';
import { LockOutlined } from '@ant-design/icons';
import CameraIcon from '../../assets/ts_camera.svg';
import ContentTitle from './ContentTitle';
import { default as InputCounter } from '../Input';

const InnerList = styled.ul`
  margin-top: 1.56rem;
  font-size: 0.81rem;
  color: #000;
  .ant-btn {
    color: #000;
  }
  .antd-btn-outlined:focus {
    color: #000;
  }
`;
const InnerItem = styled.li`
  overflow: hidden;
  &:first-of-type {
    margin-bottom: 1.25rem;
  }
  & + & {
    margin-top: 0.44rem;
  }
`;
const Name = styled.p`
  float: left;
  min-width: 13.13rem;
  padding-right: 1.25rem;
  line-height: 1.69rem;
`;
const Data = styled.div`
  overflow: hidden;
  display: flex;
  min-height: 1.69rem;
  align-items: center;
  font-weight: 500;
  .ant-btn {
    padding: 0 0.81rem;
    & + .ant-btn {
      margin-left: 0.38rem;
    }
  }
`;
const ImageBox = styled.div`
  overflow: hidden;
  position: relative;
  width: 3.38rem;
  height: 3.38rem;
  margin-right: 0.63rem;
  flex-shrink: 0;
  border: 2px solid #6c56e5;
  border-radius: 50%;
  cursor: pointer;
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }
  & > img {
    width: 100%;
  }
`;
const ImageIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.5rem;
  height: 1.5rem;
  transform: translate(-50%, -50%);
  background-image: url('${CameraIcon}');
  background-size: contain;
  z-index: 5;
`;
const Info = styled.span`
  display: block;
  margin-top: 0.63rem;
  font-size: 0.75rem;
  line-height: 0.94rem;
  font-weight: 400;
  color: #8d8d8d;
  span {
    color: #6c56e5;
    text-decoration: underline;
  }
`;
const TextArea = styled.div`
  margin-right: 1.25rem;
  p {
    word-break: break-word;
    word-wrap: break-word;
  }
  .ant-input {
    width: 11.88rem;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;
const ButtonArea = styled.div`
  margin-left: auto;
  flex-shrink: 0;
  .anticon-lock {
    font-size: 0.88rem;
    color: #75757f;
  }
`;
const EditNameInput = styled(InputCounter)`
  width: 11.88rem;
  .input-counter {
    font-size: 0.69rem;
    color: #bdc6d3;
  }
`;

const StyledUpload = styled(Upload)`
  &:focus {
    outline: 0;
  }
`;

function onChange(e) {
  console.log('checked = ${e.target.checked}');
}

function ContentAccount({ isEdit }) {
  const { authStore, userStore } = useCoreStores();
  const { Option } = Select;

  const [profilePhoto, setProfilePhoto] = useState(undefined);

  const [isNameEdit, setIsNameEdit] = useState(false);
  const [name, setName] = useState('');

  const [isNickEdit, setIsNickEdit] = useState(false);
  const [nick, setNick] = useState('');

  const [isCompanyPhoneEdit, setIsCompanyPhoneEdit] = useState(false);
  const [companyPhone, setCompanyPhone] = useState('');

  const [isCellPhoneEdit, setIsCellPhoneEdit] = useState(false);
  const [cellPhone, setCellPhone] = useState('');

  const [isBirthDayEdit, setIsBirthDayEdit] = useState(false);
  const [birthDay, setBirthDay] = useState('');
  const isB2B = userStore.myProfile.type === 'USR0001';

  useEffect(() => {
    return () => {
      setName('');
      setNick('');
      setCompanyPhone('');
      setCellPhone('');
      setBirthDay('');
    };
  }, []);

  const handleChangePhoto = file => {
    setProfilePhoto(URL.createObjectURL(file));
  };

  const handleToggleNameInput = useCallback(() => {
    setIsNameEdit(!isNameEdit);
    setName('');
  }, [isNameEdit]);

  const handleToggleNickInput = useCallback(() => {
    setIsNickEdit(!isNickEdit);
  }, [isNickEdit]);

  const handleToggleCompanyPhoneInput = useCallback(() => {
    setIsCompanyPhoneEdit(!isCompanyPhoneEdit);
  }, [isCompanyPhoneEdit]);

  const handleToggleCellPhoneInput = useCallback(() => {
    setIsCellPhoneEdit(!isCellPhoneEdit);
  }, [isCellPhoneEdit]);

  const handleToggleBirthDayInput = useCallback(() => {
    setIsBirthDayEdit(!isBirthDayEdit);
  }, [isBirthDayEdit]);

  const handleChangeName = useCallback(async () => {
    const updateInfo = {};
    updateInfo.name = name;
    try {
      const response = await userStore.updateMyProfile(updateInfo);
      console.log(`changeName response is${response}`);
    } catch (e) {
      console.log(`changeName Error is ${e}`);
    }
    handleToggleNameInput();
  }, [name, userStore, handleToggleNameInput]);

  const handleChangeNick = useCallback(async () => {
    const updateInfo = {};
    updateInfo.nick = nick;
    await userStore.updateMyProfile(updateInfo);
    handleToggleNickInput();
  }, [nick, userStore, handleToggleNickInput]);

  const handleChangeCompanyPhone = useCallback(async () => {
    const updateInfo = {};
    updateInfo.companyNum = companyPhone;
    await userStore.updateMyProfile(updateInfo);
    handleToggleCompanyPhoneInput();
  }, [companyPhone, userStore, handleToggleCompanyPhoneInput]);

  const handleChangeCellPhone = useCallback(async () => {
    const updateInfo = {};
    updateInfo.phone = cellPhone;
    await userStore.updateMyProfile(updateInfo);
    handleToggleCellPhoneInput();
  }, [cellPhone, userStore, handleToggleCellPhoneInput]);

  const handleChangeBirthDay = useCallback(async () => {
    const updateInfo = {};
    updateInfo.birthDate = birthDay;
    await userStore.updateMyProfile(updateInfo);
    handleToggleBirthDayInput();
  }, [birthDay, userStore, handleToggleBirthDayInput]);

  // TODO: 이름 변경 서비스, 별명 바꾸면 이름까지 바뀌는 이슈, 생년월일 update 안 되는 이슈 해결 필요
  return (
    <>
      <ContentTitle
        title="내 정보"
        subTitle="내 스페이스 프로필을 편집할 수 있습니다."
      />
      <InnerList>
        <InnerItem>
          <Name>사진</Name>
          <Data>
            <TextArea>
              <ImageBox>
                <img
                  alt="profile"
                  src={`${userStore.getUserProfilePhoto({
                    userId: userStore.myProfile.id,
                    size: 'small',
                    isLocal: true,
                    thumbPhoto: null,
                  })}`}
                />
                {/* <ImageIcon />
                <Dropdown
                  trigger={['click']}
                  placement="bottomLeft"
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <StyledUpload
                          component="div"
                          multiple={false}
                          accept={['.jpg,.jpeg,.png']}
                          customRequest={({ file }) => handleChangePhoto(file)}
                        >
                          프로필 사진 변경
                        </StyledUpload>
                      </Menu.Item>
                    </Menu>
                  }
                /> */}
              </ImageBox>
              <Info>사진을 추가하여 스페이스 별로 설정할 수 있습니다.</Info>
            </TextArea>
          </Data>
        </InnerItem>
        <InnerItem>
          <Name>이름</Name>
          <Data>
            {isNameEdit ? (
              <>
                <TextArea>
                  <EditNameInput
                    maxLength={20}
                    placeholder={authStore.user.name}
                    value={name}
                    onChange={input => {
                      setName(input);
                    }}
                  />
                </TextArea>
                <ButtonArea>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleChangeName}
                  >
                    저장
                  </Button>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleToggleNameInput}
                  >
                    취소
                  </Button>
                </ButtonArea>
              </>
            ) : (
              <>
                <TextArea>
                  <p>{authStore.user.name}</p>
                </TextArea>
                <ButtonArea>
                  {/* <Button
                    size="small"
                    type="outlined"
                    onClick={handleToggleNameInput}
                  >
                    변경
                  </Button> */}
                </ButtonArea>
              </>
            )}
          </Data>
        </InnerItem>
        <InnerItem>
          <Name>별명</Name>
          <Data>
            {isNickEdit ? (
              <>
                <TextArea>
                  <EditNameInput
                    maxLength={20}
                    value={nick}
                    onChange={e => {
                      setNick(e);
                    }}
                  />
                  <Info>
                    스페이스에서 불리고 싶은 별명을 설정할 수 있습니다.
                  </Info>
                </TextArea>
                <ButtonArea>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleChangeNick}
                  >
                    저장
                  </Button>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleToggleNickInput}
                  >
                    취소
                  </Button>
                </ButtonArea>
              </>
            ) : (
              <>
                <TextArea>
                  <p>{authStore.user.nick}</p>
                  <Info>
                    스페이스에서 불리고 싶은 별명을 설정할 수 있습니다.
                  </Info>
                </TextArea>
                <ButtonArea>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleToggleNickInput}
                  >
                    변경
                  </Button>
                </ButtonArea>
              </>
            )}
          </Data>
        </InnerItem>
        {isB2B ? (
          <>
            <InnerItem>
              <Name>부서/ 직책/ 직위</Name>
              <Data>
                <TextArea>
                  <p>
                    {authStore.user.orgName}/ {authStore.user.position}/{' '}
                    {authStore.user.departmentName}
                  </p>
                </TextArea>
                <ButtonArea>
                  <LockOutlined />
                </ButtonArea>
              </Data>
            </InnerItem>
            <InnerItem>
              <Name>회사 전화</Name>
              <Data>
                {isCompanyPhoneEdit ? (
                  <>
                    <TextArea>
                      <Input
                        type="number"
                        onChange={e => setCompanyPhone(e.target.value)}
                      />
                    </TextArea>
                    <ButtonArea>
                      <Button
                        size="small"
                        type="outlined"
                        onClick={handleChangeCompanyPhone}
                      >
                        저장
                      </Button>
                      <Button
                        size="small"
                        type="outlined"
                        onClick={handleToggleCompanyPhoneInput}
                      >
                        취소
                      </Button>
                    </ButtonArea>
                  </>
                ) : (
                  <>
                    <TextArea>
                      <p>{authStore.user.companyNum}</p>
                    </TextArea>
                    <ButtonArea>
                      <Button
                        size="small"
                        type="outlined"
                        onClick={handleToggleCompanyPhoneInput}
                      >
                        변경
                      </Button>
                    </ButtonArea>
                  </>
                )}
              </Data>
            </InnerItem>
          </>
        ) : null}
        <InnerItem>
          <Name>휴대폰 번호</Name>
          <Data>
            {isCellPhoneEdit ? (
              <>
                <TextArea>
                  <Input
                    type="number"
                    onChange={e => setCellPhone(e.target.value)}
                  />
                </TextArea>
                <ButtonArea>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleChangeCellPhone}
                  >
                    저장
                  </Button>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleToggleCellPhoneInput}
                  >
                    취소
                  </Button>
                </ButtonArea>
              </>
            ) : (
              <>
                <TextArea>
                  <p>{authStore.user.phone}</p>
                </TextArea>
                <ButtonArea>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleToggleCellPhoneInput}
                  >
                    변경
                  </Button>
                </ButtonArea>
              </>
            )}
          </Data>
        </InnerItem>
        <InnerItem>
          <Name>생년월일</Name>
          <Data>
            {isBirthDayEdit ? (
              <>
                <TextArea>
                  <Input
                    type="number"
                    maxLength={8}
                    placeholder="8자리 형태로 입력 (YYYYMMDD)"
                    onChange={e => setBirthDay(e.target.value)}
                  />
                </TextArea>
                <ButtonArea>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleChangeBirthDay}
                  >
                    저장
                  </Button>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleToggleBirthDayInput}
                  >
                    취소
                  </Button>
                </ButtonArea>
              </>
            ) : (
              <>
                <TextArea>
                  <p>{authStore.user.birthDate}</p>
                </TextArea>
                <ButtonArea>
                  <Button
                    size="small"
                    type="outlined"
                    onClick={handleToggleBirthDayInput}
                  >
                    변경
                  </Button>
                </ButtonArea>
              </>
            )}
          </Data>
        </InnerItem>
      </InnerList>
    </>
  );
}

export default ContentAccount;
