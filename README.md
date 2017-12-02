# remarkable-place

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
