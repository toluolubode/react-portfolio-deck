import type { CaseStudy } from "../../data/case-studies";

/* ─── Slide types ─── */
export interface SlideBase {
  type: string;
  id: string;
}

export interface TitleSlide extends SlideBase {
  type: "title";
}

export interface TransitionSlide extends SlideBase {
  type: "transition";
}

export interface HubSlide extends SlideBase {
  type: "hub";
}

export interface ProjectIntroSlide extends SlideBase {
  type: "project-intro";
  study: CaseStudy;
  projectIndex: number;
  projectTotal: number;
}

export interface StakesSlide extends SlideBase {
  type: "stakes";
  study: CaseStudy;
}

export interface StrategySlide extends SlideBase {
  type: "strategy";
  study: CaseStudy;
}

export interface ReframeSlide extends SlideBase {
  type: "reframe";
  study: CaseStudy;
}

export interface WorkSlide extends SlideBase {
  type: "work";
  study: CaseStudy;
  sectionIndex: number;
}

export interface ResultsSlide extends SlideBase {
  type: "results";
  study: CaseStudy;
}

export interface ResearchSlide extends SlideBase {
  type: "research";
  study: CaseStudy;
}

export interface ExplorationFrameworkSlide extends SlideBase {
  type: "exploration-framework";
  study: CaseStudy;
}

export interface ExplorationOptionSlide extends SlideBase {
  type: "exploration-option";
  study: CaseStudy;
  optionIndex: number;
}

export interface ExplorationDecisionSlide extends SlideBase {
  type: "exploration-decision";
  study: CaseStudy;
}

export interface ClosingSlide extends SlideBase {
  type: "closing";
}

export interface WhoAmISlide extends SlideBase {
  type: "who-am-i";
}

export interface LookingForSlide extends SlideBase {
  type: "looking-for";
}

export interface DesignPhilosophySlide extends SlideBase {
  type: "design-philosophy";
}

export interface SolutionPreviewSlide extends SlideBase {
  type: "solution-preview";
  study: CaseStudy;
}

export interface PrototypeDemoSlide extends SlideBase {
  type: "prototype-demo";
  study: CaseStudy;
  prototypeUrl: string;
}

export interface BorrowellBeforeStateSlide extends SlideBase {
  type: "borrowell-before-state";
}

export interface BorrowellDecisionsSlide extends SlideBase {
  type: "borrowell-decisions";
}

export interface BorrowellAlignmentSlide extends SlideBase {
  type: "borrowell-alignment";
}

export interface BorrowellArchitectureSlide extends SlideBase {
  type: "borrowell-architecture";
}

export interface BorrowellSystemConstraintsSlide extends SlideBase {
  type: "borrowell-system-constraints";
}

export type Slide =
  | TitleSlide
  | TransitionSlide
  | HubSlide
  | WhoAmISlide
  | ProjectIntroSlide
  | StakesSlide
  | ReframeSlide
  | ResearchSlide
  | StrategySlide
  | ExplorationFrameworkSlide
  | ExplorationOptionSlide
  | ExplorationDecisionSlide
  | WorkSlide
  | ResultsSlide
  | LookingForSlide
  | DesignPhilosophySlide
  | SolutionPreviewSlide
  | PrototypeDemoSlide
  | BorrowellSystemConstraintsSlide
  | BorrowellBeforeStateSlide
  | BorrowellDecisionsSlide
  | BorrowellAlignmentSlide
  | BorrowellArchitectureSlide
  | ClosingSlide;