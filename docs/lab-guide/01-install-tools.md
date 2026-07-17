# Lab 01 — Install and Verify the Development Tools

## Overview

Prepare the same local prerequisites used by modern learn.liferay courses.

## Estimated time

30–60 minutes.

## Required tools

- Git
- Java JDK 21
- Blade CLI
- Node.js LTS
- Yarn

## Step 1: Verify Git

```bash
git version
```

Expected result:

```text
git version 2.x.x
```

## Step 2: Verify Java 21

```bash
java -version
javac -version
```

Both commands must report major version `21`.

Verify `JAVA_HOME`.

macOS or Linux:

```bash
echo $JAVA_HOME
```

Windows PowerShell:

```powershell
$env:JAVA_HOME
```

The value must point to the JDK root, not its `bin` directory.

## Step 3: Verify Blade CLI

Install Blade CLI using the official Liferay instructions, then run:

```bash
blade version
blade update
```

## Step 4: Verify Node.js

```bash
node --version
npm --version
```

Use an active Node.js LTS release.

## Step 5: Enable Yarn

```bash
corepack enable
yarn --version
```

## Step 6: Record the environment

Run:

```bash
git version
java -version
blade version
node --version
yarn --version
```

Do not commit machine-specific paths or credentials.

## Checkpoint

- [ ] Git works.
- [ ] `java` and `javac` use version 21.
- [ ] Blade CLI works and is current.
- [ ] Node.js works.
- [ ] Yarn works.

## Troubleshooting

### Java uses an older JDK

Update `JAVA_HOME` and move `$JAVA_HOME/bin` before older Java installations in `PATH`.

### Blade reports an available update

```bash
blade update
```

Open a new terminal and verify again.

### Yarn is missing

```bash
corepack enable
```

## Knowledge check

1. Why does the course pin Java 21?
2. What is the difference between `java` and `javac`?
3. What does Blade CLI provide for Liferay development?
