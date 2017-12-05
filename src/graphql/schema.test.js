const uuid = require('uuid');

process.env.DYNAMODB_REGION = 'localhost';
process.env.DYNAMODB_ENDPOINT = 'http://localhost:8000';
process.env.PAGES_TABLE = 'pages';
process.env.AUTHORS_TABLE = 'authors';
process.env.SESSIONS_TABLE = 'sessions';
process.env.SESSION_SECRET = 'secret';

const test = require('ava');
const client = require('./client');
const Page = require('../models/page');
const Author = require('../models/author');

let id;
let authorId;
let authorGithubId;
let context;

test.beforeEach(() => {
  id = uuid.v1();
  authorId = uuid.v1();
  authorGithubId = uuid.v1();
  context = { session: { logged: true, authorId } };
});
test.afterEach.always(() =>
  Promise.all([Author.removeById(authorId), Page.removeById(id)])
);

test.serial('get pages with author', async t => {
  const author = await Author.create({
    id: authorId,
    fullName: 'Jane',
    githubId: authorGithubId
  });

  const page = await Page.create({
    id,
    title: 'My Article',
    content: 'My Content',
    authorId: author.id
  });

  const query = `
    query {
      pages {
        id
        title
        content
        author {
          id
          fullName
        }
      }
    }
  `;

  let { pages } = await client(query);
  pages = pages.filter(_page => _page.id === id);

  t.deepEqual(pages, [
    {
      id: page.id,
      title: 'My Article',
      content: 'My Content',
      author: {
        id: author.id,
        fullName: 'Jane'
      }
    }
  ]);
});

test.serial('get page by id with author', async t => {
  const author = await Author.create({
    id: authorId,
    fullName: 'Jane',
    githubId: authorGithubId
  });

  const page = await Page.create({
    id,
    title: 'My Article',
    content: 'My Content',
    authorId: author.id
  });

  const query = `
    query {
      page(id: "${id}") {
        id
        title
        content
        author {
          id
          fullName
        }
      }
    }
  `;

  const result = await client(query);

  t.deepEqual(result.page, {
    id: page.id,
    title: 'My Article',
    content: 'My Content',
    author: {
      id: author.id,
      fullName: 'Jane'
    }
  });
});

test.serial('create page', async t => {
  await Author.create({
    id: authorId,
    fullName: 'Jane',
    githubId: authorGithubId
  });

  const query = `
    mutation {
      createPage(title: "My Article", content: "My Content") {
        id
        title
        content
      }
    }
  `;

  const result = await client(query, {}, context);

  t.deepEqual(result.createPage, {
    id: result.createPage.id,
    title: 'My Article',
    content: 'My Content'
  });

  await Page.removeById(result.createPage.id);
});

test.serial('update page by id', async t => {
  const author = await Author.create({
    id: authorId,
    fullName: 'Jane',
    githubId: authorGithubId
  });

  let page = await Page.create({
    id,
    title: 'My Article',
    content: 'My Content',
    authorId: author.id
  });

  const query = `
    mutation {
      updatePage(id: "${id}", title: "My Article 2") {
        id
        title
        content
      }
    }
  `;

  const result = await client(query, {}, context);

  t.deepEqual(result.updatePage, {
    id: page.id,
    title: 'My Article 2',
    content: 'My Content'
  });

  page = await Page.getById(id);
  t.deepEqual(page.title, 'My Article 2');
});

test.serial('remove page by id', async t => {
  const author = await Author.create({
    id: authorId,
    fullName: 'Jane',
    githubId: authorGithubId
  });

  let page = await Page.create({
    id,
    title: 'My Article',
    content: 'My Content',
    authorId: author.id
  });

  const query = `
    mutation {
      removePage(id: "${id}") {
        id
        title
        content
      }
    }
  `;

  const result = await client(query, {}, context);

  t.deepEqual(result.removePage, {
    id: page.id,
    title: 'My Article',
    content: 'My Content'
  });

  page = await Page.getById(id);

  t.falsy(page);
});

test.serial('get authors with pages', async t => {
  const author = await Author.create({
    id: authorId,
    fullName: 'Jane',
    githubId: authorGithubId
  });

  const page = await Page.create({
    id,
    title: 'My Article',
    content: 'My Content',
    authorId: author.id
  });

  const query = `
    query {
      authors {
        id
        fullName
        pages {
          id
          title
          content
        }
      }
    }
  `;

  let { authors } = await client(query);
  authors = authors.filter(_author => _author.id === authorId);

  t.deepEqual(authors, [
    {
      id: author.id,
      fullName: 'Jane',
      pages: [
        {
          id: page.id,
          title: 'My Article',
          content: 'My Content'
        }
      ]
    }
  ]);
});

test.serial('get author by id with pages', async t => {
  const author = await Author.create({
    id: authorId,
    fullName: 'Jane',
    githubId: authorGithubId
  });

  const page = await Page.create({
    id,
    title: 'My Article',
    content: 'My Content',
    authorId: author.id
  });

  const query = `
    query {
      author(id: "${authorId}") {
        id
        fullName
        pages {
          id
          title
          content
        }
      }
    }
  `;

  const result = await client(query);

  t.deepEqual(result.author, {
    id: author.id,
    fullName: 'Jane',
    pages: [
      {
        id: page.id,
        title: 'My Article',
        content: 'My Content'
      }
    ]
  });
});

test.serial('update author by id', async t => {
  await Author.create({
    id: authorId,
    fullName: 'Jane',
    githubId: authorGithubId
  });

  const query = `
    mutation {
      updateAuthor(id: "${authorId}", fullName: "Jane 2") {
        id
        fullName
      }
    }
  `;

  const result = await client(query, {}, context);

  t.deepEqual(result.updateAuthor, {
    id: authorId,
    fullName: 'Jane 2'
  });

  const author = await Author.getById(authorId);
  t.deepEqual(author.fullName, 'Jane 2');
});
