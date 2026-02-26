## Micro-Iteration Breakdown: Contact Form Enhancement

---

### The 7 Steps

**Step 1 — Intercept the submit event**
Attach a `submit` event listener to the form and call `preventDefault()`. Nothing else. Verify by clicking "Send Message" and confirming the page no longer refreshes.

**Step 2 — Read and log form field values**
Inside the handler, collect all field values into a plain object and `console.log` it. Confirms the wiring between the DOM and JavaScript is correct before any logic is added.

**Step 3 — Build a validation function for required fields**
Write a function that checks only the required fields (name, email, message) for empty values. Return a structured errors object. No UI changes yet — test by calling the function manually in the console with mock data.

**Step 4 — Add email format validation**
Extend the validation function with a regex check on the email field. This is isolated from the required-field check, making it easy to adjust the pattern independently. Still no UI — verify in the console.

**Step 5 — Render inline error messages under fields**
Write a function that accepts the errors object and injects/clears `<span>` error elements beneath each invalid field. Hook it up to the validator output. Test by submitting with various combinations of missing/invalid data.

**Step 6 — Add error and success visual states via CSS classes**
Add CSS classes (e.g. `.field-error`, `.field-success`) toggled on each input based on validation state. This step touches only styling — no logic changes. Test that borders/colors appear and clear correctly on re-submission.

**Step 7 — Display the success message**
On a fully valid submission, hide the form and show a pre-written success `<div>` (already in the HTML, just hidden). This is the final user-visible payoff step. Test the full happy path end-to-end.

---

### Why This Breakdown Works Well for Micro-Iteration

| Principle | How it applies here |
|---|---|
| **Single responsibility per step** | Each step changes exactly one concern — event handling, data collection, validation logic, email rules, error display, styling, success state. None of these overlap. |
| **Testable in isolation** | Steps 1–4 are testable purely in the browser console before any UI is wired up. You don't need the full feature to verify a piece of it. |
| **Reversible at any point** | If Step 6's CSS approach needs rethinking, you can redo it without touching the validation logic in Steps 3–4. |
| **No dead code in intermediate states** | Each step leaves the form in a working (if incomplete) state — never broken between iterations. |
| **Deferred complexity** | Email regex and success UX (the trickier parts) come after the scaffolding is confirmed solid, reducing debugging surface area. |
| **Clear done criteria** | Every step has a concrete, observable test — no ambiguity about whether it's finished. |