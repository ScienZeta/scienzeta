ScienZeta Android APK build on a phone

This ZIP includes the ScienZeta source and a GitHub Actions workflow to build the APK in the cloud. It does not contain a prebuilt APK.

1. Extract this ZIP on your phone.
2. Create a repository on GitHub.com and upload the extracted files/folders, keeping the .github/workflows/android-apk.yml file and android/ folder structure.
3. In the repository, open Actions and select "Build ScienZeta Android APK", then tap Run workflow.
4. Wait for the workflow to finish successfully.
5. Open the completed workflow run, find Artifacts, and download "ScienZeta-debug-APK".
6. Extract the downloaded artifact ZIP; tap app-debug.apk to install it.
7. If Android asks, allow your browser/file manager to install unknown apps, then retry. Only install APKs you built/trust.

Notes:
- This is a debug APK for personal testing, not a Play Store release.
- Android app requires Android 8.0 (API 26) or newer.
- The build may reveal source-code errors that need fixing; a successful build is not guaranteed until the workflow runs.
