/**
 * nav.test.js — Console-based navigation tests for Asiya's Flowers
 *
 * Usage (either method works):
 *   1. Browser console — open any page, paste this entire file and press Enter
 *   2. Script tag     — add <script src="tests/nav.test.js"></script> before </body>
 *
 * Expected nav structure (all 6 tests pass with this pattern):
 *
 *   <header>                          ← position: sticky keeps nav visible on scroll
 *     <nav class="nav-container">
 *       <a href="index.html" class="logo">…</a>   ← logo = home link (index.html)
 *       <ul class="nav-menu">
 *         <li><a href="about.html">About</a></li>
 *         <li><a href="services.html">Services</a></li>
 *         <li><a href="gallery.html">Gallery</a></li>
 *         <li><a href="contact.html">Contact</a></li>
 *       </ul>
 *     </nav>
 *   </header>
 *
 * Key rule: the logo already links to index.html, so there must be NO
 * separate "Home" <li> in the menu — that would create a duplicate href
 * and fail test 6 (No duplicate hrefs among nav links).
 */

(async function runNavTests() {
  'use strict';

  let passed = 0;
  let failed = 0;

  function pass(label) {
    console.log(
      '%c✓ PASS%c  ' + label,
      'color:#2e7d32;font-weight:bold',
      'color:inherit'
    );
    passed++;
  }

  function fail(label, detail) {
    console.error('✗ FAIL  ' + (detail ? label + ' — ' + detail : label));
    failed++;
  }

  function assert(label, condition, detail) {
    condition ? pass(label) : fail(label, detail);
  }

  console.group('%cNav Test Suite', 'font-size:14px;font-weight:bold');

  // ── 1. Nav exists in the DOM ─────────────────────────────────────────────
  const nav = document.querySelector('nav');
  assert('Nav element exists in the DOM', nav !== null);

  if (!nav) {
    fail('Remaining tests skipped — no <nav> element found in document');
    printSummary();
    return;
  }

  // ── 2. Nav (or closest header) has position sticky or fixed ──────────────
  //
  // The site applies sticky positioning to <header>, which wraps <nav>.
  // We walk up to the nearest positioned ancestor so the test works
  // whether sticky is on the nav itself or a parent element.
  const stickyTarget = nav.closest('header') ?? nav;
  const position = getComputedStyle(stickyTarget).position;
  assert(
    'Nav has position "sticky" or "fixed"',
    position === 'sticky' || position === 'fixed',
    'computed position is "' + position + '"'
  );

  // ── 3. Nav remains visible after scrolling to the bottom of the page ─────
  //
  // A sticky/fixed element keeps a non-negative top and stays within the
  // viewport regardless of scroll position. We restore scroll afterwards.
  const originalScrollY = window.scrollY;

  window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
  await new Promise(function (resolve) { setTimeout(resolve, 100); });

  const rect = stickyTarget.getBoundingClientRect();
  const isVisible =
    rect.top >= 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight;

  assert(
    'Nav remains visible after scrolling to page bottom',
    isVisible,
    'getBoundingClientRect: top=' + rect.top.toFixed(1) +
      ', bottom=' + rect.bottom.toFixed(1) +
      ', innerHeight=' + window.innerHeight
  );

  window.scrollTo({ top: originalScrollY, behavior: 'instant' });

  // ── 4. All nav links have non-empty href attributes ───────────────────────
  const links = Array.from(nav.querySelectorAll('a'));
  assert(
    'Nav contains at least one <a> element',
    links.length > 0,
    'found ' + links.length + ' <a> element(s)'
  );

  const emptyHrefLinks = links.filter(function (a) {
    return !a.getAttribute('href') || !a.getAttribute('href').trim();
  });

  assert(
    'All nav links have non-empty href attributes',
    emptyHrefLinks.length === 0,
    emptyHrefLinks.length
      ? emptyHrefLinks.length + ' link(s) missing href: ' +
          emptyHrefLinks
            .map(function (a) { return '"' + a.textContent.trim() + '"'; })
            .join(', ')
      : undefined
  );

  // ── 5. No duplicate href values among nav links ───────────────────────────
  const hrefs = links
    .map(function (a) { return (a.getAttribute('href') || '').trim(); })
    .filter(Boolean);

  const seen = new Set();
  const duplicates = hrefs.filter(function (href) {
    if (seen.has(href)) return true;
    seen.add(href);
    return false;
  });

  assert(
    'No duplicate hrefs among nav links',
    duplicates.length === 0,
    duplicates.length
      ? 'duplicate href(s): ' +
          Array.from(new Set(duplicates))
            .map(function (h) { return '"' + h + '"'; })
            .join(', ')
      : undefined
  );

  // ── Summary ───────────────────────────────────────────────────────────────
  printSummary();

  function printSummary() {
    const total = passed + failed;
    const color = failed === 0 ? '#2e7d32' : '#c62828';
    console.log('─'.repeat(48));
    console.log(
      '%c' + passed + ' / ' + total + ' tests passed' +
        (failed ? ', ' + failed + ' failed' : ' ✓'),
      'color:' + color + ';font-weight:bold'
    );
    console.groupEnd();
  }
})();
