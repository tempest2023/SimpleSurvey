import React, { useEffect, useState } from "react";
import { Row, Col, MenuProps, Card, Image } from "antd";
import { SurveyJsonSchema } from "./SurveySchemaType";

import "./preview-editor.css";

const { Meta } = Card;

const gridStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
};

const PreviewEditor = (props) => {
  const formData: SurveyJsonSchema = props.formData;
  const [cardList, setCardList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    console.log("[debug] preview-editor", formData);
    const tmp = [];

    for (let i = 0; i < formData.categoryList.length; i++) {
      tmp.push(
        <div className="site-card-wrapper">
        
         
            <Card title="Card title" bordered={false}>
              {formData.categoryList[i].title}
            </Card>
        
      </div>
      );
    }
    setCategoryList(tmp);
  }, [formData]);




  useEffect(() => {
    console.log("[debug] preview-editor", formData);
    const tmp = [];

    for (let i = 0; i < formData.cardList.length; i++) {
      tmp.push(
        <Card
          className="preview-editor-card"
          key={`cardImage_${i}`}
          hoverable
          cover={
            <Image
              style={{ width: "100%", height: "100%" }}
              src={formData.cardList[i].cardImage}
            ></Image>
          }
        >
          <Meta title={formData.cardList[i].description} />
          {/* {formData.categoryList} */}
        </Card>
      );
    }
    setCardList(tmp);
  }, [formData]);

  const len = cardList.length;
  return (
    <div className="preview-editor-container">
      <div></div>
      <div className="preview-editor-images">
        {cardList.length > 0 && cardList}
        {cardList.length <= 0 && <div>Please upload some images</div>}

        {categoryList.length > 0 && categoryList}
        {categoryList.length <= 0 && <div>Please upload some categories</div>}
      </div>
     
    </div>
  );
};

export default PreviewEditor;
