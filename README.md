# React Server Side Rendered Binance Trading APP:

### Install Dependencies

```bash
yarn
npm i
```

### Personalize `config.json`

In the root directory, you'll find `config.sample.json`.

Rename it to `config.json`.

Here are the constants it contains:
```js
{
    "expressPort": "4000",
    "domain": "http://localhost:4000",
    "mongoUriDev": "mongodb://<username>:<password>@ds127983.mlab.com:27983/react-ssr",
    "mongoUriProduction": "ENTER_YOUR_PRODUCTION_MONGO_URI_FROM_MLAB_OR_ELSEWHERE",
    "jwtSecret": "PickAComplexString1337",
    "GITHUB_CLIENT_ID": "ENTER_YOUR_APP'S_CLIENT_ID",
    "GITHUB_CLIENT_SECRET": "ENTER_YOUR_APP'S_CLIENT_SECRET",
    "BINANCE_KEY": "key",
    "BINANCE_SECRET": "secret"
  }
```
### Build and Run The Application

#### Development

##### Webpack
To build and watch the client side JavaScript bundles with Webpack 2, run:
```bash
yarn run watch
npm run watch
```

##### Express Server
To start the server, open a separate tab or terminal window and run:
```bash
yarn run server
npm run server
```

##### MongoDB
To start MongoDB locally, open a separate tab or terminal window and run:
```bash
yarn run mongo
npm run mongo
```

##### Jest
To start Jest in watch mode, open a separate tab or terminal window and run:
```bash
yarn run tdd
npm run tdd
```

#### Production

To build the production version of your app, run this;
```bash
yarn build:prod
npm build:prod
```