# Third-party notices

The kit's own code is MIT (see `LICENSE`). It ships one third-party file and has one peer dependency.

## Rozha One (font file, shipped)
`src/fonts/RozhaOne-Latin.woff2` is a Latin subset of Rozha One.
Copyright (c) 2014, Indian Type Foundry (info@indiantypefoundry.com).
Licensed under the SIL Open Font License, Version 1.1. Full text: `src/fonts/OFL.txt`.
The font keeps this licence, not the MIT licence.

## React (peer dependency, not shipped)
The kit imports `react` (^19) but does not bundle or include it. React is MIT licensed, Copyright (c) Meta Platforms, Inc. and affiliates. The app that installs the kit installs React and carries its notice.

## Development tools
Build, test and lint tools (Tailwind CSS, Vite, Vitest, Testing Library and others) are used only to develop the kit. None of their code is included in the published package.
