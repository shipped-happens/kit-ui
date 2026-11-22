# kit-ui

Shared UI for the Shipped Happens apps. Public so any app repo can install it without a token. All rights reserved for now: no licence is granted yet (one will be chosen before others are invited to reuse it).

## Versions
| Version | For | What it is |
|---|---|---|
| **v1** | apps 001 to 005 | Extracted from what those apps already repeat: design tokens, the Tailwind theme, header, footer, error and status banners, buttons, the copy-status note. The look is the same as today. |
| **v2** (not built yet) | apps 006 to 010 and later | v1 plus the glass look from shippedhappens.org: Rozha One heading, stage light, glass panels, workspace layouts. See the App Shell v2 spec in the Shipped Happens notes. |

## Install
Pin a tag. No token is needed because the repo is public.

```
pnpm add git+https://github.com/shipped-happens/kit-ui.git#v1.0.0
```

In the app's `src/index.css`:

```css
@import 'tailwindcss';
@import '@shipped-happens/kit-ui/theme.css';
@import '@shipped-happens/kit-ui/tokens.css';
@source '../node_modules/@shipped-happens/kit-ui/src';
```

Then:

```tsx
import { AppHeader, AppFooter, ErrorBanner, StatusBanner, Button, CopyStatus } from '@shipped-happens/kit-ui'
```

The package ships TypeScript source (no build step). The `@source` line is needed so Tailwind generates the classes the components use.

## Rules
- Nothing app-specific lives here: no product logic, no app copy, no secrets, no logo files.
- The browser promise is the default footer line. A server app passes its own sentence saying what is sent and when.
- Never claim "safe" or "secure" without the caveat; a test guards the default footer line.

## Develop
```
pnpm install
pnpm lint && pnpm typecheck && pnpm test
```

Known small difference when an app moves to v1: the JSON Beautifier's error line was not bold; the kit's `ErrorBanner` is (the other apps already use bold).
