# Local Runtime Login — `@nexcent.com`

The Nexcent training environment follows the same local-course pattern used by the Liferay Clarity labs: the default virtual instance has a project-specific web ID, and lab users sign in with project-domain email addresses.

## Bootstrap administrator

On a new embedded database, `configs/local/portal-ext.properties` initializes:

```text
Email:       admin@nexcent.com
Password:    learn
Screen name: nexcentadmin
```

The effective email is composed by Liferay from:

```properties
default.admin.email.address.prefix=admin
company.default.web.id=nexcent.com
```

Email-address authentication is explicit:

```properties
company.security.auth.type=emailAddress
```

## Lab user convention

Only the administrator is bootstrapped by portal properties. Create the remaining users during the Practitioner Users, Roles, and Permissions exercise so the learner still practices account and permission administration.

Use these local-only identities:

```text
site.manager@nexcent.com
content.author@nexcent.com
content.reviewer@nexcent.com
```

Recommended responsibilities:

| User | Purpose |
|---|---|
| `admin@nexcent.com` | Portal administrator and emergency recovery account |
| `site.manager@nexcent.com` | Manages the Nexcent Site, pages, navigation, and site configuration |
| `content.author@nexcent.com` | Creates and edits Web Content and Documents and Media assets |
| `content.reviewer@nexcent.com` | Reviews permissions, publication state, and final evidence |

Do not use the administrator for normal content-authoring checkpoints once the role-specific users exist.

## Important first-start behavior

The default administrator properties are applied when Liferay initializes a new database. They do not rename an administrator already stored in an existing database.

To verify the bootstrap behavior from a clean local fixture:

```bash
rm -rf bundles
./gradlew initBundle
blade server run
```

Removing `bundles` deletes the local embedded training database. Do not run this command after starting course work unless the data has been backed up or intentionally discarded.

## Checkpoint

- [ ] Setup Wizard does not block the local training startup.
- [ ] Sign-in uses email address authentication.
- [ ] `admin@nexcent.com` can sign in with the documented local password.
- [ ] The default virtual instance web ID is `nexcent.com`.
- [ ] Role-specific users use the `@nexcent.com` domain.
- [ ] No production credential or personal email address is committed.

## Scope and safety

These settings are intentionally stored under `configs/local` and are only for the reproducible course environment. Do not reuse the password, permissive development overrides, or local virtual-host configuration in production.
