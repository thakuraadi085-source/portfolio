export type Status =
  | 'Research Interest'
  | 'Experiment'
  | 'Prototype'
  | 'In Development'
  | 'Completed';

export type ProjectGroup = 'Software' | 'AI' | 'Web' | 'Automation' | 'Games';

export interface Project {
  slug: string;
  index: string;
  title: string;
  category: string;
  group: ProjectGroup;
  summary: string;
  description: string;
  /** Focus areas of the project. Edit to list only what is really implemented. */
  features: string[];
  tags: string[];
  /** Set only when you are sure about the real status. Leave undefined to hide the badge. */
  status?: Status;
  hue: number;
  links?: { live?: string; github?: string };
}

export interface SkillCategory {
  id: string;
  letter: string;
  title: string;
  blurb: string;
  focus: 'Building' | 'Learning' | 'Researching' | 'Exploring';
  items: string[];
}

export interface StackGroup {
  title: string;
  items: { name: string; state: 'Used' | 'Learning' | 'Exploring' }[];
}
