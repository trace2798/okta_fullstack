# converse.ai made using okta

### This repo is for my submission for the Okta AI Identity Hackathon which took place during September 23 - November 07, 2023 PDT

## Getting Started

### Either fork the repo or directly clone it

### Prerequisites

**Node version 18.17 or later  
**macOS, Windows (including WSL), and Linux are supported.

### To directly clone the repo

```shell
git clone https://github.com/trace2798/okta_fullstack.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```ts

DATABASE_URL=
OKTA_CLIENT_ID=
OKTA_CLIENT_SECRET=
OKTA_ISSUER=

NEXTAUTH_SECRET=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

ANYSCALE_API_KEY=

PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
ANYSCALE_API_BASE=
OPENAI_API_KEY=

STRIPE_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=
```

### Resources for env values:

Check the official docs for the services mentioned.

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
| `build` | To build your application                |
| `start` | Starts a production instance of the app  |

Youtube Demo Link: [Converse.ai](https://www.youtube.com/watch?v=S18FAtAkrBw)
