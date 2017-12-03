const uuid = require('uuid');

process.env.DYNAMODB_REGION = 'localhost';
process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';
process.env.PAGES_TABLE = `test-pages-${uuid.v1()}`;

const test = require('ava');
const promisify = require('es6-promisify');
const { client } = require('./dynamoDb');
const Page = require('./page');

const createTable = promisify(client.createTable, client);
const deleteTable = promisify(client.deleteTable, client);
let id;

test.before(() =>
  createTable({
    TableName: process.env.PAGES_TABLE,
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      }
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    }
  })
);
test.after(() =>
  deleteTable({
    TableName: process.env.PAGES_TABLE
  })
);
test.beforeEach(() => {
  id = uuid.v1();
});
test.afterEach(() => Page.removeById(id));

test.serial('get pages from database', async t => {
  await Page.create({
    id,
    title: 'Title',
    content: 'Content'
  });

  const pages = await Page.get();
  t.deepEqual(pages, [
    {
      id,
      title: 'Title',
      content: 'Content'
    }
  ]);
});

test.serial('get page by id from database', async t => {
  await Page.create({
    id,
    title: 'Title',
    content: 'Content'
  });

  const page = await Page.getById(id);
  t.deepEqual(page, {
    id,
    title: 'Title',
    content: 'Content'
  });
});

test.serial('update page by id in database', async t => {
  await Page.create({
    id,
    title: 'Title',
    content: 'Content'
  });

  let page = await Page.updateById(id, {
    title: 'Title 2',
    content: 'Content 2'
  });
  t.deepEqual(page, {
    id,
    title: 'Title 2',
    content: 'Content 2'
  });

  page = await Page.getById(id);
  t.deepEqual(page, {
    id,
    title: 'Title 2',
    content: 'Content 2'
  });
});

test.serial('remove page from database', async t => {
  await Page.create({
    id,
    title: 'Title',
    content: 'Content'
  });

  await Page.removeById(id);

  const page = await Page.getById(id);
  t.falsy(page);
});
