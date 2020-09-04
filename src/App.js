import React from 'react';
import { Button, DatePicker } from 'antd';
import './App.less';

function App() {
  return (
    <div className="App">
      <DatePicker />
      <Button type="primary" style={{ marginLeft: 8 }}>
        Primary Button
      </Button>
    </div>
  );
}

export default App;
