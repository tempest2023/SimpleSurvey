import * as React from "react";
import { Form, Input, Button, Upload } from "antd";
import { useState, useCallback, useEffect} from "react";
import { resolve } from "path";
import { InputNumber } from "antd";
import { SurveyJsonSchema, Card } from "./SurveySchemaType";
import "./formside.css";

const ImageForm: React.FC = ({handleChange, onImageUpload}) => {
  
  return (
    <div>
      <Form.Item label="description">
        <Input.TextArea name="description" onChange={handleChange} />
      </Form.Item>

      <Form.Item label="Card Image">
        <Input type="file" name="card image" onChange={onImageUpload} />
      </Form.Item>
    </div>
  );
};

type FormSideProps = {
  updateParentFormData: (formData: SurveyJsonSchema | ((arg0: SurveyJsonSchema) => SurveyJsonSchema)) => void;
};


const FormSide: React.FC<FormSideProps> = (props) => {
  const { updateParentFormData } = props;
  const [formData, setFormData] = useState<SurveyJsonSchema>({
    cardCount: 0,
    cardList: [],
    categoryCount: 0,
    categoryList: []
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const cardInputs = formData.cardList.map(card => (
    <div key={card.id}>
      <Form.Item label="Card Image">
        <Input type="file" name="card image" value={card.cardImage} onChange={onImageUpload} />
      </Form.Item>
      <Form.Item label="description">
        <Input.TextArea name="description" value={card.description} onChange={handleChange} />
      </Form.Item>
    </div>
  ));
  

//   useEffect(() => {
//     console.log('[debug] preview-editor', formData);
//     const tmp = [];
//     for(let i=0; i<formData.cardCount; i++) {
//       tmp.push();
//     }
//     setCardList(tmp);
// }, [formData])

  const onImageLoadCallback = (e) => {
    // base64 string
    const tmp = e.target.result;
    console.log(tmp);
    
    // TODO: Update Parent State

    console.log("[debug] formdata update image", tmp);
  };


  const onImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = onImageLoadCallback;
    reader.readAsDataURL(file);
  };

  const onCardNumberChange = (value: number) => {
    if (!value) {
      return;
    }
    const tmp: Array<Card> = [];
    for (let i = 0; i < value; i++) {
      tmp.push({
        cardImage: '',
        description: ''
      })
    }
    // update to parent state
    updateParentFormData((prevState: SurveyJsonSchema) => ({
      ...prevState,
      cardCount: value,
    }));
  };

  



  return (
    <Form
      className="formside-form"
      layout="vertical"
      className="form-left"
      style={{ marginLeft: 14 }}
    >

      <Form.Item label="Image Count">
        <InputNumber
          className="formside-card-count"
          min={1}
          max={5}
          defaultValue={3}
          onChange={onCardNumberChange}
          style={{ float: "left" }}
        />
      </Form.Item>

      <h3>Add cards and upload images</h3>
       
      {cardInputs}

      <h3>Input to add the Categories</h3>
      <Form.Item label="card categories">
        <Input.TextArea name="card_categories" onChange={handleChange} />
      </Form.Item>
    </Form>
  );
};

export default FormSide;
