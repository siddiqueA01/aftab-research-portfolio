# Go-live checklist — research portfolio

## Required actions in your GitHub account

1. Extract the **entire** ZIP. Do not upload just the preview HTML; the hidden `.github/workflows/` directory, `scripts/`, `assets/`, and `generated/` are needed.
2. In **GitHub Desktop** (https://desktop.github.com), sign in and choose **File → Add local repository**. Select `Aftab_Siddique_Auto_Updating_Portfolio`. If asked, choose to create a Git repository in that folder. Commit all files; **Publish repository** with the name `aftab-research-portfolio` and make it public.
3. Open your new repository on github.com → **Settings → Pages** → **Build and deployment → Source: GitHub Actions**.
4. Open **Actions → Update & publish research portfolio → Run workflow → Run workflow**. Confirm the green check. Get the live address from **Settings → Pages** or the workflow deployment output.
5. Open the site on your phone and computer. Scroll to **In the News → Unreviewed live discoveries**. Confirm it shows an update timestamp and, if the external feeds returned matches, recent candidates. An empty discovery list is not necessarily an error; check the workflow log.
6. Add the live URL to your résumé as **Interactive Research Portfolio**.

**Daily updates:** the workflow runs approximately 08:27 UTC daily (GitHub can delay scheduled runs). Google News discovers *potential name matches* and OpenAlex discovers *newly indexed publications*; neither is automatically an independently verified achievement. The curated articles, grants, awards and teaching lists remain controlled and accurate until edited.

## Optional domain (not required for launch)

1. Buy a domain you like from a registrar, or use a domain you already control. Do **not** purchase a name without checking availability and pricing yourself.
2. Verify domain ownership in your GitHub **account Settings → Pages** as instructed (a DNS TXT record).
3. In the website repository **Settings → Pages → Custom domain**, enter your exact domain and save before pointing DNS at it.
4. Follow the precise GitHub-provided records for your domain type, and then enable **Enforce HTTPS** after DNS and certificate are ready.
5. No custom-domain purchase or DNS configuration has been performed for this package.

Official docs: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site and https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
