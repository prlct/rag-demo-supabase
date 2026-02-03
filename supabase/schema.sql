-- Enable pgvector extension
create extension if not exists vector;

-- Files table
create table if not exists files (
  id uuid primary key,
  original_name text not null,
  status text not null default 'processing',
  uploaded_at timestamptz not null default now(),
  deleted_at timestamptz
);

-- Chunks table with vector embedding
create table if not exists chunks (
  id uuid primary key,
  file_id uuid not null references files(id) on delete cascade,
  chunk_index int not null,
  text text not null,
  embedding vector(768),
  deleted_at timestamptz
);

-- Index for faster chunk lookups by file
create index if not exists idx_chunks_file_id on chunks(file_id);

-- Index for vector similarity search (using HNSW for better performance)
create index if not exists idx_chunks_embedding on chunks 
  using hnsw (embedding vector_cosine_ops);

-- Function to search similar chunks
create or replace function match_chunks(
  query_embedding vector(768),
  match_threshold float default 0.7,
  match_count int default 5,
  file_ids uuid[] default null
)
returns table (
  id uuid,
  file_id uuid,
  chunk_index int,
  text text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    c.id,
    c.file_id,
    c.chunk_index,
    c.text,
    1 - (c.embedding <=> query_embedding) as similarity
  from chunks c
  inner join files f on f.id = c.file_id
  where 
    c.deleted_at is null
    and f.deleted_at is null
    and (file_ids is null or c.file_id = any(file_ids))
    and 1 - (c.embedding <=> query_embedding) > match_threshold
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;
