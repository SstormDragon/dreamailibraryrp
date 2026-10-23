# Project changes

Keep revisions scoped to the user's requested parts. When asked to reverse or undo a few changes, edit only those parts on top of the current source. Do not reset the repository or redeploy an entire older version unless the user explicitly requests a full rollback.

Preserve unrelated book design, cover depth, star alignment, typography, saved records, authentication, project identity, and access settings. Keep navigation changes separate from visual design work.

This repository hosts the public GitHub book at https://sstormdragon.github.io/dreamailibraryrp/. The AI (ChatGPT) workspace is hosted separately at https://dreamailibraryrp.fuzzyotter33.chatgpt.site/. Keep working links to both in README.md. Do not publish private saved roleplays or claim that repository downloads contain the live workspace.

Publish only generated browser assets to the website branch. Its root index.html is the GitHub Pages entry point. Editable authoring source, build scripts, private asset maps and recovery copies are maintained privately; never upload them to this public repository. Regenerate the complete deployment from that private source, verify all asset paths and preserve the font licenses. The main branch is the download hub: keep website implementation files off main unless explicitly requested. Opaque filenames and minification add copying friction, not access control; earlier public Git history remains accessible. Maintain a private recovery copy before deployment and restore only the affected website deployment if verification fails.
