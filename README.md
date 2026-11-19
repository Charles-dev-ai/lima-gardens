# Lima Garden site

Files: index.html (customer site), admin.html (/admin), api/ (config.js, login.js, _lib.js), vercel.json.

Deploy: upload the WHOLE folder including `api/` to GitHub, import in Vercel (Framework: Other).
Add Upstash Redis under Storage, add ADMIN_PASSWORD under Environment Variables, then redeploy.
Open /admin, sign in. The login page shows a setup check that says what is missing.
Phone numbers are public because WhatsApp links need them. Orders are not stored; they exist as WhatsApp messages.
