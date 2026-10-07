# Svelte Cookie Consent

[![docs](https://img.shields.io/badge/DOCS-8A2BE)](https://svelte-cookie-consent.js.org/)
[![demo](https://img.shields.io/badge/DEMO-8A2BE2)](https://svelte-cookie-consent.js.org/demo/)
[![actions](https://github.com/SebaOfficial/svelte-cookie-consent/actions/workflows/publish.yml/badge.svg)](https://github.com/SebaOfficial/svelte-cookie-consent/actions/workflows/publish.yml) [![SvelteKit](https://img.shields.io/badge/svelte-kit-orange.svg)](https://kit.svelte.dev) [![Svelte v5](https://img.shields.io/badge/svelte-v5-blueviolet.svg)](https://svelte.dev)

A production-ready Svelte cookie-consent component that helps developers implement customizable consent controls. Legal compliance depends on your configuration, privacy notices, jurisdiction, and the behavior of your tracking integrations.

## Features

- Small, discrete, and non-intrusive;
- Helps implement granular consent controls;
- Support for predefined choices (`necessary`, `marketing`, etc.)
- Multiple consents (box, banner, ...)
- Responsive;
- Runs any function on opting-in or opting-out (_even on each visit_)
- Svelte Ready
- Fully customizable

## Installation

### Via npm

```shell
npm install -D svelte-cookie-consent
```

### Via CDN

```html
<script
   type="module"
   src="https://unpkg.com/svelte-cookie-consent@latest/dist/cookie-consent.js"
></script>
```

## Usage

Check out the [documentation](https://svelte-cookie-consent.js.org) for a list of the available props.

### Svelte / SvelteKit

```svelte
<script lang="ts">
   import { CookieBox } from '$lib/index.js';

   const choices = $state({
      necessary: {
         label: 'Necessary cookies',
         description: "Used for cookie control. Can't be turned off.",
         value: true,
         mandatory: true,
      },
      tracking: {
         label: 'Tracking cookies',
         description: 'Used for advertising purposes.',
         value: false,
      },
      analytics: {
         label: 'Analytics cookies',
         description: 'Used to control Analytics.',
         value: false,
      },
      marketing: {
         label: 'Marketing cookies',
         description: 'Used for marketing data.',
         value: false,
      },
   });
</script>

<CookieBox
   consentVersion="2026-10-06"
   cookie={{
      name: 'gdpr-cookie',
      path: '/',
      secure: true,
      sameSite: 'strict',
   }}
   heading="GDPR Notice"
   description="We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. By clicking accept, you consent to our privacy policy & use of cookies."
   acceptAllLabel="Accept All"
   rejectAllLabel="Reject All"
   customize={{
      label: 'Customize',
      chooseLabel: 'Choose Which Cookies To Enable',
      confirmLabel: 'Confirm My Choices',
      showAcceptRejectAllButtons: true,
   }}
   {choices}
/>
```

### HTML / Web Components

```html
<cookie-banner
   heading="GDPR Notice"
   description="We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. By clicking accept, you consent to our privacy policy & use of cookies."
   acceptAllLabel="Accept All"
   rejectAllLabel="Reject All"
   cookie='{
    "name": "gdpr-cookie",
    "path": "/",
    "secure": true,
    "sameSite": "strict"
   }'
   customize='{
    "label": "Customize",
    "chooseLabel": "Choose Which Cookies To Enable",
    "confirmLabel": "Confirm My Choices"
   }'
></cookie-banner>
```

## Fingerprinting

Accepting analytics or tracking cookies will create a unique UUID to allow you to differentiate events from different users when using server-side cookies in a system such as CAPI.

Fingerprinting and all other optional tracking must only be enabled after the user has given the appropriate consent. The library stores consent state and invokes your callbacks; your callbacks must initialize trackers only after consent and remove third-party cookies, local-storage identifiers, SDK state, and server-side identifiers when consent is withdrawn.

To enable fingerprinting you must have a configuration like this:

```svelte
<CookieBox fingerprinting={true} />
<!-- OR -->
<CookieBox
   fingerprinting={{
      uuid: 'a-unique-user-identifier',
      cookie: {
         name: 'fingerprint',
         path: '/',
         secure: true,
         sameSite: 'strict',
      },
   }}
/>
```

## Privacy and security notes

- Displayed headings, descriptions, labels, and choice descriptions are rendered as escaped text by default.
- To include links or other markup, use the explicit `html` property:

   ```svelte
   <CookieBox
      description={{
         text: 'Read our privacy policy',
         html: 'Read our <a href="/privacy">privacy policy</a>.',
      }}
   />
   ```

   The `html` property is rendered as raw HTML and must contain trusted or sanitized content. Never pass unsanitized CMS, API, URL, or user-generated content to it.

- The consent cookie is intentionally client-readable because this library runs in the browser. Do not store sensitive data in it, and do not treat it as authoritative server-side proof of consent without additional verification.
- If fingerprinting uses a separate cookie, the library removes that cookie when tracking and analytics are not selected. Cookies and identifiers created by external services must still be removed by your callbacks.
- Configure `secure: true`, an appropriate `sameSite` value, a narrow `path` where possible, and a suitable expiration policy.
- This package does not itself make a site GDPR-compliant. Consult applicable privacy requirements and provide an accurate privacy notice.
- Set `consentVersion` to your current privacy-policy or purposes version. Changing it prompts users to review their choices again.
- For server-side records, send the selected categories, consent version, timestamp, and policy version to your own consent-management endpoint. Validate that record independently; the browser cookie can be modified by the user.
- Existing users of rich HTML content should migrate those strings to plain text. If trusted rich content is required, render it through a separately sanitized application-owned Svelte snippet rather than passing untrusted HTML to this component.
