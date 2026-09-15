export type Theme='Priorités'|'Signalisation'|'Vitesse'|'Sécurité'|'Usagers'|'Comportement';
export type Difficulty='facile'|'moyen'|'difficile';
export type QuestionType='single'|'multiple'|'sign'|'intersection'|'situation';
export interface Question {id:string;text:string;theme:Theme;subtheme:string;difficulty:Difficulty;type:QuestionType;options:string[];answers:number[];explanation:string;tip?:string;source?:string;verification:'vérifié'|'à vérifier NC';visual?:string}
export interface Mastery {attempts:number;correct:number;errors:number;lastError?:string;lastSuccess?:string;score:number}
export interface Exam {date:string;score:number;total:number;passed:boolean;byTheme:Record<string,{correct:number;total:number}>}
export interface DayStat {date:string;correct:number;total:number}
export interface AppState {mastery:Record<string,Mastery>;exams:Exam[];days:DayStat[];xp:number;streak:number;examDate:string;sound:boolean;animations:boolean;threshold:number}
