# VMware browser TLS and notification registration — 2026-09-16

## Observed failure

On `https://localhost/game`, Chrome reported an SSL certificate error while
registering `https://localhost/app-sw.js`. Notification settings could not be
saved. The service-worker readiness wait has a 3,000 ms limit; this failure
occurred before the Firebase token request and backend device registration.
The 3,000 ms value is the configured limit, not a measured successful
registration duration.

## Local environment change

- Target: VMware application `1.0.0-qa.3`, build
  `qa3-20260916-security-r6`, accessed through the localhost tunnel.
- At **23:12:56 Europe/Bratislava**, the existing VMware certificate was added
  to the workstation user's Chrome NSS trust store:
  `/home/raxim/.pki/nssdb`.
- This was a **certificate trust-store update**, not an application/browser
  cache clear, application build, or database modification.
- Certificate: self-signed `CN=localhost`; SANs `localhost` and `127.0.0.1`.
- SHA-256 fingerprint:
  `1E:F5:6E:50:2A:75:89:40:D7:3C:56:E5:5D:C4:EE:5F:F6:72:97:7C:23:15:EF:A3:C8:59:52:6E:1F:B5:6E:94`.
  The served certificate matched the imported certificate.
- NSS nickname: `MyScoutee VMware QA localhost 1EF56E50`; trust flags `P,,`
  (trusted SSL peer, not a newly trusted certificate authority).
- `certutil -V -u V` returned `certificate is valid`.
- The pre-change certificate database was backed up locally at
  `/tmp/myscoutee-nss-tools/cert9-before-vmware-trust.db` (temporary evidence).
- Chrome restarted at **23:14:39**. An earlier page refresh, while the old
  Chrome process was still running, continued to show the SSL error.

Procedure reference:
[Chromium Linux certificate management](https://chromium.googlesource.com/chromium/src/+/master/docs/linux/cert_management.md).

## Result and limits

At **23:14:58**, the VMware nginx access log recorded:

```text
POST /api/activities/chats/devices HTTP 200
```

This confirms that the subsequent request reached the device-registration
endpoint and received a successful HTTP response. No independent MongoDB
read-back or push-delivery test was performed for this observation.

**The successful operation's duration was not measured.** The access-log
format records a timestamp and status but no request duration; it cannot
establish the elapsed Firebase-token or complete Save duration.

This trust entry applies to this workstation. It does not make the VMware
certificate publicly trusted or configure another tester's browser.
