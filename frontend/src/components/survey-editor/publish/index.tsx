import React, { useState } from "react";
import { Layout, Form, Input, Button, notification } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { publishSurvey } from "../../../requests";
import "./index.css";

const Publish = () => {
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const [userId, setUserId] = useState<string>("");
  const [publishInfo, setPublishInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const onPublish = async () => {
    setLoading(true);
    const res = await publishSurvey(surveyJson._surveyId, userId);
    if (res && res._id) {
      notification.success({
        message: "Publish survey success!",
      });
      setPublishInfo(res);
    } else {
      notification.error({
        message: "Publish survey failed!",
      });
    }
    setLoading(false);
  };
  return (
    <Layout className="preview-web-panel">
      <div className="publish-form-container">
        <h1>Publish Surevy</h1>
        <Form>
          <Form.Item
            label="User Id"
            name="userid"
            help="UserId serves the purpose of matching the survey result with participants' identities. Without userId, it may be impossible to identify the individual who have completed the survey."
          >
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required={false}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={onPublish} loading={loading}>
              Publish Survey
            </Button>
          </Form.Item>
        </Form>
        {publishInfo && (
          <div className="publish-info-container">
            <h3>Publish Info</h3>
            <div className="publish-info">
              <div className="publish-info-item">
                <div className="publish-info-item-label">Survey Url Id</div>
                <div className="publish-info-item-value">
                  {publishInfo.urlId}
                </div>
              </div>
              <div className="publish-info-item">
                <div className="publish-info-item-label">Survey Url</div>
                <div className="publish-info-item-value">{publishInfo.url}</div>
              </div>
              <div className="publish-info-item">
                <div className="publish-info-item-label">Survey Patient Id</div>
                <div className="publish-info-item-value">
                  {publishInfo.userId}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default Publish;
