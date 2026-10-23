import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import BookGuide, {chapters, pluginUrl, type ChapterId} from './book-guide';

const libraryUrl='https://dreamailibraryrp.fuzzyotter33.chatgpt.site/';
const chapterText:Record<ChapterId,{intro:string;steps:string[];starter:string}>={
 sandbox:{intro:'Give your roleplay a name and a world. Build the setting, cast and continuity together in ChatGPT.',steps:['Choose an original world, a fandom, or an intentional crossover.','Decide whether you want character chat, roleplay, or a mixture.','Set the starting situation and keep each character’s knowledge separate.'],starter:'Help me create a named roleplay using the roleplay toolkit. Build the world with me conversationally, establish character control and the starting situation, and ask a few related questions at a time.'},
 oc:{intro:'Create the original character you want to play. Their actions and decisions stay yours.',steps:['Develop their appearance, history, abilities and place in the world.','Establish relationships and what they know at the start.','Ask for a portrait or a character sheet when useful.'],starter:'Help me create my OC for a roleplay. Build their character sheet with me, reuse details I give you, and leave my character’s actions and decisions under my control.'},
 agent:{intro:'Develop the characters GPT plays as distinct agents, each with their own character logic.',steps:['Define motives, voice, personality and the version of canon you want.','Separate what each agent knows from what the author knows.','Carry earned history and relationships forward within the right continuity.'],starter:'Help me create an AI character agent for my roleplay. Establish their motives, personality, voice, knowledge, relationships and hard continuity rules. Keep their character logic distinct from other agents.'},
 profile:{intro:'Choose how you write and how GPT replies. They can use different lengths and styles.',steps:['Choose length, viewpoint, tense and prose or script format.','Set the dialogue balance, detail and pace you enjoy.','Use examples to refine the style through conversation.'],starter:'Help me choose writing settings for my named roleplay. Treat my posts and GPT’s replies separately, including length, viewpoint, format, dialogue balance, detail and pace.'},
 checkpoint:{intro:'Prepare a technical handover when you want to continue in a new chat.',steps:['Carry the world, cast, writing settings and current scene.','Preserve learned memories, relationships and unfinished actions.','Keep separate versions and independent worlds clearly identified.'],starter:'Prepare a technical handover for this roleplay so I can continue in a new chat. Preserve character logic, knowledge, relationships, world state, writing settings, the current scene and unfinished actions without inventing missing facts.'},
 research:{intro:'Research the adaptation, timeline and character you actually want to use.',steps:['Identify the source material and version of canon.','Separate evidence from inference and unresolved questions.','Keep your agreed AU changes above canon in this roleplay.'],starter:'Help me research canon for my roleplay using available primary sources. First establish the adaptation, timeline and character version. Distinguish evidence from inference and preserve my agreed AU changes.'},
 calibration:{intro:'Use a workshop conversation to teach or repair character behaviour and continuity.',steps:['Discuss the behaviour that fits or conflicts with character logic.','Agree the purpose and limits of any temporary control.','Adopt changes into the story only when you choose to.'],starter:'Start an out-of-character calibration workshop for this roleplay. Help me examine character logic and correct misunderstandings. Agree the scope and end point of any temporary control; keep the workshop outside the story unless I adopt it.'},
};

function Website(){
 const [chapter,setChapter]=useState<ChapterId>('sandbox');
 const [notice,setNotice]=useState('');
 const info=chapters.find(c=>c.id===chapter)!;const text=chapterText[chapter];
 async function copyStarter(){try{await navigator.clipboard.writeText(text.starter);setNotice('Copied. Open the roleplay plugin in ChatGPT and send this starter.');}catch{setNotice('Select the starter text below and copy it, then open the roleplay plugin in ChatGPT.');}}
 function choose(id:ChapterId){setChapter(id);setNotice('');}
 return <main className="shell">
  <div className="site-test-stamp" role="note"><span>THIS IS A TEST PLUG IN</span><strong>IN PROGRESS</strong></div>
  <header className="mast"><a className="brand" href="./" aria-label="Dream AI Library Roleplay home"><span className="brand-mark" aria-hidden="true">❦</span><span>Dream AI Library Roleplay<small>By StormDragonStudios</small></span></a><a className="mast-contents workspace-link" href={libraryUrl} aria-label="AI (ChatGPT) workspace Library"><span>AI (ChatGPT)</span><span>workspace</span><span>Library ↗</span></a></header>
  <BookGuide chapter={chapter} onChapter={choose}>
   <section className="working-leaf working-spread" aria-label={info.name}>
    <article className="book-page paper-leaf page-left">
     <div className="running-head"><span>Dream AI Library Roleplay</span><span>Chapter {info.number}</span></div>
     <p className="chapter-number">Chapter {info.number}</p><h2>{info.name}</h2><p className="chapter-purpose">{info.description}</p><p>{text.intro}</p>
     <ol className="public-chapter-steps">{text.steps.map(step=><li key={step}>{step}</li>)}</ol>
     <a className="book-action" href={pluginUrl} target="_blank" rel="noreferrer">Open in ChatGPT ↗</a>
     <div className="page-folio"><span>StormDragonStudios</span><span>{String(chapters.findIndex(c=>c.id===chapter)*2+1).padStart(2,'0')}</span></div>
    </article>
    <article className="book-page paper-leaf page-right">
     <div className="running-head"><span>{info.name}</span><span>Your next step</span></div><h3>Begin with a conversation</h3><p>Copy this starter, open the roleplay plugin in ChatGPT, and make it your own.</p>
     <textarea className="public-starter" aria-label="Conversation starter" readOnly rows={7} value={text.starter}/>
     <button className="primary" onClick={()=>void copyStarter()}>Copy chat starter</button>{notice&&<p className="notice" role="status">{notice}</p>}
     <h3>Your saved work</h3><p>Open the roleplay workspace for your saved roleplays, characters and writing settings. Sign in with the ChatGPT account that has access.</p><a className="book-action" href={libraryUrl}>Open roleplay workspace ↗</a>
     <div className="page-folio"><span>Dream AI Library Roleplay</span><span>{String(chapters.findIndex(c=>c.id===chapter)*2+2).padStart(2,'0')}</span></div>
    </article>
   </section>
  </BookGuide>
  <footer>Dream AI Library Roleplay · A StormDragonStudios creation · <a href="https://github.com/SstormDragon/dreamailibraryrp">GitHub files ↗</a></footer>
 </main>;
}

createRoot(document.getElementById('root')!).render(<Website/>);
