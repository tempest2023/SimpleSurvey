import { SurveyJson, SurveyComponentData, Page } from "./type"
import { nanoid } from "nanoid"


export const createSurveyJson = (pagesNumber: number): SurveyJson => {
  const pages = []
  for (let i = 0; i < pagesNumber; i++) {
    pages.push({
      id: nanoid(),
      title: `Page ${i + 1}`,
      elements: [],
      description: `This is the Page ${i + 1}`,
    })
  }
  return {
    _surveyId: nanoid(),
    surveyName: "Untitled Survey",
    pages,
  }
}
// create a 2 page survey json with sorting component and rank component.
export const createSortRankSurveyJson = (): SurveyJson => {
  const pages = [
    {
      id: nanoid(),
      title: "Page 1",
      description: "This is the page 1",
      elements: [
        {
          id: nanoid(),
          type: "sortcard",
          name: "sortcard",
        }
      ]
    },
    {
      id: nanoid(),
      title: "Page 2",
      description: "This is the page 2",
      elements: [
        {
          id: nanoid(),
          type: "rank",
          name: "rank",
        }
      ]
    }
  ]
  return {
    _surveyId: nanoid(),
    surveyName: "ASSIST Functional Performance Index",
    pages,
  }
}

export const loadSurveyJsonFromLocalStorage = (): SurveyJson | null => {
  const data = localStorage.getItem("surveyJson") || "";
  try{
    return JSON.parse(data);
  } catch (e) {
    console.log(`[error] [survey-editor/utils:loadSurveyJsonFromLocalStorage] ${e}`);
  }
  return null;
}

// iterate surveyJson to find selected element
export const querySelectedData = (
  data: SurveyJson | null,
  elementId: string | null,
  selectedPageId?: string
): SurveyComponentData | null => {
  if(!data || !elementId) {
    return null;
  }
  let res = null;
  data?.pages?.forEach((page) => {
    // if there is no selectedPageId or the page id is equal to selectedPageId, then we will find the element
    if (!selectedPageId || page.id === selectedPageId) {
      page.elements?.forEach((element) => {
        if (element.id === elementId) {
          res = element;
        }
      });
    }
  });
  return res;
};

// iterate surveyJson to find selected element
export const queryPageById = (data: SurveyJson | null, pageId: string | null): Page|null => {
  let res = null;
  if(!pageId || !data) {
    return res;
  }
  data?.pages?.forEach((page) => {
    if (page.id === pageId) {
      res = page;
    }
  }
  );
  return res;
}

export const ellipseString = (str: string, length: number): string => {
  if (str.length > length) {
    return str.slice(0, length) + '...';
  }
  return str;
}