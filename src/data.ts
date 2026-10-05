export type SectionId = 'about' | 'projects' | 'experience' | 'skills' | 'contact';

export interface Spot {
  id: SectionId;
  num: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  ox: number;
  oy: number;
  color: string;
  kana: string;
  icon: string;
}

export const IMG_W = 1448;
export const IMG_H = 1086;

export const spots: Spot[] = [
  { id: 'about', num: '01', label: 'ABOUT', x: 27.6, y: 21.3, w: 8.3, h: 3.4, ox: 32.8, oy: 27.6, color: '#5ff3ff', kana: '自己紹介', icon: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8a4 4 0 1 0 0-8' },
  { id: 'projects', num: '02', label: 'PROJECTS', x: 19.9, y: 40.0, w: 10.2, h: 3.4, ox: 28.4, oy: 46.8, color: '#ff4fb8', kana: 'プロジェクト', icon: 'M21 8 12 3 3 8v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8' },
  { id: 'experience', num: '03', label: 'EXPERIENCE', x: 53.7, y: 10.9, w: 9.8, h: 3.2, ox: 54.9, oy: 17.3, color: '#5ff3ff', kana: '経験', icon: 'M4 7h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2 M3 13h18' },
  { id: 'skills', num: '04', label: 'SKILLS', x: 73.6, y: 42.6, w: 8.7, h: 3.4, ox: 75.5, oy: 49.3, color: '#ff4fb8', kana: '技術', icon: 'M4 17l6-6-6-6 M12 19h8' },
  { id: 'contact', num: '05', label: 'CONTACT', x: 83.5, y: 15.8, w: 9.8, h: 3.4, ox: 89.2, oy: 22.6, color: '#ffc46b', kana: '連絡', icon: 'M3 5h18v14H3z M3 6l9 7 9-7' },
];

// [x, y, w, h, color, animation, duration s] in image px
export const signs: [number, number, number, number, string, string, number][] = [
  [1372, 210, 70, 265, '#ff2d7a', 'flkA', 5.3],
  [700, 605, 55, 110, '#ff2d7a', 'flkB', 6.1],
  [312, 230, 40, 115, '#ff3d6e', 'flkA', 7.7],
  [815, 180, 60, 215, '#3fb8ff', 'breathe', 4.2],
  [812, 475, 82, 110, '#9a6bff', 'breathe', 5.6],
  [1238, 500, 104, 148, '#2f7dff', 'flkB', 9.4],
  [1232, 712, 112, 205, '#3a8bff', 'breathe', 6.8],
  [1035, 425, 28, 130, '#e04bff', 'flkA', 4.9],
  [1145, 335, 32, 75, '#ff3d8a', 'flkB', 3.7],
  [70, 450, 55, 75, '#ff8a3a', 'breathe', 3.1],
  [795, 705, 50, 120, '#ff6fa8', 'flkB', 8.2],
  [790, 0, 40, 40, '#ff2d7a', 'flkA', 6.6],
];

export const ZOOM = 2.8;

// effect toggles
export const GLITCH_CARDS = true;
export const NEON_CURSOR = true;
