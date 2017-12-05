const uuid = require('uuid');

process.env.IS_OFFLINE = 'true';
process.env.PAGES_TABLE = 'pages';

const test = require('ava');
const Page = require('./page');

let id;
let authorId;

test.beforeEach(() => {
  id = uuid.v1();
  authorId = uuid.v1();
});
test.afterEach.always(() => Page.removeById(id));

test.serial('create page', async t => {
  const page = await Page.create({
    id,
    title: 'My Article',
    content: 'My Content',
    authorId
  });

  t.deepEqual(page, {
    id,
    authorId,
    title: 'My Article',
    content: 'My Content',
    createdAt: page.createdAt,
    updatedAt: page.updatedAt
  });
});

test.serial('create page throws error without authorId', async t => {
  t.plan(1);
  try {
    await Page.create({
      id,
      title: 'My Article',
      content: 'My Content'
    });
  } catch (err) {
    t.deepEqual(err.message, 'authorId is required');
  }
});

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

test.serial('get page by id from database throws without id', async t => {
  t.plan(1);
  try {
    await Page.getById();
  } catch (err) {
    t.deepEqual(err.message, 'id is required');
  }
});

test.serial('get page by author id from database', async t => {
  await Page.create({
    id,
    authorId,
    title: 'Title',
    content: 'Content'
  });

  const pages = await Page.getByAuthorId(authorId);
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

test.serial('get page by authorId from database throws without id', async t => {
  t.plan(1);
  try {
    await Page.getByAuthorId();
  } catch (err) {
    t.deepEqual(err.message, 'authorId is required');
  }
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

test.serial('update page throws error with id payload', async t => {
  t.plan(1);
  try {
    await Page.updateById(id, {
      id: 'new id'
    });
  } catch (err) {
    t.deepEqual(err.message, 'id cannot be updated');
  }
});

test.serial('update page throws error with authorId payload', async t => {
  t.plan(1);
  try {
    await Page.updateById(id, {
      authorId: 'new authorId'
    });
  } catch (err) {
    t.deepEqual(err.message, 'authorId cannot be updated');
  }
});

test.serial('update page by id from database throws without id', async t => {
  t.plan(1);
  try {
    await Page.updateById(undefined, {});
  } catch (err) {
    t.deepEqual(err.message, 'id is required');
  }
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

test.serial('remove page by id from database throws without id', async t => {
  t.plan(1);
  try {
    await Page.removeById();
  } catch (err) {
    t.deepEqual(err.message, 'id is required');
  }
});
