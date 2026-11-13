UPDATE 5 — bigger tech stack, independent carousel rows, animations, resume + PDF portfolio, certificates & events

1. In your project folder: delete the old `src` folder, then unzip this zip over the project
   (it contains src, public, supabase/schema.sql and postcss.config.mjs).
2. npm run build   (should pass; if a package is missing: npm install)
3. Supabase (only needed for the admin parts): open supabase/schema.sql, copy the block at the bottom
   ("Update 5"), replace YOUR_ADMIN_EMAIL with your admin login email (3 places), run it in Supabase > SQL Editor.
4. Verify:  pwd   and   git remote -v   -> then
   git add -A ; git commit -m "Update 5" ; git push origin HEAD:main      (no --force)

New things to know
- /portfolio is a printable web portfolio. Its URL can be copied (button on the site and on the page).
  "Save as PDF / Print" on that page makes a fresh PDF any time; public/George-Jabley-Portfolio.pdf is a ready-made copy.
- public/George-Jabley-Resume.pdf is a STARTER resume built only from facts in the site. Upload your real CV in
  /admin > "Certificates & Resume"; the Download Resume button then uses it automatically.
- Certificates, hackathons and events: /admin > "Certificates & Resume" > + Add (image, link, date optional).
- Check the spelling of "iSpreme Innovation Lab" and add dates/details for the hackathons in the admin.
