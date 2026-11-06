import type { SkillCategory, StackGroup } from '../types';

// `focus` is an honest, editable indicator of how each area is approached —
// it is NOT a proficiency score. Change it whenever it stops being accurate.
export const skillCategories: SkillCategory[] = [
  {
    id: 'software', letter: 'A', title: 'Software Engineering', focus: 'Building',
    blurb: 'Designing and building complete software systems.',
    items: ['Software Engineering', 'Software Development', 'Software Architecture', 'System Design', 'Full-Stack Development', 'Desktop Application Development', 'Enterprise Software', 'Custom Software Solutions', 'Backend Engineering', 'API Development', 'API Integration', 'Database Management', 'ERP Systems', 'System Optimization', 'Software Testing and Debugging'],
  },
  {
    id: 'web', letter: 'B', title: 'Web Development', focus: 'Building',
    blurb: 'Responsive, modern websites and web applications.',
    items: ['Frontend Development', 'Backend Development', 'Full-Stack Web Development', 'Static Website Development', 'Dynamic Website Development', 'E-commerce Development', 'Business Websites', 'Educational Websites', 'Admin Dashboards', 'Responsive Web Design', 'React Development', 'TypeScript', 'Modern Web Interfaces', 'React Animations', 'Interactive Web Experiences', 'API Integration', 'Web Performance Optimization'],
  },
  {
    id: 'mobile', letter: 'C', title: 'Mobile & Application', focus: 'Building',
    blurb: 'Android apps and cross-device application development.',
    items: ['Android App Development', 'APK Development', 'Cross-Platform Development', 'Mobile UI/UX', 'Mobile-to-PC Connectivity', 'Offline-First Applications', 'Smart TV Interface Development', 'Application Packaging and Deployment'],
  },
  {
    id: 'ai', letter: 'D', title: 'Artificial Intelligence', focus: 'Researching',
    blurb: 'Applied AI integration alongside ongoing research and experimentation.',
    items: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Artificial Neural Networks', 'Agentic AI', 'AI Agents', 'Multi-Agent Systems', 'Large Language Models', 'Small Language Models', 'Custom LLM Research', 'AI Chatbot Development', 'AI Virtual Assistants', 'Natural Language Processing', 'AI API Integration', 'AI-Powered Automation', 'Intelligent Software Systems', 'Brain-Inspired Computing Research', 'Neural Brain Architecture Experimentation'],
  },
  {
    id: 'security', letter: 'E', title: 'Cybersecurity', focus: 'Learning',
    blurb: 'Security research and testing fundamentals.',
    items: ['Ethical Hacking', 'Cybersecurity Research', 'Web Application Security', 'Vulnerability Research', 'Network Security Fundamentals', 'Security Testing', 'Security Tools and Platforms', 'System Security', 'Cybersecurity Automation'],
  },
  {
    id: 'automation', letter: 'F', title: 'Automation & Robotics', focus: 'Exploring',
    blurb: 'Connecting software intelligence to devices and workflows.',
    items: ['Workflow Automation', 'Desktop Automation', 'Mobile-to-PC Automation', 'AI-Powered Automation', 'Smart Device Integration', 'Robotics Research', 'Hardware-Software Integration', 'Remote Device Control', 'Intelligent Control Systems', 'Automation Engineering'],
  },
  {
    id: 'games', letter: 'G', title: 'Game Development', focus: 'Building',
    blurb: 'Interactive worlds and gameplay in Unity and Godot.',
    items: ['Unity Game Development', 'Godot Game Development', '2D Game Development', '3D Game Development', 'Cinematic Environments', 'Game Mechanics', 'Player Movement Systems', 'Game UI/UX', 'Terrain and Environment Design', 'Game Optimization', 'Interactive Gameplay Development'],
  },
  {
    id: 'design', letter: 'H', title: 'UI/UX & Creative Engineering', focus: 'Building',
    blurb: 'Premium interfaces, motion and interactive experiences.',
    items: ['UI/UX Design', 'Modern Interface Design', 'Premium Web Experiences', 'Interactive UI', '3D Web Experiences', 'Motion Design', 'React Animations', 'Responsive Design Systems', 'Dashboard Design', 'E-commerce UI', 'Mobile UI', 'Smart TV UI Modernization', 'User Experience Optimization'],
  },
  {
    id: 'research', letter: 'I', title: 'Research & Innovation', focus: 'Researching',
    blurb: 'Independent technology research and prototype engineering.',
    items: ['Independent Technology Research', 'AI Research and Development', 'Neural Network Research', 'Brain-Inspired Computing', 'Experimental Software Development', 'Prototype Engineering', 'Technology Exploration', 'Product Innovation', 'System Architecture Research'],
  },
];

export const stack: StackGroup[] = [
  { title: 'Frontend', items: [{ name: 'HTML', state: 'Used' }, { name: 'CSS', state: 'Used' }, { name: 'JavaScript', state: 'Used' }, { name: 'TypeScript', state: 'Used' }, { name: 'React', state: 'Used' }] },
  { title: 'Application Development', items: [{ name: 'Flutter', state: 'Used' }, { name: 'Dart', state: 'Used' }, { name: 'Android Development', state: 'Used' }] },
  { title: 'Game Development', items: [{ name: 'Unity', state: 'Used' }, { name: 'Godot', state: 'Used' }] },
  { title: 'Programming', items: [{ name: 'C', state: 'Used' }, { name: 'C++', state: 'Used' }, { name: 'Java', state: 'Used' }, { name: 'Python', state: 'Used' }, { name: 'JavaScript', state: 'Used' }] },
  { title: 'Backend & Database', items: [{ name: 'PHP', state: 'Used' }, { name: 'Node.js', state: 'Used' }, { name: 'MySQL', state: 'Used' }, { name: 'Supabase', state: 'Used' }, { name: 'REST APIs', state: 'Used' }] },
  { title: 'Development Tools', items: [{ name: 'VS Code', state: 'Used' }, { name: 'Git', state: 'Used' }, { name: 'GitHub', state: 'Used' }, { name: 'PowerShell', state: 'Used' }] },
  { title: 'AI & Research', items: [{ name: 'Neural Networks', state: 'Exploring' }, { name: 'Agentic AI', state: 'Exploring' }, { name: 'LLMs', state: 'Exploring' }, { name: 'Machine Learning', state: 'Learning' }] },
];
