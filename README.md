# remarkable-place

[![CircleCI](https://circleci.com/gh/remarkableplace/remarkable-place/tree/master.svg?style=svg&circle-token=4881ad562b4a05509c5c1af4f52d1db047a67692)](https://circleci.com/gh/remarkableplace/remarkable-place/tree/master)

Blog engine backed by bandwagon technologies like AWS Lambda, GraphQL, DynamoDB
and Node.js. Yes, microservices as well...

Example: https://remarkable.place

## Applications

- **admin:** React SPA, uses API
- **api**: GraphQL API
- **oauth**: GitHub OAuth 2 login, provides session
- **web**: Server rendered website

### oauth

http://remarkable.place/oauth/github?redirect_uri=/admin
