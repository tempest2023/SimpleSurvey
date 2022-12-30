import React, { useState } from 'react';
import { Button } from 'antd';
import Sidebar from '../components/Sidebar';


function ButtonStart() {
    const [sidebarVisible, setSidebarVisible] = useState(false);
  
    function handleButtonClick() {
      setSidebarVisible(!sidebarVisible);
    }
  
    return (
      <div>
        <button onClick={handleButtonClick}>Add a new question</button>
        {sidebarVisible && <Sidebar />}
      </div>
    );
  }

  export default ButtonStart;