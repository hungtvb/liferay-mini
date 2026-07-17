# Liferay Mini Project Lab

A learn.liferay-style, step-by-step lab for building a headless landing page on Liferay with Client Extensions, Web Content, Headless Delivery APIs, and an Excel-to-Web-Content migration flow.

## What you will build

- A responsive Nexcent landing page based on the provided Figma design.
- Custom Element Client Extensions for Hero, Services, and Feature sections.
- Shared global design tokens through a Theme CSS Client Extension.
- Dynamic content loaded from Liferay Web Content through Headless Delivery APIs.
- An Excel importer that validates sample data and creates Web Content.
- A Batch Client Extension for repeatable seed and migration packages.

## Learning path

| Module | Topic | Output |
|---|---|---|
| 00 | Prerequisites | Tooling checklist |
| 01 | Run Liferay locally | Working Portal container |
| 02 | Bootstrap the workspace | Buildable Liferay Workspace |
| 03 | First Custom Element | Hello Liferay widget |
| 04 | Model Web Content | Hero, Service, Feature structures |
| 05 | Consume Headless APIs | Typed API client |
| 06 | Build Hero | Dynamic responsive Hero |
| 07 | Build Services | Dynamic service grid |
| 08 | Build Features | Reusable media/content sections |
| 09 | Global CSS | Shared Figma design tokens |
| 10 | Excel importer | Validated Web Content import |
| 11 | Batch Client Extension | Repeatable seed package |
| 12 | Final integration | Completed landing page and demo |

Start at [`docs/lab-guide/00-course-overview.md`](docs/lab-guide/00-course-overview.md).

## Baseline

This lab uses the same self-hosted learning baseline as the official basic Custom Element tutorial:

```bash
docker run -it --name liferay-mini -m 8g -p 8080:8080 \
  liferay/portal:7.4.3.132-ga132
```

Default sign-in:

```text
Email: test@liferay.com
Password: test
```

Change the password when prompted.

## Repository layout

```text
liferay-mini/
├── client-extensions/
│   ├── nexcent-global-theme/
│   └── nexcent-landing-elements/
├── docs/lab-guide/
├── sample-data/
│   ├── csv/
│   └── json/
├── scripts/
├── .env.example
└── docker-compose.yml
```

## Quick start

```bash
cp .env.example .env
docker compose up -d
```

Wait until `http://localhost:8080` is available, then continue with Module 02.

## Project rules

- No landing-page text, images, or service lists may be hard-coded in UI components.
- Runtime content must come from Liferay Headless APIs.
- Numeric site, structure, and document IDs must not be committed.
- Every component must implement loading, empty, and error states.
- Import operations must be idempotent by external reference code.
- Keep frontend, importer, and batch concerns separated.

## Reference documentation

- Liferay Client Extensions
- Creating a Basic Custom Element
- Custom Element YAML Configuration Reference
- Headless Delivery Web Content APIs
- Importing and Exporting Data with Batch Client Extensions
