# Relayboard

A Next.js 14 workflow automation platform with Supabase backend, featuring API routes for workflow execution, approvals, and webhook handling.

## Features

- **Workflow Execution**: Run workflows with sequential step processing
- **Approval System**: Handle workflow approvals with secure tokens
- **Webhook Integration**: Accept external triggers via webhooks
- **Supabase Integration**: Real-time database with TypeScript support
- **TypeScript**: Full type safety throughout the application

## API Endpoints

### Workflow Run API

#### POST `/api/run`
Starts a new workflow execution.

**Request Body:**
```json
{
  "workflowId": "string (required)",
  "userId": "string (optional)",
  "inputs": "object (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "runId": "uuid",
  "status": "running"
}
```

### Approval API

#### POST `/api/approve`
Processes workflow approval tokens.

**Request Body:**
```json
{
  "token": "string (required)",
  "action": "approve | reject (required)",
  "userId": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "action": "approve|reject",
  "approvalId": "uuid",
  "runId": "uuid"
}
```

#### GET `/api/approve?token=<token>`
Retrieves approval details for a given token.

**Response:**
```json
{
  "success": true,
  "approval": {
    "id": "uuid",
    "runId": "uuid",
    "workflowId": "uuid",
    "status": "pending|approved|rejected",
    "message": "string",
    "createdAt": "datetime"
  }
}
```

### Webhook API

#### POST `/api/webhook/[id]`
Accepts webhook payloads and triggers associated workflows.

**URL Parameters:**
- `id`: Webhook ID associated with a workflow

**Request Body:**
```json
{
  "any": "JSON payload from external service"
}
```

**Response:**
```json
{
  "success": true,
  "webhookId": "string",
  "workflowId": "uuid",
  "runId": "uuid",
  "message": "Webhook processed and workflow started"
}
```

#### GET `/api/webhook/[id]`
Verifies webhook status and configuration.

**Response:**
```json
{
  "success": true,
  "webhookId": "string",
  "workflow": {
    "id": "uuid",
    "name": "string",
    "status": "active|inactive|draft",
    "createdAt": "datetime"
  },
  "message": "Webhook is active and ready to receive payloads"
}
```

## Architecture

### Database Schema (Supabase)

The application uses the following main tables:
- `users` - User accounts and profiles
- `workflows` - Workflow definitions and metadata
- `workflow_versions` - Versioned workflow configurations
- `runs` - Workflow execution instances
- `approvals` - Approval requests and responses
- `connections` - External service integrations
- `schedules` - Scheduled workflow triggers

### Libraries

#### `/src/lib/supabase.ts`
- Supabase client configuration
- Database type definitions
- Server and browser client factories

#### `/src/lib/workflow.ts`
- Workflow execution engine
- Sequential step processing
- Stub implementations for:
  - Gmail integration
  - Google Sheets operations
  - Webhook calls
  - Approval workflows
  - Delay steps

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Supabase Configuration
SUPABASE_URL=https://ptqdkhnjttbwatuxnqqx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This project is configured for Vercel deployment with:
- Domain: `relayboardrelayboardrelayboard-fswf.vercel.app`
- Environment variables configured in Vercel dashboard
- Automatic deployments on `main` branch commits

## Usage Examples

### Starting a Workflow
```bash
curl -X POST https://your-domain/api/run \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "workflow-uuid",
    "userId": "user-uuid",
    "inputs": { "key": "value" }
  }'
```

### Processing an Approval
```bash
curl -X POST https://your-domain/api/approve \
  -H "Content-Type: application/json" \
  -d '{
    "token": "approval-token",
    "action": "approve",
    "userId": "user-uuid"
  }'
```

### Webhook Integration
```bash
curl -X POST https://your-domain/api/webhook/my-webhook-id \
  -H "Content-Type: application/json" \
  -d '{ "event": "data_updated", "payload": {...} }'
```

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **Authentication**: NextAuth.js (configured)

## License

MIT License - see LICENSE file for details.
