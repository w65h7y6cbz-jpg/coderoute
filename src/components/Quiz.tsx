import {useEffect,useState} from 'react';
import type {Question} from '../types';
import {sameAnswers} from '../lib/engine';
import {useStore} from '../store';
import {Visual} from './Visual';

type CoachResponse={answer?:string;error?:string};

export function Quiz({items,exam=false,onFinish}:{items:Question[];exam?:boolean;onFinish?:(answers:Record<string,number[]>)=>void}){
  const {answer,state}=useStore();
  const [i,setI]=useState(0);
  const [chosen,setChosen]=useState<number[]>([]);
  const [checked,setChecked]=useState(false);
  const [all,setAll]=useState<Record<string,number[]>>({});
  const [coachPrompt,setCoachPrompt]=useState('');
  const [coachAnswer,setCoachAnswer]=useState('');
  const [coachError,setCoachError]=useState('');
  const [coachLoading,setCoachLoading]=useState(false);
  const current=items[i];

  function toggle(n:number){
    if(checked)return;
    setChosen(c=>current.type==='multiple'?(c.includes(n)?c.filter(x=>x!==n):[...c,n]):[n]);
  }

  function advance(){
    if(!chosen.length)return;
    if(!checked&&!exam){
      answer(current,sameAnswers(chosen,current.answers));
      setChecked(true);
      return;
    }
    const next={...all,[current.id]:chosen};
    if(i===items.length-1){
      if(exam)onFinish?.(next);
      return;
    }
    setAll(next);
    setI(x=>x+1);
    setChosen([]);
    setChecked(false);
  }

  async function askCoach(){
    if(coachLoading)return;
    setCoachLoading(true);
    setCoachAnswer('');
    setCoachError('');
    try{
      const response=await fetch('/api/coach',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          question:current.text,
          options:current.options,
          correctAnswers:current.answers,
          selectedAnswers:chosen,
          explanation:current.explanation,
          verification:current.verification,
          request:coachPrompt.trim()||'Explique cette correction autrement, avec un exemple simple.'
        })
      });
      const data=await response.json() as CoachResponse;
      if(!response.ok||!data.answer)throw new Error(data.error||'Le coach est momentanément indisponible.');
      setCoachAnswer(data.answer);
    }catch(error){
      setCoachError(error instanceof Error?error.message:'Le coach est momentanément indisponible.');
    }finally{
      setCoachLoading(false);
    }
  }

  useEffect(()=>{
    setCoachPrompt('');
    setCoachAnswer('');
    setCoachError('');
    setCoachLoading(false);
  },[current?.id]);

  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{
      if(!current)return;
      const target=event.target as HTMLElement|null;
      if(target?.matches('input, textarea, select, button'))return;
      const n=Number(event.key)-1;
      if(n>=0&&n<current.options.length&&!checked)toggle(n);
      if(event.key==='Enter')advance();
    };
    window.addEventListener('keydown',key);
    return()=>window.removeEventListener('keydown',key);
  });

  if(!current)return <div className="empty"><h2>Aucune question disponible</h2><p>Répondez d’abord à quelques questions, puis vos erreurs apparaîtront ici.</p></div>;

  const ok=checked&&sameAnswers(chosen,current.answers);
  return <section className="quiz">
    <div className="quizTop">
      <span>Question {i+1}/{items.length}</span>
      <div className="progress"><i style={{width:`${(i+1)/items.length*100}%`}}/></div>
      <span>{current.theme}</span>
    </div>
    {current.visual&&<Visual name={current.visual}/>}
    <div className="tags">
      <b>{current.subtheme}</b><span>{current.difficulty}</span>
      {state.mastery[current.id]?.errors>0&&<span className="danger">Ratée {state.mastery[current.id].errors}×</span>}
    </div>
    <h2>{current.text}</h2>
    {current.type==='multiple'&&<p className="hint">Plusieurs réponses peuvent être correctes</p>}
    <div className="answers">{current.options.map((option,n)=><button key={option} onClick={()=>toggle(n)} className={`${chosen.includes(n)?'selected':''} ${checked&&current.answers.includes(n)?'right':''} ${checked&&chosen.includes(n)&&!current.answers.includes(n)?'wrong':''}`}><kbd>{n+1}</kbd><span>{option}</span></button>)}</div>
    {checked&&<>
      <div className={`feedback ${ok?'good':'bad'}`}>
        <strong>{ok?'Bonne réponse !':'À revoir'}</strong>
        <p>{current.explanation}</p>
        {current.tip&&<small>💡 {current.tip}</small>}
      </div>
      <div className="coach">
        <div><strong>Coach Mistral</strong><small>Une explication personnalisée, sans remplacer le référentiel officiel.</small></div>
        <textarea value={coachPrompt} onChange={event=>setCoachPrompt(event.target.value)} maxLength={400} rows={2} placeholder="Qu’est-ce que tu veux mieux comprendre ?" aria-label="Question au coach Mistral"/>
        <button type="button" onClick={askCoach} disabled={coachLoading}>{coachLoading?'Le coach réfléchit…':'Demander au coach'}</button>
        {coachAnswer&&<p className="coachAnswer">{coachAnswer}</p>}
        {coachError&&<p className="coachError">{coachError}</p>}
      </div>
    </>}
    <button className="primary next" disabled={!chosen.length} onClick={advance}>{!exam&&!checked?'Valider':i===items.length-1?'Terminer':'Question suivante'} <span>↵</span></button>
    {current.verification==='à vérifier NC'&&<p className="verify">⚑ Règle locale à confirmer avec le référentiel officiel de Nouvelle-Calédonie.</p>}
  </section>;
}
