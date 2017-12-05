# remarkable-place

[![CircleCI](https://circleci.com/gh/remarkableplace/remarkable-place/tree/master.svg?style=svg&circle-token=4881ad562b4a05509c5c1af4f52d1db047a67692)](https://circleci.com/gh/remarkableplace/remarkable-place/tree/master)

Blog Engine based on *AWS Lambda*, *GraphQL*, *DynamoDB* and *Node.js*.

Example: https://remarkable.place

## Install

```sh
npm i -g serverless
sls deploy
```

## Configure

**Optioal environment variables**:

- `SITE_TITLE`: Title
- `SITE_SUBTITLE`: Subtitle
- `ANALYTICS_GA`: Google Analytics tracking code

## Development

### Applications

- **admin:** React SPA, uses API
- **api**: GraphQL API
- **oauth**: GitHub OAuth 2 login, provides session
- **web**: Server rendered website

#### oauth

http://remarkable.place/oauth/github?redirect_uri=/admin

### Setup

**Requirements:**

- docker
- docker-compose

Starts containers with `nodemon`.

```sh
npm run dev
```

- **admin:** http://localhost:4000
- **api**: http://localhost:4001
- **oauth**: http://localhost:4002
- **web**: http://localhost:4003

You may want to provide `GITHUB_ORG`, `GITHUB_CLIENT_ID`, and
`GITHUB_CLIENT_SECRET` environment variables.
