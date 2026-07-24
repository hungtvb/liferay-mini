import test from 'node:test';
import assert from 'node:assert/strict';

let workbookModule;
try { workbookModule = await import('../server/workbook.js'); }
catch (error) {
  if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
}

const structure = {id:10,name:'Hero',siteId:34371,availableLanguages:['en-US'],contentStructureFields:[
  {dataType:'string',fieldReference:'heading',name:'Text123',label:'Heading',required:true},
  {dataType:'image',fieldReference:'heroImage',name:'Image123',label:'Hero Image'}
]};
const context = {folder:{id:20,name:'Heroes'},imageSource:{type:'assetLibrary',id:30,folderId:40},locale:'en-US',siteId:34371,structure};

test('generic workbook keeps sample outside Content Items and binds metadata', {skip: !workbookModule}, async () => {
  const ExcelJS = (await import('exceljs')).default;
  const generated = await workbookModule.buildTemplateWorkbook(context);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(generated.buffer);
  assert.equal(workbook.getWorksheet('Content Items').rowCount,1);
  assert.equal(workbook.getWorksheet('Example').rowCount,2);
  assert.equal(workbook.getWorksheet('Metadata').state,'veryHidden');
});

test('parse rejects changed headers', {skip: !workbookModule}, async () => {
  const ExcelJS = (await import('exceljs')).default;
  const generated = await workbookModule.buildTemplateWorkbook(context);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(generated.buffer);
  const sheet=workbook.getWorksheet('Content Items');
  sheet.getCell('A1').value='Renamed';
  sheet.addRow(['Example','hero-home','Heading','file:hero.webp']);
  const buffer=await workbook.xlsx.writeBuffer();
  await assert.rejects(()=>workbookModule.parseTemplateWorkbook(buffer,context),(error)=>error.code==='TEMPLATE_HEADERS_CHANGED');
});
