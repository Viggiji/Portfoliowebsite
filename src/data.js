/* ══════════════════════════════════════════════════════
   VIGHNESH GARG — Personal Portfolio Data
   Single source of truth for all content
══════════════════════════════════════════════════════ */

export const GITHUB_USERNAME = 'Viggiji';

export const PERSON = {
  name:     'Vighnesh Garg',
  handle:   'VIGGIJI',
  title:    'CS Student & Tech Enthusiast',
  location: 'Mathura, UP — India',
  college:  'SRMIST KTR, Kattankulathur',
  coordinates: { lat: '12.8237', long: '80.0444' },
  bio:      'A Techie from Mathura, UP. Trying to be Jack of all till I get the throne worth ruling. Improving by every second. Radhe-Radhe ॐ',
  photo:    '/profpic.jpg',
  email:    'YOUR_EMAIL_HERE',   // ⚠️ UPDATE: add your real email before deploying
};

export const SOCIALS = [
  {
    label: 'GitHub',
    href:  `https://github.com/${GITHUB_USERNAME}`,
    icon:  'code',
    cardImage: '/social_github.png',
  },
  {
    label: 'LinkedIn',
    href:  'https://www.linkedin.com/in/vighnesh-garg-84769726b/',
    icon:  'link',
    cardImage: '/social_linkedin.png',
  },
  {
    label: 'LeetCode',
    href:  'https://leetcode.com/Viggiji/',
    icon:  'terminal',
    cardImage: '/social_leetcode.png',
  },
  {
    label: 'Email',
    href:  'mailto:YOUR_EMAIL_HERE',  // ⚠️ UPDATE: add your real email
    icon:  'alternate_email',
    cardImage: '/social_email.png',
  },
];

export const SKILLS = {
  tech: {
    label: 'Tech_Stack',
    items: ['HTML', 'CSS', 'JavaScript', 'Java', 'C++', 'C', 'Python'],
  },
  learning: {
    label: 'Currently_Learning',
    items: ['Artificial Intelligence', 'Machine Learning', 'React'],
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
    level:   'B.Tech CSE with SWE',
    school:  'SRMIST KTR, Kattankulathur',
    score:   '9.24 CGPA (till 3rd Sem)',
  },
  {
    level:   'Class 12th',
    school:  'The Asian School, Dehradun',
    score:   '94%',
  },
  {
    level:   'Class 10th',
    school:  'St. Dominics Sr. Sec. School, Mathura',
    score:   '88%',
  },
];

export const PRINCIPLES = [
  'Improving from failures.',
  'HardWork + Smartwork.',
  'Not hurting others for my own good.',
  'न कंचित् शाश्वतम्.',
];

export const NAV_ITEMS = [
  { id: 'about',     label: '// 01. About',     icon: 'person'          },
  { id: 'skills',    label: '// 02. Skills',    icon: 'layers'          },
  { id: 'projects',  label: '// 03. Projects',  icon: 'account_tree'    },
  { id: 'contact',   label: '// 04. Signal',    icon: 'alternate_email' },
  { id: 'chronicle', label: '// 05. Chronicle', icon: 'history_edu'     },
];

/* ── BGM Playlist ──────────────────────────────────── */
export const PLAYLIST = [
  { id: 'Z5NoQg8LdDk', title: 'Playing God',                     artist: 'Polyphia' },
  { id: 'hy2xPaC_428', title: 'This Is My Hardest Guitar Composition', artist: 'Marcin' },
];
