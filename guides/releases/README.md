# Release notes

This directory keeps the exact human-readable notes published with MyScoutee
GitHub Releases. Historical notes are immutable records of what was actually
qualified at that release; a later run must not rewrite their results.

A local build or installed candidate is not a release. The next release file
keeps its current measured baseline in this directory; after qualification and
manual QA select a commit, that commit receives the QA tag and the same file is
updated for the GitHub Release and its published assets.

Every Debian QA release attaches the package, the Operator client-tools
archive, and the separate `.sha256` file generated beside each artifact.
