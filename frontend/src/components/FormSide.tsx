import * as React from 'react';
import { Form, Input, Button } from 'antd';
import { useState, useCallback } from 'react';



const FormSide: React.FC = () => {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    Option1: '',
    Option2: '',
    Option3: '',
    Option4: ''
  });

  const handleChange = useCallback(event => {
    const { name, value } = event.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(event => {
    event.preventDefault();
    const formData = {
      title: formState.title,
      description: formState.description,
      Option1: formState.Option1,
      Option2: formState.Option2,
      Option3: formState.Option3,
      Option4: formState.Option4,
      
    };
    const formDataJson = JSON.stringify(formData);
    window.alert(formDataJson);
    // submit the form data as JSON
  }, [formState]);

  return (
    
    <Form layout="vertical" onSubmitCapture={handleSubmit}>
    <Form.Item label="title">
    <Input.TextArea name="title" onChange={ handleChange}/>
    </Form.Item >

    <Form.Item label="description">
      <Input.TextArea name="description" onChange={ handleChange}/>
    </Form.Item>

    <Form.Item label="Option1">
      <Input name="Option1" onChange={ handleChange}/>
    </Form.Item>

    <Form.Item label="Option2">
      <Input name="option2" onChange={ handleChange}/>
    </Form.Item>

    <Form.Item label="Option3">
      <Input name="Option3" onChange={ handleChange}/>
    </Form.Item>

    <Form.Item label="Option4">
      <Input name="Option4" onChange={ handleChange}/>
    </Form.Item>

    <Form.Item>
      <button type="primary" onClick={handleSubmit}>Submit</button>
    </Form.Item>
    </Form>
      ) 
  }



 export default FormSide;