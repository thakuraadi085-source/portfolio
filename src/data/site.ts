// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to update personal info, links and copy.
// Leave a link as '' to show a "Not added yet" placeholder.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: 'Aditya Singh Rao',
  firstName: 'ADITYA',
  tagline: 'Engineering Ideas Into Reality.',
  subTagline:
    'From Software Engineering to Artificial Intelligence — Building Technology That Moves Beyond Imagination.',
  roles: [
    'Software Engineer',
    'AI Developer',
    'Full-Stack Developer',
    'Technology Researcher',
    'Automation & Robotics Enthusiast',
    'Game Developer',
  ],
  location: 'Nawalgarh, Rajasthan, India',
  /** Put your photo at public/profile.jpg — it is picked up automatically. */
  photo: '/profile.jpg',
  contact: {
    email: 'thakuraadi085@gmail.com',
    linkedin: 'https://www.linkedin.com/in/aditya-singh-rajput-020651309',
    github: 'https://github.com/thakuraadi085-source',
  },
  intro: [
    'I am Aditya Singh Rao, a multidisciplinary technology enthusiast, software developer, researcher, and MCA student passionate about engineering innovative digital solutions.',
    'My interests and development work span software engineering, full-stack development, web and Android applications, artificial intelligence, agentic AI, neural networks, cybersecurity, automation, robotics, game development, and modern UI/UX engineering.',
    'I enjoy researching, designing, experimenting, and building complete technology products — transforming ideas into practical software, intelligent systems, and interactive digital experiences.',
  ],
  about: [
    'I believe technology is more than writing code. It is the process of understanding problems, researching possibilities, designing intelligent systems, and turning ideas into practical solutions.',
    'My development interests span multiple areas of computing — from software engineering and web applications to artificial intelligence, automation, cybersecurity, robotics, and game development.',
    'I enjoy working independently on experimental ideas, building functional prototypes, learning emerging technologies, and exploring how different systems can work together.',
    'My long-term vision is to contribute to meaningful technological innovation by building intelligent, useful, and impactful digital products.',
  ],
  philosophy: 'Think Deeply. Build Boldly. Engineer the Future.',
  heroCards: [
    { title: 'Software Engineering', text: 'Custom software, ERP systems and full-stack web products built end to end.', tags: ['React', 'Android', 'APIs'] },
    { title: 'Applied AI', text: 'Chatbots, personal assistants and API-based AI integrations.', tags: ['Agents', 'LLM APIs', 'Automation'] },
    { title: 'Research Lab', text: 'Independent experiments in neural networks and agentic AI.', tags: ['Neural nets', 'SLMs', 'Multi-agent'] },
  ],
};

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'stack', label: 'Stack' },
  { id: 'projects', label: 'Projects' },
  { id: 'research', label: 'Research' },
  { id: 'build', label: 'Build' },
  { id: 'learning', label: 'Learning' },
  { id: 'contact', label: 'Contact' },
];

export const education = [
  {
    degree: 'Bachelor of Science (B.Sc.)',
    school: 'Podar College, Nawalgarh',
    place: 'Rajasthan, India',
    status: 'Completed' as const,
    note: 'Foundation in science and computing fundamentals.',
  },
  {
    degree: 'Master of Computer Applications (MCA)',
    school: 'Sobhasaria Group of Institutions, Sikar',
    place: 'Rajasthan, India',
    status: 'Currently pursuing' as const,
    note: 'Advanced study in software engineering, systems and applied computing.',
  },
];

export const capabilities = [
  'Custom Software Solutions',
  'Business Websites',
  'E-commerce Platforms',
  'School Management Software',
  'ERP Systems',
  'Android Applications',
  'AI Chatbots',
  'AI Personal Assistants',
  'Automation Systems',
  'Admin Dashboards',
  'Interactive Web Applications',
  'Game Prototypes',
  'Modern UI/UX Experiences',
  'API-Based Integrations',
  'Experimental AI Prototypes',
];

export const research = [
  { title: 'Brain-Inspired Computing', desc: 'Studying how biological neural principles can inform computing architectures.', label: 'Research Interest' },
  { title: 'Artificial Neural Network Architectures', desc: 'Exploring network structures, layers and learning behaviour through experiments.', label: 'Experiment' },
  { title: 'Neural Brain System Concepts', desc: 'Conceptual design of modular, brain-like system architectures.', label: 'Research Interest' },
  { title: 'Small Language Models', desc: 'Investigating compact language models that are efficient and trainable on modest hardware.', label: 'Experiment' },
  { title: 'Custom LLM Experimentation', desc: 'Hands-on experiments with building and adapting language-model pipelines.', label: 'Experiment' },
  { title: 'Agentic AI Systems', desc: 'AI agents that plan, use tools and act towards goals.', label: 'Research Interest' },
  { title: 'Multi-Agent Intelligence', desc: 'Coordination between multiple specialised agents.', label: 'Research Interest' },
  { title: 'Intelligent Automation', desc: 'Combining AI reasoning with workflow and device automation.', label: 'Research Interest' },
  { title: 'Human-Computer Interaction', desc: 'Interfaces that make complex systems feel natural to use.', label: 'Research Interest' },
  { title: 'Emerging Technology Research', desc: 'Tracking and experimenting with new tools and paradigms.', label: 'Research Interest' },
] as const;

export const learning = [
  { title: 'Agentic AI & Multi-Agent Systems', note: 'Tool use, planning loops, agent coordination.' },
  { title: 'Neural Networks & Small Language Models', note: 'Architectures, training, efficient inference.' },
  { title: 'Cybersecurity & Ethical Hacking', note: 'Web app security, vulnerability research, security testing.' },
  { title: 'Robotics & Hardware Integration', note: 'Connecting software intelligence to physical devices.' },
  { title: '3D Web & Creative Engineering', note: 'Motion, interactive 3D, premium interface craft.' },
  { title: 'System Design & Architecture', note: 'Designing scalable, maintainable software systems.' },
];
