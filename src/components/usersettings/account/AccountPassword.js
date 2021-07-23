import React, { useCallback, useContext, useState } from 'react';
import { useCoreStores, Form, Button, Input } from 'teespace-core';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import {
  ContentItem,
  ItemTitle,
  ItemInfo,
  ButtonBox,
  FormNotice,
  NoticeItemWrap,
  FormItemWrap,
  ItemLabel,
  PwInfo,
} from '../../../styles/usersettings/ContentAccountStyle';
import uiStore from '../../../stores/uiStore';
import { CheckIcon } from '../../Icons';

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

const AccountPassword = () => {
  const { t } = useTranslation();
  const { userStore, authStore } = useCoreStores();
  const myDomainData = userStore.myDomainSetting;
  const [form] = Form.useForm();
  const pwModDate = myDomainData.pwModDate?.split(' ')[0];
  const patternPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$!@#$%^&*()<>?])[A-Za-z\d$!@#$%^&*()<>?]{9,20}$/;

  const [isPwEdit, setIsPwEdit] = useState(false);
  const [validPWLength, setValidPWLength] = useState(false);
  const [validPWChar, setValidPWChar] = useState(false);

  const handleChangePw = () => {
    setIsPwEdit(true);
  };

  const handleChangePwOk = useCallback(
    async values => {
      const pw = values.newPassword;
      try {
        await userStore.updateMyDomainSetting({ pw });
        setIsPwEdit(false);
        setValidPWLength(false);
        setValidPWChar(false);
        form.resetFields();
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
    [form, t, userStore],
  );

  const checkPasswordValid = pwdValue => {
    return patternPassword.test(pwdValue);
  };

  const handleCancelChangePw = () => {
    setIsPwEdit(false);
    setValidPWLength(false);
    setValidPWChar(false);
    form.resetFields();
  };

  return (
    <ContentItem>
      <ItemTitle>{t('CM_PWD')}</ItemTitle>
      <ItemInfo isPwEdit={isPwEdit}>
        {isPwEdit ? (
          <Form form={form} layout="vertical" onFinish={handleChangePwOk}>
            <FormItemWrap>
              <ItemLabel>{t('CM_LOGIN_POLICY_CHANGE_PW_GUIDE_03')}</ItemLabel>
              <Form.Item
                name="password"
                validateTrigger={['onBlur']}
                rules={[
                  {
                    required: true,
                    message: t(
                      'MSG_HYPERAUTH_ACCOUNTSETTING_CHANGEPASSWORD_ERROR_1',
                    ),
                  },
                  {
                    validator: async (_, value) => {
                      const confirmPassword = await authStore.validatePassword({
                        pw: value || '',
                      });
                      if (!confirmPassword) {
                        return Promise.reject(
                          t(
                            'MSG_HYPERAUTH_ACCOUNTSETTING_CHANGEPASSWORD_ERROR_2',
                          ),
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
                    message: t(
                      'MSG_HYPERAUTH_ACCOUNTSETTING_CHANGEPASSWORD_ERROR_1',
                    ),
                  },
                  {
                    validator: async (_, value) => {
                      const duplicateCheck = await authStore.validatePassword({
                        pw: value || '',
                      });
                      if (!duplicateCheck) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        t(
                          'MSG_HYPERAUTH_ACCOUNTSETTING_CHANGEPASSWORD_ERROR_5',
                        ),
                      );
                    },
                  },
                  {
                    validator: (_, value) => {
                      if (value && value.length >= 9 && value.length <= 20) {
                        setValidPWLength(true);
                        return Promise.resolve();
                      }
                      setValidPWLength(false);
                      return Promise.reject(
                        t(
                          'MSG_HYPERAUTH_ACCOUNTSETTING_CHANGEPASSWORD_ERROR_3',
                        ),
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
                      return Promise.reject(
                        t(
                          'MSG_HYPERAUTH_ACCOUNTSETTING_CHANGEPASSWORD_ERROR_4',
                        ),
                      );
                    },
                  },
                ]}
                noStyle
              >
                <Input type="password" />
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
                    message: t(
                      'MSG_HYPERAUTH_ACCOUNTSETTING_CHANGEPASSWORD_ERROR_6',
                    ),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      // eslint-disable-next-line prefer-promise-reject-errors
                      return Promise.reject(
                        t(
                          'MSG_HYPERAUTH_ACCOUNTSETTING_CHANGEPASSWORD_ERROR_7',
                        ),
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
              <Form.Item noStyle shouldUpdate>
                {() => (
                  <Button
                    htmlType="submit"
                    size="small"
                    type="solid"
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                  >
                    {t('CM_SAVE')}
                  </Button>
                )}
              </Form.Item>
              <Form.Item noStyle>
                <Button size="small" onClick={handleCancelChangePw}>
                  {t('CM_CANCEL')}
                </Button>
              </Form.Item>
            </ButtonBox>
          </Form>
        ) : (
          <>
            {t('CM_EDIT_MYPAGE_03')}
            <PwInfo>{pwModDate || '-'}</PwInfo>
            <ButtonBox>
              <Button size="small" onClick={() => handleChangePw(true)}>
                {t('CM_CHANGE')}
              </Button>
            </ButtonBox>
          </>
        )}
      </ItemInfo>
    </ContentItem>
  );
};

export default React.memo(AccountPassword);
