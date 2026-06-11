/* ══════════════════════════════════════════════════════
   VIGHNESH GARG — Personal Portfolio Data
   Single source of truth for all content
══════════════════════════════════════════════════════ */

export const GITHUB_USERNAME = 'Viggiji';

export const PERSON = {
  name: 'Vighnesh Garg',
  handle: 'VIGGIJI',
  title: 'CS Student & Tech Enthusiast',
  location: 'Mathura, UP — India',
  college: 'SRMIST KTR, Kattankulathur',
  coordinates: { lat: '12.8237', long: '80.0444' },
  bio: [
    '// about me',
    'A Techie from Mathura, UP.',
    'Trying to be Jack of all',
    'till I get the throne worth ruling.',
    'Improving by every second.',
    'Radhe-Radhe ॐ',
  ],
  photo: '/profpic.jpg',
  email: 'vighneshgarg96@gmail.com',
};

export const SOCIALS = [
  {
    label: 'GitHub',
    href: `https://github.com/${GITHUB_USERNAME}`,
    icon: 'code',
    cardImage: '/social_github.webp',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vighnesh-garg-84769726b/',
    icon: 'link',
    cardImage: '/social_linkedin.webp',
  },
  {
    label: 'LeetCode',
    href: 'https://leetcode.com/Viggiji/',
    icon: 'terminal',
    cardImage: '/social_leetcode.webp',
  },
  {
    label: 'Email',
    href: 'mailto:vighneshgarg96@gmail.com',
    icon: 'alternate_email',
    cardImage: '/social_email.webp',
  },
];

export const SKILLS = {
  tech: {
    label: 'Tech_Stack',
    items: ['HTML/CSS', 'JavaScript', 'Java', 'C++', 'Python', 'SQL'],
  },
  learning: {
    label: 'Currently_Learning',
    items: ['DSA', 'Vibe Coding', 'Artificial Intelligence', 'Machine Learning', 'React',],
  },
  soft: {
    label: 'Soft_Skills',
    items: ['Communication', 'Teamwork', 'Team Leadership', 'Critical Thinking'],
  },
  hobbies: {
    label: 'Hobbies.exe',
    items: ['Football', 'Guitar', 'Beatboxing', 'Watching Anime'],
  },
};

export const EDUCATION = [
  {
    level: 'B.Tech CSE with SWE',
    school: 'SRMIST KTR, Kattankulathur',
    score: '9.24 CGPA (till 3rd Sem)',
  },
  {
    level: 'Class 12th',
    school: 'The Asian School, Dehradun',
    score: '94%',
  },
  {
    level: 'Class 10th',
    school: 'St. Dominics Sr. Sec. School, Mathura',
    score: '88%',
  },
];

export const PRINCIPLES = [
  'Improving from failures.',
  'HardWork + Smartwork.',
  'Not hurting others for my own good.',
  'न कंचित् शाश्वतम्.',
];

export const NAV_ITEMS = [
  { id: 'about', label: '// 01. About', icon: 'person' },
  { id: 'skills', label: '// 02. Skills', icon: 'layers' },
  { id: 'projects', label: '// 03. Projects', icon: 'account_tree' },
  { id: 'chronicle', label: '// 04. Chronicle', icon: 'history_edu' },
  { id: 'contact', label: '// 05. Signal', icon: 'alternate_email' },
];

/* ── BGM Playlist ──────────────────────────────────── */
export const PLAYLIST = [
  { id: 'Z5NoQg8LdDk', title: 'Playing God', artist: 'Polyphia' },
  { id: 'hy2xPaC_428', title: 'This Is My Hardest Guitar Composition', artist: 'Marcin' },
];
