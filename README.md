# Dream AI Library Roleplay

A StormDragonStudios creation by **SstormDragon**.

The public book for Dream AI Library Roleplay: world creation, original characters, distinct AI character agents, writing style, canon research, calibration and technical handover. **This is a test version in progress.**

## Open the book or workspace

| Link | Where it takes you |
| --- | --- |
| [GitHub book](https://sstormdragon.github.io/dreamailibraryrp/) | Read the public book and its chapters. |
| [AI (ChatGPT) workspace Library](https://dreamailibraryrp.fuzzyotter33.chatgpt.site/) | Open the hosted roleplay workspace with an authorized ChatGPT account. |
| [GitHub files](https://github.com/SstormDragon/dreamailibraryrp) | Browse or download this repository's book website source. |

ChatGPT is the current AI integration. Downloads from this repository contain the public book website; the live workspace runs separately.

## Website

The public website is built as the repository’s root website for GitHub Pages. Its book, chapter navigation and conversation starters work as a static site. ChatGPT opens separately when you choose to use the roleplay plugin.

The book's **AI (ChatGPT) workspace Library** link opens the hosted app. The app's **GitHub book** link returns to the book, and **GitHub files** opens this repository. Workspace access remains restricted to authorized accounts.

The live tool and saved library continue on the existing, access-controlled app server. GitHub Pages does not run that server. This repository contains no saved roleplays, user records, account tokens or server credentials.

## Build

Website code, fonts, styles and images are grouped in [website/](website/). The small root `index.html` opens the book at its existing address.

Install Node.js, open the `website` folder, run `npm install`, then `npm run build`. Commit the resulting `website/website.js` with any source changes. GitHub Pages serves the repository root from the `main` branch.

Typeface licenses are included alongside the fonts in `website/`.
