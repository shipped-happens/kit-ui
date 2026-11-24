# kit-ui

Shared UI for the Shipped Happens apps. Public so any app repo can install it without a token. The code is MIT licensed (`LICENSE`); third-party files are listed in `THIRD-PARTY-NOTICES.md`. The Rozha One font file in `src/fonts` stays under its own open licence (`src/fonts/OFL.txt`).

**Brand assets are not licensed.** The MIT licence covers the code only. The Shipped Happens name, logo, the mascot Hap, stickers and any brand fonts keep their own terms and are not included in this licence. This repo holds no logo files; do not use the name or Hap to suggest your product is ours.

## Versions
| Version | For | What it is |
|---|---|---|
| **v1.0.0** (tag) | apps 001 to 005 | The parts those apps already repeated: tokens, Tailwind theme, header, footer, banners, buttons. The look is the old flat one. Frozen. |
| **v2.0.0** (`main`) | apps 006 to 010 and later | v1's tokens plus the glass and light look of shippedhappens.org: the app shell, two workspace layouts and the parts below. Breaking: `AppHeader` is replaced by `AppShell` and `PageTitle`; buttons are pills. |

## Install
Pin a tag. No token is needed because the repo is public.

```
pnpm add git+https://github.com/shipped-happens/kit-ui.git#v2.0.0
```

In the app's `src/index.css`:

```css
@import 'tailwindcss';
@import '@shipped-happens/kit-ui/theme.css';
@import '@shipped-happens/kit-ui/tokens.css';
@import '@shipped-happens/kit-ui/v2.css';
@source '../node_modules/@shipped-happens/kit-ui/src';
```

The package ships TypeScript source (no build step). The `@source` line is needed so Tailwind generates the classes the components use. Serve the SH mark from the app (for example `public/mark.png`) and pass it as `markSrc`; the kit holds no logo files.

## Use
```tsx
import { AppShell, PageTitle, ResultSettings, DropZone, SettingsPanel, Segmented, Slider, Button } from '@shipped-happens/kit-ui'

<AppShell markSrc="/mark.png">
  <PageTitle name="Image Shrink" description="Make a photo small enough for the form." category="Media" />
  <ResultSettings results={...} settings={<SettingsPanel action={<Button variant="primary">Shrink</Button>}>...</SettingsPanel>} />
</AppShell>
```

**Shell:** `AppShell` (stage light, glass header, one column, footer, skip link), `ShellHeader`, `AppFooter` (the promise line, Privacy, Terms, "Made by Shipped Happens"), `PageTitle` (the one h1), `Panel`.
**Layouts:** `TwoPane` (input left, result right, for text tools) and `ResultSettings` (results left, settings right; settings first on a phone, for image, QR and file tools). A form app uses `Panel`, `Field` and `DocumentPreview`.
**Parts:** `Button`, `StatusPill`, `ErrorBanner`, `StatusBanner`, `CopyStatus`, `DropZone`, `SettingsPanel`, `Segmented`, `Slider`, `Meter`, `BlankResult`, `BeforeAfter`, `ResultList`, `ResultRow`, `CaveatList`, `ExampleChips`, `CopyButton`, `ShareButton`, `Field`, `fieldClass`, `DocumentPreview`.
**Helpers:** `formatBytes`, `describeSaving` (says "89% smaller" or "33% larger", never a negative number), `checkFile`, `usePageGlow`.

Look at everything at once with `pnpm demo` (port 5199; `#image`, `#text`, `#form`).

## Rules
- Nothing app-specific lives here: no product logic, no app copy, no secrets, no logo files.
- Glass is for the header only. Content panels stay near-opaque so text keeps its contrast; a test checks every text and background pair in both themes at 4.5:1.
- Pointer effects run only for a fine pointer and never with reduced motion. Effects are classes and files, never inline styles (the apps' CSP blocks them).
- The browser promise is the default footer line. A server app passes its own sentence saying what is sent and when.
- Never claim "safe" or "secure" without the caveat; a test guards the default footer line. Every tool shows a `CaveatList` near its input.
- Known, accepted: Impeccable's detector flags the amber stage light on dark pages as a decorative halo. It is the lamp of the Lit Workbench design (see the site's `DESIGN.md`) and stays.

## Develop
```
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm demo
```
