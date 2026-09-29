import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { database } from '../src/lib/db';
import { createExam, updateExam, getExamReport, listExams } from '../src/lib/exam-store';

test('exam persistence: concurrent start/submit, ownership, replay and report isolation', {skip:!process.env.RUN_DB_TESTS}, async()=>{
  const user='exam_test_'+randomUUID(),other='exam_test_'+randomUUID();
  const sql=database();
  try{
    const starts=await Promise.all([createExam(user),createExam(user)]);
    assert.ok(starts[0]);assert.equal(starts[0].id,starts[1]!.id);
    const id=starts[0].id;
    assert.equal(await updateExam(other,id,{action:'begin',section:0}),null);
    const view=await updateExam(user,id,{action:'begin',section:0});
    assert.ok(view?.current);
    assert.equal('answer' in view.current.question,false);
    const rows=await sql`SELECT state FROM mock_exams WHERE id=${id}`;
    const answer=rows[0].state.current.question.answer;
    const results=await Promise.all([updateExam(user,id,{action:'answer',questionId:view.current.id,answer}),updateExam(user,id,{action:'answer',questionId:view.current.id,answer})]);
    assert.equal(results[0]!.answered,1);assert.equal(results[1]!.answered,1);
    assert.equal(results[0]!.current!.id,results[1]!.current!.id);
    assert.equal(await getExamReport(user,id),null);
    await updateExam(user,id,{action:'finish'});
    const report=await getExamReport(user,id);
    assert.ok(report);assert.equal(report.attempts.length,2);
    assert.equal(report.attempts[0].earned,1);assert.equal(report.attempts[1].answer,null);
    assert.equal(await getExamReport(other,id),null);
    assert.equal((await listExams(other)).length,0);
    assert.equal((await listExams(user)).length,1);
    const next=await createExam(user);assert.ok(next);assert.notEqual(next.id,id);
  }finally{await sql`DELETE FROM mock_exams WHERE user_id=${user} OR user_id=${other}`;}
});
