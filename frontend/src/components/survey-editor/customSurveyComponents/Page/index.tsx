import react, { useState } from 'react';
import { Divider, List, Button, Form, Input } from 'antd';
import { PageData, PageComponentConfigProps } from './type';
import './index.css';

// View component for Page
export const PageView = ({ data }: { data: PageData }) => {
  return (
    <div className="surveyPage">
      <h1>{data.name}</h1>
    </div>
  );
}

// Config component for Page
export function PageComponentConfig(props: PageComponentConfigProps) {
  // console.log('[debug] PageComponentConfig props:', props);
  if(!props) {
    return <div>Error: Props is undefined</div>;
  }
  const { data, updateData } = props;
  const [pageData, setPageData] = useState<PageData>(data);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    const tmp = {...pageData, name};
    updateData(data.id, tmp, false);
    setPageData(tmp);
  };

  return (
    <Form>
      <Form.Item label='Page Name' name='PageName' initialValue={pageData.name}>
        <Input value={pageData.name} onChange={handleChange} />
      </Form.Item>
    </Form>
  );
};
