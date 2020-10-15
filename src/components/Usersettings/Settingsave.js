import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import CommonButton from '../commons/Button';
import CommonDialog, { ContentWrapper } from '../commons/Dialog';
import { useObserver } from 'mobx-react';
import CommonMessage from '../commons/Message';
import { useStore } from '../../stores';
import { useCoreStores } from 'teespace-core';
import CommonToast from '../commons/Toast';


function Settingsave(props) {
  const [canclevisible, setcanclevisible] = useState(false);
  const [savevisible, setsavevisible] = useState(false);
  const { authStore } = useCoreStores();


  return (
    <>
      <CommonButton type="solid" onClick={() => {
          setsavevisible(true);  
        //   authStore.user.updateMyinfo({name:'tmax'})
        }}>변경사항 저장</CommonButton>

      <CommonToast
        visible={savevisible}
        timeoutMs={1000}
        onClose={() => setsavevisible(false)}
      > 변경사항이 저장되었습니다. </CommonToast>        

      <CommonButton
        onClick={() => {
          setcanclevisible(true);
        }}
        type="solid"
      >
        취소{' '}
      </CommonButton>
      <CommonMessage
        visible={canclevisible}
        btns={[
          {
            onClick:  () => {
                setcanclevisible(false);
              },
            text: '나가기',
            type: 'solid',
          },
          {
            onClick: () => {
              setcanclevisible(false);
            },
            text: '취소',
            type: 'outlined',
          },
        ]}
        title="변경 사항을 저장하지 않고 나가시겠습니까?"
      />
    </>
  );
}

export default Settingsave;
