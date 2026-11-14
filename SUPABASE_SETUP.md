# Supabase setup — Uji Coba TKA SD

## 1. Create a Supabase project
1. Open https://supabase.com/ and create a project.
2. Choose a strong database password and keep it private.
3. In Project Settings → API, copy the **Project URL** and **anon/public key**.
4. Never share or put the **service_role/secret key** in browser code.

## 2. Create the results table
1. Open SQL Editor in the Supabase dashboard.
2. Open `supabase/schema.sql` from this repository.
3. Paste the SQL into the editor and run it.
4. Confirm that `public.exam_results` exists in Table Editor.

The starter policy permits anonymous submissions but does not permit anonymous reading. This is suitable only for a controlled pilot. Public browser submissions can still be forged or spammed; this setup does not provide exam integrity or server-side grading.

## 3. Teacher dashboard access (next implementation step)
Do not make the results table publicly readable. Create teacher accounts using Supabase Auth, then add an allowlist table and a SELECT policy tied to authenticated teacher IDs. The dashboard will query results only after teacher sign-in. Do not enable a broad SELECT policy for `anon`.

## 4. Connect the app
Send the Project URL and anon/public key through the secure project setup flow or paste them into the app configuration when prompted. The anon key is designed for browser use when Row Level Security is enabled. Do not send the database password or service_role key.

## 5. Privacy
NISN is student personal data. Collect only what the school needs, restrict teacher access, avoid publishing result exports, and follow the school's data-handling rules. For public demonstrations, use dummy student data.
