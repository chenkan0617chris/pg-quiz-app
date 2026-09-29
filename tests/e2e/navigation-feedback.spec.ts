import {test,expect} from '@playwright/test';

for(const mobile of [false,true])test(`navigation responds during a delayed route (${mobile?'mobile':'desktop'})`,async({page})=>{
 await page.setViewportSize(mobile?{width:390,height:844}:{width:1280,height:900});
 let release!:()=>void;
 const gate=new Promise<void>(resolve=>{release=resolve;});
 await page.route('**/zh/grid?*',async route=>{await gate;await route.continue();});
 try{
  await page.goto('/zh/memory');
  if(mobile)await page.getByRole('button',{name:'打开导航菜单'}).click();
  const target=page.getByRole('link',{name:'空间记忆',exact:true});
  await target.click();
  await expect(page.locator('[data-navigation-pending], [data-page-loading]').first()).toBeVisible();
  if(mobile)await expect(page.getByRole('button',{name:'打开导航菜单'})).toHaveAttribute('aria-expanded','false');
  release();
  await expect(page).toHaveURL(/\/zh\/grid$/);
  await expect(page.getByRole('heading',{name:/空间记忆/}).first()).toBeVisible();
  await expect(page.locator('[data-navigation-pending], [data-page-loading]')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }finally{release();}
});
