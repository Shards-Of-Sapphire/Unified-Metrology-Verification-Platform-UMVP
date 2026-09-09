ALTER TABLE "certificates" ADD COLUMN IF NOT EXISTS "pdf_data" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text;