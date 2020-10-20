import React, { Component, useState, useRef } from 'react';
import { Form } from 'antd';
import SettingContentalarmtoggle from './SettingContentalarmtoggle';
import SettingContentTitle from './SettingContentTitle';
import { Switch } from 'teespace-core';
import { useCoreStores } from 'teespace-core';

function onChange(checked) {
  console.log(`switch to ${checked}`);
}

function SettingContentalarm(props) {
  const [Checked, setChecked] = useState(true);
  const { authStore } = useCoreStores();
  const { form } = props;
  // const [alarmsettingform] = Form.useForm();
  // const form = useRef(alarmsettingform);

  const handleFinish = values => {
    // authStore.updateMyInfo(values) ->toggle change store 참조
    console.log(values)

  };

  return (
    <div>
      <SettingContentTitle
        title="알림"
        subTitle="바탕화면 알림을 허용하면, 다른 작업중에도 놓치지 않고 알림을 받아보실 수 있습니다."
      ></SettingContentTitle>
      <div>바탕화면 알림 허용</div>
      <Form 
      onValuesChange={handleFinish}
      >
        <Form.Item
        name="mailalarmtoggle" valuePropName="checked"
        >
            <Switch defaultChecked onChange={(checked) => {
          setChecked(checked);
          // form.submit();
        }}                   />  
               </Form.Item>
               <br />
            <br />
            <br />    
            {Checked ? (
              <SettingContentalarmtoggle 
              // form={form}
              >

              </SettingContentalarmtoggle>
            ) : (
              '  '
            )}
         
      </Form>
    </div>
  );
}

export default SettingContentalarm;
