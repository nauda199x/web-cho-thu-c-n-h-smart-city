# Commission Tracker — Working Portfolio Prototype

A demonstration of a verification-first sales commission system for Google Sheets / Google Apps Script.

**Status:** demo only, not a paid-client delivery. No real customer data, Cognito account, or email is connected.

## What it proves
- Unique source + form record ID blocks duplicate submissions.
- Spreadsheet approval checkbox gates payouts and nightly report.
- A date key and script lock prevent concurrent duplicate send attempts.
- Mail audit stores delivery attempt state; ambiguous delivery requires manual reconciliation.
- The system recalculates totals from live rows, so deleting a row changes future reports without stale stored totals.
- Google Apps Script checks America/New_York after 9 PM local time; it is not a guaranteed exact-minute execution.

See [Code.gs](./Code.gs) for the reference backend and [demo.html](./demo.html) for the interactive local demonstration (open the HTML file in a browser).

### Sample payload
```json
{"token":"SET_A_LONG_SECRET","source":"Cognito Forms","formRecordId":"12345","leadGenerator":"Agent A","commission":80}
```

### Deployment steps
1. New blank Google Sheet -> Extensions -> Apps Script -> paste Code.gs.
2. Set Script Properties INTAKE_TOKEN and REPORT_TO.
3. Run setupDemo, authorize the required Google Workspace scopes, review privacy and Web App access.
4. Deploy the script Web App; send JSON through Zapier or Make (no public API keys).
5. Test with synthetic forms and authorized recipients before using real business data.

### Disclosure
- The browser prototype only simulates report sending.
- True exactly-once email delivery is impossible without transactional coordination with the mail provider; ambiguous results are deliberately not resent automatically.
- For larger-scale workloads use a transactional queue/database and server-side authentication.

Prepared as evidence for small Apps Script automation freelance projects. This branch is isolated from the site's main branch.
