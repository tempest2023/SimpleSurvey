import React, { useState } from "react";
import { Card, Category, SurveyJsonSchema } from "./SurveySchemaType";
import { message, Button, Upload, Input, Divider } from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import "./formside.css";


type Props = {
  survey: SurveyJsonSchema;
  updateParentState: (
    state: SurveyJsonSchema | ((arg0: SurveyJsonSchema) => SurveyJsonSchema)
  ) => void;
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const Form: React.FC<Props> = ({ updateParentState }) => {
  const [loading, setLoading] = useState(false);

  const defaultCardList = [{ id: "1", description: "", cardImage: "" }];

  const defaultCategoryList = [{ id: "1", title: "" }];

  const [cards, setCards] = useState<Card[]>(defaultCardList);
  const [categories, setCategories] = useState<Category[]>(defaultCategoryList);

  const handleAddCard = () => {
    const newCards = [...cards, { id: "", description: "", cardImage: "" }];
    setCards(newCards);
    updateParentState((prevState: SurveyJsonSchema) => ({
      ...prevState,
      cardList: newCards,
    }));
  };

  const handleDeleteCard = (idx: number) => {
    const newCards = cards.filter((_, i) => i !== idx);
    setCards(newCards);
    updateParentState((prevState: SurveyJsonSchema) => ({
      ...prevState,
      cardList: newCards,
    }));
  };

  //category

 

  const handleAddCategory = () => {
    const newCategory = [...categories, { id: "", title: "" }];
    setCategories(newCategory);
    updateParentState((prevState: SurveyJsonSchema) => ({
      ...prevState,
      categoryList: newCategory,
    }));
  };

  const handleDeleteCategory = (idx: number) => {
    const newCategory = categories.filter((_, i) => i !== idx);
    setCategories(newCategory);
    updateParentState((prevState: SurveyJsonSchema) => ({
      ...prevState,
      categoryList: newCategory,
    }));
  };

  const handleTitleChange = (idx: number) => (event) => {
    const updatedCategories = [...categories];
    updatedCategories[idx] = { ...categories[idx], title: event.target.value };
    setCategories(updatedCategories);
    updateParentState((prevState: SurveyJsonSchema) => ({
      ...prevState,
      categoryList: updatedCategories,
    }));
  };


  const handleDescriptionChange = (idx: number) => (event) => {
    const updatedCards = [...cards];
    updatedCards[idx] = { ...cards[idx], description: event.target.value };
    setCards(updatedCards);
    updateParentState((prevState: SurveyJsonSchema) => ({
      ...prevState,
      cardList: updatedCards,
    }));
  };
  const handleUploadChange =
    (idx: number) => (info: UploadChangeParam<UploadFile>) => {
      if (info.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj as RcFile, (url) => {
          setLoading(false);
          console.log("[debug] base64 url: " + url);
          const updatedCards = [...cards];
          updatedCards[idx] = { ...cards[idx], cardImage: url as string };
          setCards(updatedCards);
          // {transfer url to parent component}
          updateParentState((prevState: SurveyJsonSchema) => ({
            ...prevState,
            cardList: updatedCards,
          }));
        });
      }
    };

  const uploadImageRequest = (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    onSuccess(file);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Button type="button" onClick={handleAddCard} icon={<PlusOutlined />}>
        <b> Add Card</b>
      </Button>
      {cards.map((card, idx) => (
        <div key={card.id}>
          <label htmlFor={`description_${idx}`}>Description</label>
          <Input
            name={`description_${idx}`}
            type="text"
            value={card.description}
            onChange={handleDescriptionChange(idx)}
          />
          <div className="form-upload-div" style={{ marginTop: 10 }}>
            <Upload
              name="cardImage"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange(idx)}
              customRequest={uploadImageRequest}
            >
              {card.cardImage ? (
                <img
                  src={card.cardImage}
                  alt="avatar"
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
            <Button
              type="button"
              onClick={() => handleDeleteCard(idx)}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </div>
          <Divider />
        </div>
      ))}


      <Button type="button" onClick={handleAddCategory} icon={<PlusOutlined />}>
        <b>Add Category</b>
      </Button>
      {categories.map((category, idx) => (
        <div key={category.id}>
          <label htmlFor={`title_${idx}`}>Title</label>
          <Input
            name={`title_${idx}`}
            type="text"
            value={category.title}
            onChange={handleTitleChange(idx)}
          />
          <div className="form-upload-div" style={{ marginTop: 10 }}>
           
            <Button
              type="button"
              onClick={() => handleDeleteCategory(idx)}
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </div>
          <Divider />
        </div>
      ))}
    </>
  );
};

export default Form;
