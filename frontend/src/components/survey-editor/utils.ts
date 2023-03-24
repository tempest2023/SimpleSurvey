import { SurveyJson } from "./type"
import { nanoid } from "nanoid"

export const createSurveyJson = (pagesNumber: number): SurveyJson => {
  const pages = []
  for (let i = 0; i < pagesNumber; i++) {
    pages.push({
      id: nanoid(),
      name: `Page ${i + 1}`,
      elements: [],
    })
  }
  return {
    _surveyId: nanoid(),
    surveyName: "Untitled Survey",
    pages,
  }
}