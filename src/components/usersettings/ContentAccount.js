import React, { useCallback, useState, useContext } from 'react';
import { useCoreStores, Form, Button, Input } from 'teespace-core';
import { Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import {
  AccountContent,
  ContentBox,
  ContentItem,
  ItemTitle,
  ItemInfo,
  TextLink,
  ButtonBox,
  EditNameInput,
  ImageBox,
  FormNotice,
  NoticeItemWrap,
  FormItemWrap,
  ItemLabel,
  PwInfo,
} from '../../styles/usersettings/ContentAccountStyle';
import ContentTitle from './ContentTitle';
import { CheckIcon } from '../Icons';
import MovePage from '../../utils/MovePage';
import { useStores } from '../../stores';

const NoticeItem = ({ pass, text }) => {
  const themeContext = useContext(ThemeContext);
  return (
    <NoticeItemWrap pass={pass}>
      <CheckIcon
        width="0.75"
        height="0.75"
        color={pass ? themeContext.TextPoinGreen : themeContext.IconHinted}
      />
      <span>{text}</span>
    </NoticeItemWrap>
  );
};

const patternPassword = /^(?:(?=.*[a-z])(?=.*[A-Z])(?=.*\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()<>?])|(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()<>?])|(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()<>?]))[A-Za-z\d!@#$%^&*()<>?]{9,20}$/;

const checkPasswordValid = pwdValue => {
  return patternPassword.test(pwdValue);
};

const ContentAccount = () => {
  const { t } = useTranslation();
  const { userStore, authStore } = useCoreStores();
  const { uiStore } = useStores();
  const myDomainData = userStore.myDomainSetting;
  const myUserId = userStore.myProfile.id;

  const [name, setName] = useState(myDomainData.name);
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [isPwEdit, setIsPwEdit] = useState(false);
  const [validPWLength, setValidPWLength] = useState(false);
  const [validPWChar, setValidPWChar] = useState(false);
  const [changed, setChanged] = useState(false);
  const [advertise, setAdvertise] = useState(myDomainData.isTermAd);

  const getProfilePhoto = () => {
    return userStore.getProfilePhotoURL(myUserId, 'small');
  };

  const handleChangeName = useCallback(async () => {
    try {
      await userStore.updateMyDomainSetting({ name });
      setIsNameEdit(false);
      uiStore.openToast({
        text: t('CM_CHANGE_SAVE'),
        onClose: () => {
          uiStore.closeToast();
        },
      });
    } catch (error) {
      console.log(`changeName Error is ${error}`);
    }
  }, [name, t, uiStore, userStore]);

  const handleChangePw = () => {
    setIsPwEdit(true);
  };

  const handleChangePwOk = useCallback(
    async values => {
      const pw = values.newPassword;
      try {
        await userStore.updateMyDomainSetting({ pw });
        setIsPwEdit(false);
        uiStore.openToast({
          text: t('CM_CHANGE_SAVE'),
          onClose: () => {
            uiStore.closeToast();
          },
        });
      } catch (error) {
        console.log(`changeName Error is ${error}`);
      }
    },
    [t, uiStore, userStore],
  );

  const handleChangePwInput = useCallback(() => setChanged(true), [setChanged]);

  const handleCancelChangeName = () => {
    setIsNameEdit(false);
    setName(myDomainData.name);
  };

  const handleCancelChangePw = () => {
    setIsPwEdit(false);
  };

  const handleChangeAdvertise = async e => {
    const targetValue = e.target.value;
    try {
      await userStore.updateMyDomainSetting({
        isTermAd: targetValue,
        isTermPersonalOpt: targetValue,
      });
      setAdvertise(targetValue);
    } catch (error) {
      console.log(`changeName Error is ${error}`);
    }
  };

  const handleOpenCancel = useCallback(() => {
    MovePage('withdrawal/select-type', true);
  }, []);

  return (
    <>
      <ContentTitle
        title={t('CM_EDIT_MYPAGE_01')}
        subTitle={t('CM_EDIT_MYPAGE_07')}
        attachment={
          <ImageBox>
            <img alt="profile" src={getProfilePhoto()} />
          </ImageBox>
        }
      />
      <AccountContent>
        <ContentBox>
          <ContentItem>
            <ItemTitle>{t('CM_EDIT_MYPAGE_08')}</ItemTitle>
            <ItemInfo>{myDomainData?.userLoginId}</ItemInfo>
          </ContentItem>
          <ContentItem>
            <ItemTitle>{t('CM_EDIT_MYPAGE_02')}</ItemTitle>
            <ItemInfo>
              {isNameEdit ? (
                <EditNameInput
                  maxLength={20}
                  placeholder={myDomainData.name}
                  value={name}
                  onChange={input => setName(input)}
                />
              ) : (
                <>{myDomainData?.name || '-'}</>
              )}
              <ButtonBox>
                {isNameEdit ? (
                  <>
                    <Button
                      size="small"
                      type="solid"
                      onClick={handleChangeName}
                    >
                      {t('CM_SAVE')}
                    </Button>
                    <Button size="small" onClick={handleCancelChangeName}>
                      {t('CM_CANCEL')}
                    </Button>
                  </>
                ) : (
                  <Button size="small" onClick={() => setIsNameEdit(true)}>
                    {t('CM_CHANGE')}
                  </Button>
                )}
              </ButtonBox>
            </ItemInfo>
          </ContentItem>
          <ContentItem>
            <ItemTitle>{t('CM_PWD')}</ItemTitle>
            <ItemInfo isPwEdit={isPwEdit}>
              {isPwEdit ? (
                <Form layout="vertical" onFinish={handleChangePwOk}>
                  <FormItemWrap>
                    <ItemLabel>
                      {t('CM_LOGIN_POLICY_CHANGE_PW_GUIDE_03')}
                    </ItemLabel>
                    <Form.Item
                      name="password"
                      validateTrigger={['onBlur']}
                      rules={[
                        {
                          required: true,
                          message: '비밀번호를 입력해 주세요.',
                          validateTrigger: 'onBlur',
                        },
                        {
                          validateTrigger: 'onBlur',
                          validator: async (_, value) => {
                            const success = await authStore.validatePassword({
                              pw: value || '',
                            });
                            if (!success) {
                              // eslint-disable-next-line prefer-promise-reject-errors
                              return Promise.reject(
                                '비밀번호가 일치하지 않습니다.',
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                      noStyle
                    >
                      <Input type="password" name="password" />
                    </Form.Item>
                  </FormItemWrap>
                  <FormItemWrap>
                    <ItemLabel>{t('CM_NEW_PWD')}</ItemLabel>
                    <Form.Item
                      label={t('CM_NEW_PWD')}
                      name="newPassword"
                      validateTrigger={['onBlur']}
                      rules={[
                        {
                          required: true,
                          message: '새 비밀번호를 입력해 주세요.',
                          validateTrigger: 'onBlur',
                        },
                        {
                          validator: (_, value) => {
                            if (
                              value &&
                              value.length >= 9 &&
                              value.length <= 20
                            ) {
                              setValidPWLength(true);
                              return Promise.resolve();
                            }
                            setValidPWLength(false);
                            // eslint-disable-next-line prefer-promise-reject-errors
                            return Promise.reject(
                              '새 비밀번호는 9자 이상 20자 이하로 입력해 주세요.',
                            );
                          },
                        },
                        {
                          validator: (_, value) => {
                            if (value && checkPasswordValid(value)) {
                              setValidPWChar(true);
                              return Promise.resolve();
                            }
                            setValidPWChar(false);
                            // eslint-disable-next-line prefer-promise-reject-errors
                            return Promise.reject(
                              '새 비밀번호는 영문 대/소문자, 숫자, 특수문자(!@#$%^&*()<>?) 모두 조합하여 입력해 주세요.',
                            );
                          },
                        },
                      ]}
                      noStyle
                    >
                      <Input type="password" onChange={handleChangePwInput} />
                    </Form.Item>
                    <FormNotice>
                      <NoticeItem
                        pass={validPWLength}
                        text={t('CM_LOGIN_POLICY_CHANGE_PW_03')}
                      />
                      <NoticeItem
                        pass={validPWChar}
                        text={t('CM_LOGIN_POLICY_CHANGE_PW')}
                      />
                    </FormNotice>
                  </FormItemWrap>
                  <FormItemWrap>
                    <ItemLabel>{t('CM_NEW_PWD_CONFIRM')}</ItemLabel>
                    <Form.Item
                      label={t('CM_NEW_PWD_CONFIRM')}
                      name="newPasswordConfirm"
                      dependencies={['newPassword']}
                      validateTrigger={['onBlur']}
                      rules={[
                        {
                          required: true,
                          message: '새 비밀번호 확인을 입력해 주세요.',
                          validateTrigger: 'onBlur',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              !value ||
                              getFieldValue('newPassword') === value
                            ) {
                              return Promise.resolve();
                            }
                            // eslint-disable-next-line prefer-promise-reject-errors
                            return Promise.reject(
                              '새 비밀번호가 일치하지 않습니다.',
                            );
                          },
                        }),
                      ]}
                      noStyle
                    >
                      <Input type="password" />
                    </Form.Item>
                  </FormItemWrap>
                  <ButtonBox>
                    <Form.Item noStyle>
                      <Button
                        size="small"
                        htmlType="submit"
                        type="solid"
                        disabled={!changed}
                      >
                        {t('CM_SAVE')}
                      </Button>
                      <Button size="small" onClick={handleCancelChangePw}>
                        {t('CM_CANCEL')}
                      </Button>
                    </Form.Item>
                  </ButtonBox>
                </Form>
              ) : (
                <>
                  {t('CM_EDIT_MYPAGE_03')}
                  <PwInfo>{myDomainData.pwModDate || '-'}</PwInfo>
                  <ButtonBox>
                    <Button size="small" onClick={() => handleChangePw(true)}>
                      {t('CM_CHANGE')}
                    </Button>
                  </ButtonBox>
                </>
              )}
            </ItemInfo>
          </ContentItem>
          <ContentItem>
            <ItemTitle>{t('CM_EDIT_MYPAGE_04')}</ItemTitle>
            <ItemInfo>
              {t('CM_EDIT_MYPAGE_05')}
              <TextLink onClick={handleOpenCancel}>
                {t('CM_EDIT_MYPAGE_06')}
              </TextLink>
            </ItemInfo>
          </ContentItem>
        </ContentBox>
        <ContentBox>
          <ContentItem>
            <ItemTitle>{t('CM_ADVERTISE_AGREE_POLICY')}</ItemTitle>
            <ItemInfo>
              <Radio.Group onChange={handleChangeAdvertise} value={advertise}>
                <Radio value> {t('CM_AGREE_BUTTON_01')}</Radio>
                <Radio value={false}> {t('CM_AGREE_BUTTON_02')}</Radio>
              </Radio.Group>
            </ItemInfo>
          </ContentItem>
        </ContentBox>
      </AccountContent>
    </>
  );
};

export default ContentAccount;
