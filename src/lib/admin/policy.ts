export const ACTIVITY_TOOLS = {
  'solver:pipeline': '管道解题器', 'solver:numerical': '数字解题器', 'solver:figure': '图形解题器',
  'practice:pipeline': '管道练习', 'practice:numerical': '数字练习', 'practice:data': '图表练习',
  'practice:figure': '图形练习', 'practice:memory': '记忆训练',
  'training:grid': '空间记忆样题', 'training:peak': 'PEAK 熟悉练习', 'exam:mock': '模拟考试',
} as const;
export type ActivityTool = keyof typeof ACTIVITY_TOOLS;
export type ActivityFilters = {tool:string;from:string|null;to:string|null;page:number};
export type QueryParams = Record<string,string|string[]|undefined>;

export function isAdminId(userId:string|null, allowlist:string|undefined):boolean {
  return !!userId && !!allowlist?.split(',').map(id=>id.trim()).filter(Boolean).includes(userId);
}
export function queryValue(value:string|string[]|undefined) { return typeof value==='string'?value:''; }
export function parsePage(value:string) {
  if(!value)return 1;
  if(!/^\d+$/.test(value)||Number(value)<1||Number(value)>10000)throw new Error('页码无效');
  return Number(value);
}
export function parseActivityFilters(params:QueryParams):ActivityFilters {
  const tool=queryValue(params.tool);
  if(tool && !Object.hasOwn(ACTIVITY_TOOLS,tool))throw new Error('工具筛选无效');
  function day(value:string) {
    if(!value)return null;
    const date=new Date(`${value}T00:00:00.000Z`);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(date.getTime())||date.toISOString().slice(0,10)!==value)throw new Error('日期无效');
    return date;
  }
  const from=day(queryValue(params.from)), end=day(queryValue(params.to));
  if(from&&end&&from>end)throw new Error('开始日期不能晚于结束日期');
  return {tool,from:from?.toISOString()??null,to:end?new Date(end.getTime()+86400000).toISOString():null,page:parsePage(queryValue(params.page))};
}
