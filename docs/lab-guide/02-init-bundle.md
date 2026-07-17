# Lab 02 — Clone the Workspace and Run initBundle

## Overview

Clone the course repository, generate the official Gradle Wrapper with Blade CLI, and download the local Liferay Tomcat bundle into `bundles/`.

## Estimated time

20–45 minutes, depending on network speed.

## Baseline

```properties
liferay.workspace.product=dxp-2026.q1.1-lts
```

The course pins:

- Liferay Workspace plugin `16.0.3`
- Gradle `8.5`
- Java `21`

## Step 1: Clone the repository

```bash
git clone https://github.com/hungtvb/liferay-mini.git
cd liferay-mini
```

Verify the branch:

```bash
git branch --show-current
```

Expected result:

```text
main
```

## Step 2: Generate the Gradle Wrapper

The repository stores text configuration but generates `gradle-wrapper.jar` from the pinned Liferay product using Blade CLI.

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

The script runs `blade init` in a temporary directory and copies only the official Gradle Wrapper files into this workspace. It does not overwrite the course documentation or configuration.

Verify:

```bash
./gradlew --version
```

Windows:

```powershell
.\gradlew.bat --version
```

Gradle must report JVM 21.

## Step 3: Inspect the workspace settings

`gradle.properties`:

```properties
liferay.workspace.product=dxp-2026.q1.1-lts
```

`settings.gradle`:

```groovy
buildscript {
    dependencies {
        classpath group: "com.liferay", name: "com.liferay.gradle.plugins.workspace", version: "16.0.3"
    }

    repositories {
        mavenLocal()
        maven {
            url "https://repository-cdn.liferay.com/nexus/content/groups/public"
        }
    }
}

apply plugin: "com.liferay.workspace"
```

## Step 4: Initialize the Liferay bundle

macOS or Linux:

```bash
./gradlew initBundle
```

Windows:

```powershell
.\gradlew.bat initBundle
```

This downloads and extracts Liferay and Tomcat into:

```text
bundles/
```

## Step 5: Verify the generated bundle

macOS or Linux:

```bash
ls bundles/tomcat/bin
```

Windows PowerShell:

```powershell
Get-ChildItem .\bundles\tomcat\bin
```

Expected workspace shape:

```text
liferay-mini/
├── bundles/
│   ├── deploy/
│   ├── osgi/
│   └── tomcat/
├── client-extensions/
├── gradle/
├── gradle.properties
├── gradlew
└── settings.gradle
```

## Step 6: Verify Git ignores the bundle

```bash
git status --short
```

The `bundles/` directory must not appear.

## Checkpoint

- [ ] The repository is cloned.
- [ ] The Gradle Wrapper is generated.
- [ ] `./gradlew --version` uses Java 21.
- [ ] `initBundle` succeeds.
- [ ] `bundles/tomcat/` exists.
- [ ] `bundles/` is ignored by Git.

## Troubleshooting

### Blade is missing

Install Blade CLI and run:

```bash
blade update
```

Then rerun the bootstrap script.

### Permission denied for gradlew

```bash
chmod +x gradlew
```

### Wrong Java version

```bash
./gradlew --version
```

Correct `JAVA_HOME` before retrying.

### Checksum or metadata error

```bash
blade update
./gradlew --refresh-dependencies initBundle
```

Do not randomly change the product key or Workspace plugin version.

## Knowledge check

1. Why is `bundles/` excluded from Git?
2. What does `liferay.workspace.product` control?
3. Why is the wrapper generated from Blade rather than downloaded from an unknown source?
