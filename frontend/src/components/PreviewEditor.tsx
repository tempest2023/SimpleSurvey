import React, { useEffect, useState, useRef } from "react";
import { Row, Col, MenuProps, Card, Image, Carousel, Button } from "antd";
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
  const carouselRef = useRef(null);

  useEffect(() => {
    // console.log("[debug] preview-editor", formData);
    const tmp = [];
    for (let i = 0; i < formData.categoryList.length; i++) {
      tmp.push(
        <div key={`cardCategory_${i}`} className="preview-editor-category">
          {/* {formData.categoryList[i].title} */}
          <Card style={{ width: 300, height: 150, textAlign: "center", justifyContent: "center"}}>
            
            <p>{formData.categoryList[i].title}</p>
          </Card>
        </div>
      );
    }
    setCategoryList(tmp);
  }, [formData]);

  useEffect(() => {
    // console.log("[debug] preview-editor", formData);
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

  const handleNextClick = () => {
    // Check if the current index is not already at the last index
    carouselRef.current.next();
  };
  const handlePrevClick = () => {
    // Check if the current index is not already at the last index
    carouselRef.current.prev();
  };
  return (
    <div className="preview-editor-container">
      <Carousel
        ref={carouselRef}
        dots={false}
        infinite={false}
        className="preview-editor-images"
      >
        {cardList.length > 0 && cardList}
        {cardList.length <= 0 && (
          <div>
            <h3>Please upload some images</h3>
          </div>
        )}
      </Carousel>

     <div>
        <Button type="dashed" onClick={handlePrevClick}>
          Prev Card
        </Button>

        <Button type="dashed" onClick={handleNextClick}>
          Next Card
        </Button>
      </div>
      <br />
      <br />
      <br /> 
     
      <div className="preview-editor-category">
        {categoryList.length > 0 && categoryList}
        {categoryList.length <= 0 && (
          <div>
            <h3>Please upload some categories</h3>
          </div>
        )}
      </div>
     
    </div>
  );
};

export default PreviewEditor;
