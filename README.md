# Liferay Mini Project Lab

Build a dynamic Nexcent landing page on **Liferay DXP 2026.Q1.1 LTS** using Custom Element Client Extensions, Classic Web Content, Headless APIs, and an Excel migration flow.

## Course style

This repository follows the structure used by modern courses on [learn.liferay.com](https://learn.liferay.com):

- `main` is the starting branch for exercises.
- `final` contains the completed reference solution.
- Lessons are completed in order.
- Each lesson includes objectives, steps, snippets, checkpoints, troubleshooting, and knowledge checks.

## Prerequisites

- Git
- Java JDK 21
- Blade CLI
- Node.js LTS
- Yarn

Verify the environment:

```bash
git version
java -version
javac -version
blade version
node --version
yarn --version
```

## Generate the official Gradle Wrapper

The repository stores the course configuration as text. Use Blade CLI once to generate the official Gradle Wrapper files for the pinned product.

macOS or Linux:

```bash
chmod +x scripts/bootstrap-workspace.sh
./scripts/bootstrap-workspace.sh
```

Windows PowerShell:

```powershell
Set-ExecutionPolicy Bypass -Scope Process
.\scripts\bootstrap-workspace.ps1
```

## Initialize the local bundle

macOS or Linux:

```bash
./gradlew initBundle
```

Windows:

```powershell
.\gradlew.bat initBundle
```

The command creates a local `bundles/` directory containing Liferay and Tomcat. This directory is ignored by Git.

## Start Liferay

```bash
blade server run
```

Then open:

- Portal: http://localhost:8080
- API Explorer: http://localhost:8080/o/api

## Learning path

1. [Course overview and architecture](docs/lab-guide/00-course-overview.md)
2. [Install and verify development tools](docs/lab-guide/01-install-tools.md)
3. [Clone the workspace and run initBundle](docs/lab-guide/02-init-bundle.md)
4. [Start Liferay and complete initial setup](docs/lab-guide/03-start-liferay.md)
5. Explore the site and Headless API Explorer
6. Model Hero Web Content
7. Model Services and Features Web Content
8. Create the first Custom Element
9. Build Hero, Services, and Features
10. Add global design tokens and shared API utilities
11. Import content from Excel
12. Test and submit the final project

## Target architecture

```text
Liferay Page
├── Global CSS Client Extension
├── Global JavaScript Client Extension
├── Nexcent Hero Custom Element
├── Nexcent Services Custom Element
├── Nexcent Features Custom Element
└── Nexcent Content Importer Custom Element

Custom Elements
        ↓
Headless Delivery REST API
        ↓
Classic Web Content + Documents and Media
```

## Important 2026 note

Liferay DXP 2026 introduced the new object-based Liferay CMS. This course intentionally uses Classic Web Content because the assignment requires imported records under **Site Content → Web Content**.

## Repository structure

```text
liferay-mini/
├── client-extensions/
├── configs/
├── docs/lab-guide/
├── sample-data/
├── scripts/
├── gradle/
├── gradle.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

## Sample content

Starter content is stored in:

```text
sample-data/
├── assets/
├── csv/
└── json/
```

These files are migration input, not frontend hard-coded data.

## Rules

- Do not commit `bundles/`.
- Do not commit passwords, tokens, or machine-specific paths.
- Do not hard-code landing-page content in frontend components.
- Use stable external reference codes for migration.
