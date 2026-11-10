# Admin dashboard setup (Supabase)

The site's content (company info, services, core values, projects, clients and
team) is managed at **/admin** and stored in Supabase. Until Supabase is
connected, the public site shows the built-in content from `lib/site-data.ts`
and /admin shows setup instructions.

## 1. Create the Supabase project

1. Sign up at <https://supabase.com> and create a new project (the free plan is
   enough). Pick the region closest to your visitors, e.g. **West EU (London)**.
2. Open **SQL Editor → New query**, paste the whole of `supabase/schema.sql`,
   and click **Run**.
3. Open a new query, paste `supabase/seed.sql`, and click **Run**. This copies
   the site's current content into the database.

## 2. Connect the site

In Supabase, open **Project Settings → API** (or **Connect**) and copy:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://abcd1234.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The **anon / publishable** key (not the service role key) |

- **Locally:** copy `.env.example` to `.env.local` and fill both in.
- **On Vercel:** Project → Settings → Environment Variables → add both for
  Production and Preview, then redeploy.

Both values are safe to expose: row level security in `schema.sql` lets the
public read only published content, and only admins can change anything.

## 3. Create your admin account

1. In Supabase, open **Authentication → Users → Add user → Create new user**.
   Enter your email and a strong password and tick **Auto confirm user**.
2. In **SQL Editor**, allow that user into the admin:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

3. Turn off public sign-ups so nobody else can create accounts:
   **Authentication → Sign In / Providers → Email → Allow new users to sign up: off**.

Sign in at **/admin/login**.

### Adding or removing admins

Create the user as in step 1, then run the `insert` above with their email.
To remove someone:

```sql
delete from public.admins
where user_id = (select id from auth.users where email = 'them@example.com');
```

### Forgotten password

Signed in: **/admin/account → Change password**. Locked out: in Supabase open
**Authentication → Users**, find the user, and use **Send password recovery**
or set a new password there.

## How publishing works

- Saving in the admin updates the database and refreshes every public page
  immediately. Drafts (Published switched off) stay hidden from the site.
- Images upload to the public `media` storage bucket (max 5 MB; PNG, JPG,
  WebP, AVIF or SVG).
- If Supabase is ever unreachable, the public site falls back to the built-in
  content rather than showing an error.
