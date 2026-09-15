import {describe,expect,it} from 'vitest';
import {questions} from './questions';

describe('question bank',()=>{
  it('contains 88 unique questions',()=>{
    expect(questions).toHaveLength(88);
    expect(new Set(questions.map(question=>question.id)).size).toBe(88);
  });

  it('keeps every answer index inside its option list',()=>{
    for(const question of questions){
      expect(question.answers.length).toBeGreaterThan(0);
      expect(question.answers.every(index=>index>=0&&index<question.options.length)).toBe(true);
    }
  });
});
