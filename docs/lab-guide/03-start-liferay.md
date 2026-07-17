# Lab 03 — Start Liferay and Complete Initial Setup

## Overview

Start the local Liferay server, complete the setup wizard, and verify the portal and API Explorer.

## Estimated time

15–30 minutes for the first startup.

## Step 1: Start the server with Blade

From the workspace root:

```bash
blade server run
```

Keep the terminal open. The first startup takes longer because Liferay initializes its database and OSGi modules.

Alternative commands:

macOS or Linux:

```bash
./bundles/tomcat/bin/catalina.sh run
```

Windows:

```powershell
.\bundles\tomcat\bin\catalina.bat run
```

## Step 2: Wait for startup completion

Watch the logs, then open:

```text
http://localhost:8080
```

Do not start the setup wizard before portal initialization finishes.

## Step 3: Complete the setup wizard

Suggested local values:

- Portal name: `Nexcent Lab`
- Default language: your preferred language
- Administrator: your local development account

Use a strong local password and never commit it.

The embedded database is sufficient for this learning project unless the instructor requires another database.

## Step 4: Verify Liferay navigation

After signing in, verify access to:

- Global Menu
- Control Panel
- Site Menu
- Site Content → Web Content
- Applications → Client Extensions

The Global Menu layout in Liferay DXP 2026 differs from older 7.4 screenshots. Follow labels rather than exact tab positions.

## Step 5: Verify API Explorer

Open:

```text
http://localhost:8080/o/api
```

Confirm that the REST API Explorer loads.

## Step 6: Verify the endpoint from a terminal

```bash
curl -I http://localhost:8080
```

Expected result includes an HTTP response from the local server.

## Step 7: Stop the server safely

When running in the foreground, press:

```text
Ctrl+C
```

Or use the shutdown script.

macOS or Linux:

```bash
./bundles/tomcat/bin/shutdown.sh
```

Windows:

```powershell
.\bundles\tomcat\bin\shutdown.bat
```

## Checkpoint

- [ ] Liferay starts without a fatal error.
- [ ] `http://localhost:8080` opens.
- [ ] The administrator can sign in.
- [ ] Web Content is available.
- [ ] Client Extensions is available.
- [ ] API Explorer opens at `/o/api`.

## Troubleshooting

### Port 8080 is already in use

Stop the conflicting process or configure another Tomcat port. Keep all lab URLs synchronized if you change the port.

### Server uses the wrong Java runtime

macOS or Linux:

```bash
java -version
echo $JAVA_HOME
```

Windows:

```powershell
java -version
$env:JAVA_HOME
```

### Browser shows a connection error

Check the server logs. The setup page is available only after Tomcat and portal initialization complete.

### Setup data is incorrect

Stop the server and use the documented course reset procedure. Do not delete arbitrary OSGi directories while the server is running.

## Knowledge check

1. What is the difference between `initBundle` and `server run`?
2. Why should Tomcat be stopped gracefully?
3. Where do you inspect Liferay REST APIs?
