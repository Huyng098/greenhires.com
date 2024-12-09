This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

Run the following command to install dependencies:

```bash
yarn install
```

## Development

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3677](http://localhost:3677) with your browser to see the result.

## Production

Build docker image:

```bash
docker build -t humantreefe .
```

Run docker container:

```bash
docker run --restart always -p 3677:3677 humantreefe
```
