import react, { useState } from 'react';
import { Form, Input } from 'antd';
import { Divider, List, Button } from 'antd';
import { TextInputData, TextInputConfigProps, TextInputProps } from './type';

// A TextInput implemented by Ant Design form
export const TextInput: React.FC<TextInputProps> = ({ label, data, syncData, name, rules }) => {
  const [value, setValue] = useState<string | undefined>(data[name]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    syncData(name, newValue);
  };

  return (
    <Form.Item label={label} name={name} initialValue={data[name]} rules={rules}>
      <Input value={value} onChange={handleChange} />
    </Form.Item>
  );
};

// View component for TextInput
export const TextInputView = ({ data }: { data: TextInputData }) => {
  const [textData, setTextData] = useState<TextInputData>(data);
  const handleUpdateData = (name: string, value: string) => {
    setTextData({ ...textData, [name]: value });
  };
  return (
    <Form>
      <TextInput label={textData.title} data={textData} syncData={handleUpdateData} name='vaue' rules={[{ required: false }]}/>
    </Form>
  );
}

// Config component for TextInput
export function TextInputConfig(props: TextInputConfigProps) {
  // console.log('[debug] TextInputConfig props:', props);
  if(!props) {
    return <div>Error: Props is undefined</div>;
  }
  const { data, updateData } = props;
  const [textData, setTextData] = useState<TextInputData>(data as TextInputData);

  const handleUpdateData = (name: string, value: string) => {
    updateData(data.id, {
      ...textData, [name]: value,
    }, false);
    setTextData({ ...textData, [name]: value });
  };


  return (
    <Form
      layout="vertical"
    >
      <TextInput
          label="Question Title"
          data={textData}
          syncData={handleUpdateData}
          name="title"
          rules={[{ required: true, message: "Please input your question title" }]}
        />
    </Form>
  );
};
