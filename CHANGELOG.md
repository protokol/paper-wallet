# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

-   Migrated the project to Vue 3, Vite, TypeScript strict mode and `<script setup>` components
-   Replaced tslint with ESLint 9 (flat config) and Prettier 3
-   Replaced Jest with Vitest and Cypress with Playwright for the unit and E2E tests
-   Replaced Yarn 1 with pnpm and Node 12 CI with Node 24
-   Replaced `secp256k1`, `ripemd160`, `simple-sha256`, `bip39`, `bs58check` and `more-entropy` with the audited `@noble/*` and `@scure/*` libraries; all generated wallets and signatures remain bit-for-bit compatible with the previous versions
-   Replaced `vue-simple-spinner` and the clipboard `execCommand` usage with modern equivalents

## 3.2.0 - 04-09-2019

### Added

-   Progressive Web App support ([#29])

## 3.1.0 - 07-08-2019

### Added

-   Message signing and verifying ([#25])

### Fixed

-   Remove wallet data from url ([#23])
-   Resolved an issue with saving generated wallets on iOS ([#22])

## 3.0.0 - 25-07-2019

### Added

-   New ARK Paper Wallet version built from scratch, made with Vue.JS and TailwindCSS
