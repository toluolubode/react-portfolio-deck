import React from "react";
import * as Slides from "./slides";

export interface SlideConfig {
  id: string;
  component: React.ComponentType<any>;
  theme?: "dark" | "light" | "custom";
}

export const SLIDES: SlideConfig[] = [
  {
    id: "title",
    component: Slides.TitleSlideContent,
  },
  {
    id: "intro",
    component: Slides.ProjectIntroSlideContent,
  },
  {
    id: "transition",
    component: Slides.TransitionSlideContent,
  },
  {
    id: "results",
    component: Slides.ResultsSlideContent,
  },
  {
    id: "closing",
    component: Slides.ClosingSlideContent,
  },
];
