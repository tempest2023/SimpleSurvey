import React, {useState} from 'react';
import {Layout, Form, Input, Button, Tooltip} from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { API_URL } from '../../../constants';
import './index.css'
 
const Publish = () => {
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const [userId, setUserId] = useState<string>('');
  const onPublish = async () => {
    await fetch(`${API_URL}/api/survey/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        content: surveyJson
    })
    });
  }
  return (<Layout className="preview-web-panel">
    <div className="publish-form-container">
      <h1>Publish Surevy</h1>
    <Form>
      <Form.Item label="User Id" name='userid' help="UserId serves the purpose of matching the survey result with participants' identities. Without userId, it may be impossible to identify the individual who have completed the survey.">
          <Input value={userId} onChange={(e)=>setUserId(e.target.value)} required={false} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={onPublish}>Publish Survey</Button>
      </Form.Item>
    </Form>
    </div>
  </Layout>)
}
export default Publish;