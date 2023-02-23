import react, { useState } from 'react'
import './index.css'
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import { SurveyCreatorComponent, SurveyCreator } from "survey-creator-react";

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true
};

function SurveyEditor() {
  const creator = new SurveyCreator(creatorOptions);
  return (
    <div className="survey-editor">
      <SurveyCreatorComponent creator={creator} />
    </div>
  )
}

export default SurveyEditor