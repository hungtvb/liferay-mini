import test from 'node:test';
import assert from 'node:assert/strict';
import {buildTemplateColumns, strictTemplateMapping} from '../server/mapping.js';

const structure = {contentStructureFields:[
  {dataType:'string',fieldReference:'heading',name:'Text123',label:'Heading',required:true},
  {dataType:'image',fieldReference:'heroImage',name:'Image123',label:'Hero Image'}
]};

test('generates generic system and image reference columns', () => {
  const columns = buildTemplateColumns(structure);
  assert.deepEqual(columns.map((item)=>item.header), [
    'Content Title *','External Reference Code *','Heading * [heading]','Hero Image Reference [heroImage]'
  ]);
  assert.equal(columns[2].name,'Text123');
  assert.equal(columns[2].fieldReference,'heading');
});

test('strict mapping rejects renamed or reordered headers', () => {
  const columns = buildTemplateColumns(structure);
  assert(strictTemplateMapping(columns.map((item)=>item.header),columns));
  assert.equal(strictTemplateMapping([...columns.map((item)=>item.header)].reverse(),columns),null);
  assert.equal(strictTemplateMapping(columns.map((item)=>item.header.replace('Heading','Title')),columns),null);
});
