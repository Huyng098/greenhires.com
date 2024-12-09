FROM node:20.12.2-alpine3.19 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY ckeditor5 ./ckeditor5
COPY package.json package-lock.json ./
RUN yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_SHARP_PATH /app/node_modules/sharp
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3677

ENV PORT 3677

CMD HOSTNAME="0.0.0.0" node server.js
