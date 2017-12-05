const uuid = require('uuid');

process.env.IS_OFFLINE = 'true';
process.env.AUTHORS_TABLE = 'authors';

const test = require('ava');
const Author = require('./author');

let newAuthor;

test.beforeEach(() => {
  newAuthor = {
    id: uuid.v1(),
    githubId: uuid.v1(),
    githubHandle: 'jane',
    fullName: 'Jane',
    bio: 'My bio',
    avatarUrl: 'http://avatar.com/jane'
  };
});
test.afterEach.always(() => Author.removeById(newAuthor.id));

test.serial('create author with optional fields', async t => {
  const author = await Author.create({
    id: newAuthor.id,
    githubId: newAuthor.githubId
  });

  t.deepEqual(author, {
    id: author.id,
    githubId: newAuthor.githubId,
    githubHandle: null,
    fullName: null,
    bio: null,
    avatarUrl: null,
    createdAt: author.createdAt,
    updatedAt: author.updatedAt
  });
});

test.serial('create author with all fields', async t => {
  const author = await Author.create(newAuthor);

  t.deepEqual(
    author,
    Object.assign(
      {
        createdAt: author.createdAt,
        updatedAt: author.updatedAt
      },
      newAuthor
    )
  );
});

test.serial('create author throws error without githubId', async t => {
  t.plan(1);
  try {
    await Author.create({
      id: newAuthor.id
    });
  } catch (err) {
    t.deepEqual(err.message, 'githubId is required');
  }
});

test.serial('get authors from database', async t => {
  await Author.create(newAuthor);

  let authors = await Author.get();
  authors = authors.filter(author => author.id === newAuthor.id);
  t.deepEqual(authors, [
    Object.assign(
      {
        createdAt: authors[0].createdAt,
        updatedAt: authors[0].updatedAt
      },
      newAuthor
    )
  ]);
});

test.serial('get author by id from database', async t => {
  await Author.create(newAuthor);

  const author = await Author.getById(newAuthor.id);
  t.deepEqual(
    author,
    Object.assign(
      {
        createdAt: author.createdAt,
        updatedAt: author.updatedAt
      },
      newAuthor
    )
  );
});

test.serial('get author by id  throws error without id', async t => {
  t.plan(1);
  try {
    await Author.getById(undefined);
  } catch (err) {
    t.deepEqual(err.message, 'id is required');
  }
});

test.serial('get author by GitHub id from database', async t => {
  await Author.create(newAuthor);

  const author = await Author.getByGithubId(newAuthor.githubId);
  t.deepEqual(
    author,
    Object.assign(
      {
        createdAt: author.createdAt,
        updatedAt: author.updatedAt
      },
      newAuthor
    )
  );
});

test.serial('get author by GitHub throws error without githubId', async t => {
  t.plan(1);
  try {
    await Author.getByGithubId(undefined);
  } catch (err) {
    t.deepEqual(err.message, 'githubId is required');
  }
});

test.serial('update author by id in database', async t => {
  await Author.create(newAuthor);

  let author = await Author.updateById(newAuthor.id, {
    fullName: 'Jane 2'
  });
  t.deepEqual(
    author,
    Object.assign(newAuthor, {
      fullName: 'Jane 2',
      createdAt: author.createdAt,
      updatedAt: author.updatedAt
    })
  );

  author = await Author.getById(newAuthor.id);
  t.deepEqual(
    author,
    Object.assign(newAuthor, {
      fullName: 'Jane 2',
      createdAt: author.createdAt,
      updatedAt: author.updatedAt
    })
  );
});

test.serial('update author throws error without id', async t => {
  t.plan(1);
  try {
    await Author.updateById(undefined, {});
  } catch (err) {
    t.deepEqual(err.message, 'id is required');
  }
});

test.serial('update author throws error with id payload', async t => {
  t.plan(1);
  try {
    await Author.updateById(newAuthor.id, {
      id: 'new id'
    });
  } catch (err) {
    t.deepEqual(err.message, 'id cannot be updated');
  }
});

test.serial('remove author from database', async t => {
  await Author.create(newAuthor);

  await Author.removeById(newAuthor.id);

  const author = await Author.getById(newAuthor.id);
  t.falsy(author);
});

test.serial('remove author throws error without id', async t => {
  t.plan(1);
  try {
    await Author.removeById(undefined);
  } catch (err) {
    t.deepEqual(err.message, 'id is required');
  }
});
