An archive of practice problems for Golang.

## Local Development

### Prerequisites

- Go 1.25+
- Bun (for frontend)
- Node.js 18+ (if not using Bun)

### Setup

Install backend dependencies:
```bash
go mod download
```

Install frontend dependencies:
```bash
cd web
bun install
cd ..
```

Build frontend:
```bash
cd web
bun run build
cd ..
```

Run the server:
```bash
go run .
```