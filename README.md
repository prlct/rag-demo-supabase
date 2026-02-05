# AI-Powered Document Chat Application

A RAG (Retrieval Augmented Generation) system that enables intelligent conversations with documents. Upload PDF and DOCX files, ask questions and get accurate answers based solely on your document content.

## 🎯 Key Features

- **Document Upload & Processing**: Automatic extraction and processing of PDF and DOCX files
- **Semantic Search**: Vector-based search using embeddings to find relevant information by meaning, not just keywords
- **RAG Implementation**: Retrieval Augmented Generation ensures answers are based only on uploaded documents
- **Multi-file Support**: Select and search across multiple documents simultaneously
- **Transparent Responses**: System explicitly states when information isn't available in documents
- **Real-time UI**: Toast notifications and loading states for better UX

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, shadcn/ui
- **AI/ML**:
  - Google Gemini API (`gemini-2.5-flash`) for content generation
  - Gemini Embeddings (`text-embedding-004`) for vector embeddings (768 dimensions)
  - Vercel AI SDK v6 for streaming and chat management
- **Database**: Supabase with pgvector extension for vector storage and search
- **File Processing**:
  - `unpdf` for PDF text extraction
  - `mammoth` for DOCX text extraction
- **Storage**: Supabase Storage for file uploads (with local storage fallback)

## 🔄 How It Works

### 1. Document Upload & Processing

1. **File Upload**: User uploads PDF or DOCX file
2. **Raw Storage**: File saved to Supabase Storage bucket
3. **Text Extraction**:
   - PDF: Extracted using `unpdf`
   - DOCX: Extracted using `mammoth`
4. **Chunking**: Text split into ~500 character chunks with ~50 character overlap
5. **Embedding**: Each chunk converted to vector embeddings using Gemini Embeddings API
6. **Storage**:
   - Raw files stored in Supabase Storage (`documents` bucket)
   - Chunks stored in Supabase `chunks` table with embeddings
   - File metadata stored in Supabase `files` table
7. **Status Updates**: File status updates (`processing` → `ready`/`error`)

### 2. Query Processing (RAG Flow)

1. **File Selection**: User selects files via checkboxes
2. **Query Embedding**: User's question converted to embedding vector
3. **Vector Search**: Supabase `match_chunks` RPC finds top 5 most relevant chunks from selected files
4. **Context Injection**: Relevant chunks injected into prompt as context
5. **Response Generation**: Gemini model generates answer using the provided context
6. **Transparency**: If information isn't available, system explicitly states so

### 3. Vector Search Implementation

- **Index**: Supabase pgvector index on `embedding` field using IVFFlat
- **Search Method**: Semantic similarity using cosine distance (`<=>` operator)
- **Filtering**: Results filtered by selected `file_ids`
- **Threshold**: Minimum similarity score of 0.5

## Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account with pgvector extension enabled
- Google AI API key

## Getting Started

### 1. Clone and Install

```sh
git clone <repository-url>
cd rag-demo-supabase
npm install
```

### 2. Environment Setup

Copy the example environment file and fill in your credentials:

```sh
cp .env.example .env.local
```

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-api-key
```

> **Note**: `SUPABASE_SERVICE_ROLE_KEY` is used on the server-side to bypass RLS. Find it in your Supabase Dashboard → Settings → API → Service Role Key.

### 3. Database Setup

**Option A: Using Supabase CLI (recommended)**

```sh
# Install Supabase CLI if not installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**Option B: Manual setup**

Run the SQL from `supabase/migrations/20260205000000_init.sql` in your Supabase SQL Editor.

This creates:
- `files` table for document metadata (with RLS enabled)
- `chunks` table with vector embeddings (with RLS enabled)
- `match_chunks` function for vector similarity search
- Required indexes for performance

### 4. Run Development Server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # RAG chat endpoint
│   │   └── files/             # File upload/delete endpoints
│   ├── layout.tsx
│   └── page.tsx               # Main chat interface
├── components/
│   ├── chat/                  # Chat UI components
│   ├── files/                 # File library components
│   └── ui/                    # shadcn/ui components
├── hooks/
│   └── use-files.ts           # Files state management
└── lib/
    ├── services/
    │   ├── chunking/          # Text chunking logic
    │   ├── embeddings/        # Gemini embeddings
    │   ├── file-storage/      # Local file storage
    │   └── parser/            # PDF/DOCX parsing
    ├── supabase/              # Supabase client
    └── types.ts               # Shared types
```

## License

MIT
