const uuid = require('uuid');

process.env.DYNAMODB_REGION = 'localhost';
process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';
process.env.PAGES_TABLE = 'pages';

const test = require('ava');
const Page = require('./page');

let id;
let authorId;

test.beforeEach(() => {
  id = uuid.v1();
  authorId = uuid.v1();
});
test.afterEach(() => Page.removeById(id));

test.serial('get pages from database', async t => {
  await Page.create({
    id,
    authorId,
    title: 'Title',
    content: 'Content'
  });

  let pages = await Page.get();
  pages = pages.filter(page => page.id === id);
  t.deepEqual(pages, [
    {
      id,
      authorId,
      title: 'Title',
      content: 'Content',
      createdAt: pages[0].createdAt,
      updatedAt: pages[0].updatedAt
    }
  ]);
});

test.serial('get page by id from database', async t => {
  await Page.create({
    id,
    authorId,
    title: 'Title',
    content: 'Content'
  });

  const page = await Page.getById(id);
  t.deepEqual(page, {
    id,
    authorId,
    title: 'Title',
    content: 'Content',
    createdAt: page.createdAt,
    updatedAt: page.updatedAt
  });
});

test.serial('update page by id in database', async t => {
  await Page.create({
    id,
    authorId,
    title: 'Title',
    content: 'Content'
  });

  let page = await Page.updateById(id, {
    title: 'Title 2',
    content: 'Content 2'
  });
  t.deepEqual(page, {
    id,
    authorId,
    title: 'Title 2',
    content: 'Content 2',
    createdAt: page.createdAt,
    updatedAt: page.updatedAt
  });

  page = await Page.getById(id);
  t.deepEqual(page, {
    id,
    authorId,
    title: 'Title 2',
    content: 'Content 2',
    createdAt: page.createdAt,
    updatedAt: page.updatedAt
  });
});

test.serial('remove page from database', async t => {
  await Page.create({
    id,
    authorId,
    title: 'Title',
    content: 'Content'
  });

  await Page.removeById(id);

  const page = await Page.getById(id);
  t.falsy(page);
});
