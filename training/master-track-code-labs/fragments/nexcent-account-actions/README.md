# Nexcent Account Actions

Dynamic account actions for the Nexcent Master Page header.

## Runtime behavior

```text
Guest user       -> Login | Sign up
Signed-in user   -> OOTB User Personal Menu
```

- `Login` uses `themeDisplay.getURLSignIn()`.
- `Sign up` uses the configurable `Sign Up URL`; it is rendered only when `Show Sign Up` is enabled and the URL is not empty.
- Signed-in output uses `[@liferay.user_personal_bar /]`, following the accepted Clarity-style implementation for this header.
- Do not extend this pattern to embed other runtime widgets in fragments.
- Keep this fragment not cacheable because its output depends on the current authentication state.

## Package the Fragment Set

Do not package this fragment as a standalone ZIP for the course flow.

From the repository root on Windows PowerShell:

```powershell
./training/master-track-code-labs/scripts/package-fragments.ps1
```

Expected output:

```text
training/master-track-code-labs/fragments/collections-nexcent-components.zip
```

The package contains the complete `Nexcent Components` Fragment Set:

```text
nexcent-components/
├── collection.json
└── fragments/
    ├── nexcent-account-actions/
    ├── nexcent-mobile-navigation/
    └── nexcent-section-wrapper/
```

## Import or update

```text
Site Menu
→ Design
→ Fragments
→ Fragment Sets options
→ Import
```

Import `collections-nexcent-components.zip`. When `Nexcent Components` already exists, use overwrite/update for matching fragment keys. Do not create a duplicate Fragment Set.

After import, confirm that `Nexcent Account Actions` is not marked cacheable.

## Add to the Master Page

Author the header using this tree:

```text
Page Header
└── Header Inner
    ├── Nexcent Logo
    └── Nexcent Mobile Navigation
        └── Navigation Drop Zone
            └── Header Menu
                ├── Menu Display → Nexcent Header
                └── Nexcent Account Actions
```

Configure `Sign Up URL` with the site's Create Account utility page. Keep the Master Page in Draft until both Header mobile and Footer runtime gates pass.

## Runtime verification

1. Open Home in a guest/incognito session: `Login` and the configured `Sign up` action must appear.
2. Sign in as `admin@nexcent.com`: guest actions must be replaced by the OOTB User Personal Menu.
3. Verify the personal menu opens and its standard account/sign-out actions work.
4. Sign out and verify the Liferay Sign-In flow opens from `Login`.
5. Verify `Sign up` opens the selected Create Account utility page.
6. Repeat the guest and authenticated checks at the `375px` mobile viewport inside the Mobile Navigation panel.

Source verification alone does not complete this checkpoint; it passes only after testing against the running Liferay DXP portal.