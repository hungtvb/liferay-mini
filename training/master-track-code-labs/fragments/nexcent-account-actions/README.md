# Nexcent Account Actions

Dynamic header actions for the Nexcent Master Page.

## Runtime behavior

```text
Guest user       -> Login | Sign up
Signed-in user   -> Account
```

- `Login` uses `themeDisplay.getURLSignIn()`.
- `Account` uses `themeDisplay.getURLMyAccount()`.
- `Sign up` uses the fragment's configurable `Sign Up URL` so the editor can select the site's Create Account utility page without hard-coding an environment URL.
- Keep this fragment **not cacheable** because its output depends on the current authentication state.

## Package on Windows PowerShell

From the repository root:

```powershell
$source = ".\training\master-track-code-labs\fragments\nexcent-account-actions"
$target = ".\training\master-track-code-labs\fragments\nexcent-account-actions.zip"

Remove-Item $target -Force -ErrorAction SilentlyContinue
Compress-Archive -Path $source -DestinationPath $target
```

## Import

```text
Site Menu
-> Design
-> Fragments
-> select or create the Nexcent Training fragment set
-> Import
-> nexcent-account-actions.zip
```

After import, confirm that `Nexcent Account Actions` is not marked cacheable.

## Add to the Master Page

1. Edit `Nexcent Master Page`.
2. Drag `Nexcent Account Actions` into the `Header Actions` container.
3. Select the fragment and configure `Sign Up URL` with the site's Create Account utility page.
4. Publish the fragment if it was imported as a draft.
5. Keep the Master Page as draft until the remaining header and footer layout is complete.

## Verification

1. Open the page in an incognito window: `Login` and `Sign up` must appear.
2. Sign in: the two guest actions must be replaced by `Account`.
3. Click `Account`: Liferay My Account must open.
4. Sign out and click `Login`: the Liferay Sign-In flow must open.
5. Click `Sign up`: the selected Create Account utility page must open.
