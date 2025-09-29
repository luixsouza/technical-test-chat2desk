-- messages tablecreate table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  author text null,
  status text not null default 'draft', -- enum: draft|published|archived
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- trigger to update updated_atcreate function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_set_updated_at
before update on messages
for each row execute procedure set_updated_at();