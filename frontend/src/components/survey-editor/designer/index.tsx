import type React from "react";
import { useEffect, useState, ComponentType } from "react";
import { Layout, List, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { setSurveyJson } from "../../../store/surveySlice";
import { setSelectedElementId, setSelectedElementData, setSelectedPageId, setEditorState } from "../../../store/editorSlice";
import { PlusCircleOutlined, BookOutlined } from "@ant-design/icons";
import { surveyComponentData } from "./surveyComponentData";
import { TextInputConfig } from "../customSurveyComponents/TextInput";
import { SortingConfig } from "../customSurveyComponents/Sorting";
import { PageComponentConfig } from "../customSurveyComponents/Page";
import Preview from "../preview";
import { nanoid } from "nanoid";
import {
  SurveyJson,
  SurveyComponentData,
  Page,
} from "../type";
import { createSurveyJson, querySelectedData, queryPageById } from "../utils";
import "./index.css";

export default function Designer() {
  const dispatch = useDispatch<AppDispatch>();
  const surveyJson = useSelector((state: RootState) => state.survey.surveyJson);
  const editorState = useSelector((state: RootState) => state.editor);
  // update surveyJson to store
  const handleSetSurveyJson = (surveyJson: SurveyJson) => {
    dispatch(setSurveyJson(surveyJson));
  };
  // coverly uupdate selected page to store
  const updateSelectedPageId = (pageId: string) => {
    dispatch(setSelectedPageId(pageId));
  };
  // coverly uupdate selected page to store
  const updateSelectedElementId = (elementId: string) => {
    dispatch(setSelectedElementId(elementId));
  };
  // coverly uupdate selected page to store
  const updateSelectedElementData = (elementData: SurveyComponentData) => {
    dispatch(setSelectedElementData(elementData));
  };
  // update partial editor state to store
  const updatePartialEditorState = (editorState: Partial<RootState["editor"]>) => {
    dispatch(setEditorState(editorState));
  };
  // update selected element data for config forms to load
  useEffect(() => {
    if (!editorState.selectedElementId) {
      return;
    }
    // find and update selected data
    const element: SurveyComponentData | null = querySelectedData(
      surveyJson,
      editorState.selectedElementId
    );
    if (!element) {
      return;
    }
    const eleType = element.type;
    const tmpSelectedElementData = { ...element };
    // update selected element data
    updateSelectedElementData(tmpSelectedElementData);
    // find and render config forms based on selected element
    // const config = surveyComponentData.filter(
    //   (item) => item.type === eleType
    // )[0].config;
    // if (!config) {
    //   console.log("[error] [designer/index.tsx] no config for this component");
    //   return;
    // }
    // // console.log('[debug] generate config forms by selectedData:', config, tmpSelectedElementData);
    // const tmpConfigForms: React.FC<ComponentConfigProps> = config;
    // // update config forms and it will be rendered on the right panel
    // setConfigForms(tmpConfigForms);
  }, [editorState.selectedElementId, editorState.selectedPageId]);

  // add a new component to surveyJson
  const addComponent = (componentType: string) => () => {
    let tmpSurveyJson = JSON.parse(JSON.stringify(surveyJson));
    // add component may add default page, so the selectedPage will be changed.
    let tmpSelectedPageId = editorState.selectedPageId;
    // add component will add new element, so the selectedElementtId will be changed.
    let tmpSelectedElementId = editorState.selectedElementId;
    if (!tmpSurveyJson) {
      // create a new survey data
      tmpSurveyJson = createSurveyJson(1);
    }
    // create a new component
    const newComponent: SurveyComponentData = {
      id: nanoid(9),
      name: componentType,
      type: componentType,
    };
    // update selectedElementId to the new component
    tmpSelectedElementId = newComponent.id;
    // if there is no selected page, add to the first page
    if (!editorState.selectedPageId) {
      if (
        !tmpSurveyJson ||
        !tmpSurveyJson.pages ||
        tmpSurveyJson.pages.length === 0
      ) {
        // create a new page
        const newPage = {
          id: nanoid(7),
          name: "Page 1",
          elements: [newComponent],
        };
        tmpSurveyJson.pages = [newPage];
        tmpSelectedPageId = newPage.id;
      } else {
        const page = tmpSurveyJson.pages[0];
        page.elements?.push(newComponent);
        tmpSelectedPageId = page.id;
      }
    } else {
      // add to the selected page
      tmpSurveyJson?.pages?.forEach((page: Page) => {
        if (page.id === editorState.selectedPageId) {
          page.elements?.push(newComponent);
        }
      });
    }
    // update state
    handleSetSurveyJson(tmpSurveyJson);
    updatePartialEditorState({
      selectedElementId: tmpSelectedElementId,
      selectedPageId: tmpSelectedPageId,
    });
  };

  // when select a page from left panel, update the selectedPage and selectedElementId
  const onSelectPage = (pageid: string) => {
    if (!pageid) {
      return;
    }
    const page = queryPageById(surveyJson, pageid);
    if(!page) {
      return;
    }
    // if there is no element in this page, set selectedElementId to null
    if (!page.elements || page.elements.length === 0) {
      updatePartialEditorState({
        selectedElementId: null,
        selectedPageId: pageid,
      });
      return;
    }
    updatePartialEditorState({
      selectedElementId: page.elements[0].id,
      selectedPageId: pageid,
    });
  };

  // according to componentId to find the component in surveyJson and additional update it
  // coverly update the surveyJson data to store
  const upadteSurveyJson = (
    componentId: string,
    data: SurveyComponentData,
    isPage?: boolean
  ) => {
    let tmpSurveyJson = JSON.parse(JSON.stringify(surveyJson));
    // console.log(`[debug] update surveyJson: ${componentId}, ${data}, ${isPage}, ${tmpSurveyJson}`);
    if (!tmpSurveyJson || !tmpSurveyJson.pages || !Array.isArray(tmpSurveyJson.pages)) {
      console.log("[error] [designer/index.tsx] surveyJson is not valid")
      return;
    }
    if(isPage) {
      // find the target page and update the data
      let findTargetPage = false;
      for(let i = 0; i < tmpSurveyJson.pages.length; i++) {
        if(tmpSurveyJson.pages[i].id === componentId) {
          tmpSurveyJson.pages[i] = {...tmpSurveyJson.pages[i], ...data};
          findTargetPage = true;
          break;
        }
      }
      if(!findTargetPage) {
        console.log("[error] [designer/index.tsx] cannot find target page in surveyJson");
      }
      handleSetSurveyJson(tmpSurveyJson);
      return;
    }
    let findTargetElement = false;
    tmpSurveyJson?.pages?.forEach((page: Page) => {
      if (findTargetElement) {
        return;
      }
      // if page.elements is not an array, return
      if (!Array.isArray(page.elements) || page.elements?.length === 0) {
        return;
      }
      for (let i = 0; i < page.elements.length; i++) {
        if (page.elements[i].id === componentId) {
          page.elements[i] = {...page.elements[i], ...data};
          findTargetElement = true;
          break;
        }
      }
    });
    if (!findTargetElement) {
      console.log(
        "[error] [designer/index.tsx] cannot find target element in surveyJson"
      );
      return;
    }
    handleSetSurveyJson(tmpSurveyJson);
  };

  // console.log('[debug] [designer/index.tsx] surveyJson:', surveyJson)
  // console.log('[debug] [designer/index.tsx] editorState:', editorState)

  return (
    <Layout className="designer">
      <div className="menu-panel">
        <List
          itemLayout="horizontal"
          header={
            <div>
              <h2>{surveyJson?.surveyName || "Untitled Survey"}</h2>
            </div>
          }
          dataSource={surveyJson?.pages || []}
          renderItem={(item) => (
            <List.Item>
              <Button
                onClick={()=>onSelectPage(item.id)}
                className="menu-item-button"
                type="ghost"
                block
                size="large"
                icon={<BookOutlined />}
              >
                {item.title}
              </Button>
            </List.Item>
          )}
        />
        {/* <List
          itemLayout="horizontal"
          header={<div><h2>Components</h2></div>}
          dataSource={surveyComponentData}
          renderItem = {(item) => (<List.Item>
            <Button className="menu-item-button" type="ghost" block size="large" onClick={addComponent(item.type)} icon={<PlusCircleOutlined />}>{item.name}</Button>
          </List.Item>)} 
        /> */}
      </div>
      <div className="preview-panel">
          {surveyJson && <Preview />}
          {!surveyJson &&
          <Button type="default" size="large" icon={<PlusCircleOutlined />}>
            Add Components
          </Button>}
      </div>
      <div className="config-panel">
        <div className="configForm">
          {/* {ConfigForms && selectedElementData && <ConfigForms data={selectedElementData} updateData={upadteSurveyJson} />} */}
          {editorState.selectedPageId && (
            <PageComponentConfig updateData={upadteSurveyJson} />
          )}
          {editorState.selectedElementData && editorState.selectedElementData.type === "text" && (
            <TextInputConfig updateData={upadteSurveyJson} />
          )}
          {editorState.selectedElementData && editorState.selectedElementData.type === "sortcard" && (
            <SortingConfig updateData={upadteSurveyJson} />
          )}
        </div>
      </div>
    </Layout>
  );
}