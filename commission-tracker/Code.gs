/** Commission tracker reference - demo only, not live in any client account. */
const C={tab:'Transactions',audit:'MailAudit',tz:'America/New_York'};
function setupDemo(){
 const ss=SpreadsheetApp.getActiveSpreadsheet();
 const a=ss.getSheetByName(C.tab)||ss.insertSheet(C.tab);
 a.getRange(1,1,1,8).setValues([['Transaction ID','Received At','Lead Generator','Commission','Verified','Source','Form Record ID','Notes']]);
 a.setFrozenRows(1);a.getRange('E2:E').insertCheckboxes();
 const l=ss.getSheetByName(C.audit)||ss.insertSheet(C.audit);
 l.getRange(1,1,1,5).setValues([['Date','Type','Status','Timestamp','Details']]);l.setFrozenRows(1);
 ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='nightly').forEach(ScriptApp.deleteTrigger);
 ScriptApp.newTrigger('nightly').timeBased().everyMinutes(10).create();
}
function output_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)}
function doPost(e){
 try{
  const p=JSON.parse(e.postData.contents);
  const secret=PropertiesService.getScriptProperties().getProperty('INTAKE_TOKEN');
  if(!secret||p.token!==secret)return output_({ok:false,error:'unauthorized'});
  const id=String(p.source||'Cognito Forms')+':'+String(p.formRecordId||'');
  const amount=Number(p.commission);
  if(!p.formRecordId||!p.leadGenerator||!Number.isFinite(amount)||amount<0)return output_({ok:false,error:'invalid payload'});
  const lock=LockService.getScriptLock();lock.waitLock(10000);
  try{
   const s=SpreadsheetApp.getActiveSpreadsheet().getSheetByName(C.tab);
   const ids=s.getLastRow()>1?s.getRange(2,1,s.getLastRow()-1,1).getDisplayValues().flat():[];
   if(ids.includes(id))return output_({ok:true,duplicate:true,id});
   s.appendRow([id,new Date(),String(p.leadGenerator).slice(0,100),amount,false,String(p.source||'Cognito Forms'),String(p.formRecordId),'']);
   s.getRange(s.getLastRow(),5).insertCheckboxes();
   return output_({ok:true,duplicate:false,id});
  }finally{lock.releaseLock();}
 }catch(e){return output_({ok:false,error:'invalid request'});}
}
function nightly(){
 const now=new Date(),date=Utilities.formatDate(now,C.tz,'yyyy-MM-dd');
 if(Number(Utilities.formatDate(now,C.tz,'H'))<21)return;
 const lock=LockService.getScriptLock();if(!lock.tryLock(5000))return;
 try{
  const ss=SpreadsheetApp.getActiveSpreadsheet();
  const tab=ss.getSheetByName(C.tab), log=ss.getSheetByName(C.audit);
  const to=PropertiesService.getScriptProperties().getProperty('REPORT_TO');
  if(!to)throw Error('Set REPORT_TO first');
  const rows=tab.getLastRow()>1?tab.getRange(2,1,tab.getLastRow()-1,8).getValues():[];
  const today=rows.filter(r=>r[1] instanceof Date&&Utilities.formatDate(r[1],C.tz,'yyyy-MM-dd')===date);
  if(!today.length)return;
  const history=log.getLastRow()>1?log.getRange(2,1,log.getLastRow()-1,5).getValues():[];
  if(history.some(r=>r[0]===date&&r[1]==='REPORT'))return;
  const pending=today.filter(r=>r[4]!==true);
  if(pending.length){
   if(!history.some(r=>r[0]===date&&r[1]==='REMINDER'))sendOnce_(log,to,date,'REMINDER','Approval required',pending.length+' transactions pending.');
   return;
  }
  const byAgent={};
  today.forEach(r=>byAgent[r[2]]=(byAgent[r[2]]||0)+Number(r[3]));
  const lines=Object.keys(byAgent).sort().map(k=>k+': $'+byAgent[k].toFixed(2));
  const total=Object.values(byAgent).reduce((a,b)=>a+b,0);
  sendOnce_(log,to,date,'REPORT','Verified commissions '+date,lines.join('\n')+'\nTotal: $'+total.toFixed(2));
 }finally{lock.releaseLock();}
}
function sendOnce_(log,to,date,kind,subject,body){
 // At-most-one automatic Gmail invocation. Uncertain delivery requires operator review.
 log.appendRow([date,kind,'SENDING',new Date(),subject]);
 const r=log.getLastRow();
 try{GmailApp.sendEmail(to,subject,body);log.getRange(r,3).setValue('SENT');}
 catch(e){log.getRange(r,3).setValue('UNCERTAIN - REVIEW');throw e;}
}
