/** 3×3 binary figures. Each bit represents one filled cell, row-major. */
export const FIGURE_RULES = ['cw','ccw','half','mirror','down','right','ring','invert','cwInvert'] as const;
export type FigureRule = typeof FIGURE_RULES[number];
export const ruleNames:Record<FigureRule,{zh:string;en:string}> = {
  cw:{zh:'每步顺时针旋转 90°',en:'Rotate 90° clockwise each step'},
  ccw:{zh:'每步逆时针旋转 90°',en:'Rotate 90° counterclockwise each step'},
  half:{zh:'每步旋转 180°',en:'Rotate 180° each step'},
  mirror:{zh:'每步左右镜像',en:'Reflect left to right each step'},
  down:{zh:'每步下移一行，底行回到顶行',en:'Move down one row, wrapping the bottom row to the top'},
  right:{zh:'每步右移一列，最右列回到最左列',en:'Move right one column, wrapping at the edge'},
  ring:{zh:'外围格子每步顺时针移动一格，中心不变',en:'Move perimeter cells one place clockwise; keep the centre fixed'},
  invert:{zh:'每步交换黑白格',en:'Swap filled and empty cells each step'},
  cwInvert:{zh:'每步顺时针旋转 90°，再交换黑白格',en:'Rotate 90° clockwise, then swap filled and empty cells'},
};
export function transformFigure(mask:number,rule:FigureRule):number {
  if(rule==='invert')return mask^511;
  if(rule==='cwInvert')return transformFigure(mask,'cw')^511;
  const ring=[0,1,2,5,8,7,6,3];
  let result=0;
  for(let i=0;i<9;i++) if(mask&(1<<i)) {
    const r=Math.floor(i/3),c=i%3;
    const destination=rule==='cw'?c*3+2-r:rule==='ccw'?(2-c)*3+r:rule==='half'?8-i:rule==='mirror'?r*3+2-c:rule==='down'?((r+1)%3)*3+c:rule==='right'?r*3+(c+1)%3:i===4?4:ring[(ring.indexOf(i)+1)%8];
    result|=1<<destination;
  }
  return result;
}
export function solveFigure(frames:number[]) {
  if(frames.length<3||frames.length>8||frames.some(v=>!Number.isInteger(v)||v<0||v>511))return [];
  const matches=FIGURE_RULES.filter(rule=>frames.slice(1).every((mask,i)=>transformFigure(frames[i],rule)===mask));
  const predictions=new Map<number,FigureRule[]>();
  for(const rule of matches) {
    const next=transformFigure(frames.at(-1)!,rule);
    predictions.set(next,[...(predictions.get(next)??[]),rule]);
  }
  return [...predictions].map(([next,rules])=>({next,rules}));
}
