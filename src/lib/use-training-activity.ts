'use client';
import { useAuth } from '@clerk/nextjs';
import { useRef } from 'react';

/** Best-effort telemetry; it never prevents a free sample from working. */
export function useTrainingActivity(tool:'training:grid'|'training:peak') {
  const {userId}=useAuth();
  const session=useRef<string|null>(null);
  const completed=useRef(false);
  function send(action:'started'|'completed') {
    if(!userId)return;
    void fetch('/api/activity',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({tool,action,sessionId:session.current}),keepalive:true}).catch(()=>{});
  }
  function start() {
    if(!userId||session.current)return;
    session.current=crypto.randomUUID();completed.current=false;send('started');
  }
  return {
    start,
    complete(){start();if(session.current&&!completed.current){completed.current=true;send('completed');}},
    reset(){session.current=null;completed.current=false;},
  };
}
