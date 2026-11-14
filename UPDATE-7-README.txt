UPDATE 7

STEP 0 (fixes "new row violates row-level security policy for table projects")
  Supabase > SQL Editor > New query > paste the whole of supabase/fix-rls.sql > Run.
  (Safe to run more than once. It also creates the new "leads" table. Warning about "destructive" = normal for drop policy.)
  If your admin login email is NOT george.jabley@gmail.com, change it on line 9 first.
  Then reload /admin and click "Import starter projects" again.

STEP 1  Delete the old `src` folder, unzip this zip over the project (src, supabase, public).
STEP 2  npm run build
STEP 3  pwd ; git remote -v   (must show techwokx-cloud/george-jabley-portfolio)
        git add -A ; git commit -m "Update 7" ; git push origin HEAD:main     (no --force)

What's new: opposite-direction Selected Work rows, Watch Intro video (admin upload or YouTube link),
slower 0-100% intro, auto-scroll tour (stops on any touch/scroll/key), section curtain reveals,
Virtual Assistance section, Leads & Ads tab in /admin (contact form messages land there, with ad campaign).
