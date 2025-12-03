FROM oven/bun:1 AS frontend-builder

WORKDIR /app/web
COPY web/package.json web/bun.lock ./
RUN bun install --frozen-lockfile

COPY web/ ./
RUN bun run build

# Go backend builder
FROM golang:1.25-alpine AS backend-builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
COPY --from=frontend-builder /app/web/dist ./web/dist

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/api

# Final runtime image
FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

# TODO: update path
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/problems.json .
COPY --from=backend-builder /app/web/dist ./web/dist

EXPOSE 3000

CMD ["./main"]
