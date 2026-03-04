/**
 * Navigation Menu Console-Based Test Assertions
 * Run in the browser DevTools console on any page of Asiya's Flowers.
 * Each test logs PASS or FAIL with a descriptive message.
 */

(function runNavTests() {
  let passed = 0;
  let failed = 0;

  function assert(description, condition, detail = '') {
    if (condition) {
      console.log(`%c PASS %c ${description}`, 'background:#2e7d32;color:#fff;font-weight:bold;border-radius:3px;padding:1px 4px', 'color:inherit', detail);
      passed++;
    } else {
      console.error(`%c FAIL %c ${description}${detail ? ' — ' + detail : ''}`, 'background:#c62828;color:#fff;font-weight:bold;border-radius:3px;padding:1px 4px', 'color:inherit');
      failed++;
    }
  }

  // ── Test 1: Nav exists in the DOM ─────────────────────────────────────────
  const header = document.querySelector('header');
  const nav    = document.querySelector('header nav, header .nav-container, nav');

  assert(
    'Nav exists in the DOM',
    nav !== null,
    nav ? `Found <${nav.tagName.toLowerCase()}> with classes "${nav.className}"` : 'No <nav> or nav element found inside <header>'
  );

  // ── Test 2: Nav (header) has position sticky or fixed ────────────────────
  if (header) {
    const headerStyle  = getComputedStyle(header);
    const navStyle     = getComputedStyle(nav);
    const anchorEl     = header;                         // sticky is applied to <header>
    const anchorStyle  = getComputedStyle(anchorEl);
    const position     = anchorStyle.position;
    const isSticky     = position === 'sticky' || position === '-webkit-sticky';
    const isFixed      = position === 'fixed';

    assert(
      'Nav has position sticky or fixed',
      isSticky || isFixed,
      `Computed position on <header>: "${position}"`
    );
  } else {
    assert('Nav has position sticky or fixed', false, '<header> element not found — cannot read computed style');
  }

  // ── Test 3: Nav remains visible after scrolling ───────────────────────────
  //
  // Strategy:
  //   • Record the nav's bounding rect before scrolling.
  //   • Scroll the page down by 500 px.
  //   • Record the rect again and check the nav is still within the viewport.
  //   • Restore the original scroll position afterwards.
  //
  // Because scrolling is asynchronous the assertion runs inside setTimeout.

  const originalScrollY = window.scrollY;

  window.scrollTo({ top: 500, behavior: 'instant' });

  setTimeout(() => {
    const rect          = header ? header.getBoundingClientRect() : (nav ? nav.getBoundingClientRect() : null);
    const inViewport    = rect && rect.top >= 0 && rect.bottom > 0 && rect.top < window.innerHeight;

    assert(
      'Nav remains visible after scrolling 500 px',
      inViewport,
      rect
        ? `After scroll: top=${rect.top.toFixed(1)}, bottom=${rect.bottom.toFixed(1)}, viewport height=${window.innerHeight}`
        : 'Could not read bounding rect'
    );

    // Restore scroll position
    window.scrollTo({ top: originalScrollY, behavior: 'instant' });

    // ── Summary (printed after async test resolves) ────────────────────────
    printSummary();
  }, 150);

  // ── Test 4: All nav links have non-empty href attributes ─────────────────
  const navLinks = nav
    ? Array.from(nav.querySelectorAll('a'))
    : [];

  // Also collect footer nav links if present
  const footerNavLinks = Array.from(document.querySelectorAll('footer nav a, footer a'));
  const allNavLinks    = navLinks;   // scope to primary nav only

  if (allNavLinks.length === 0) {
    assert('All nav links have non-empty href attributes', false, 'No <a> elements found inside the nav');
  } else {
    const emptyHrefs = allNavLinks.filter(a => {
      const href = (a.getAttribute('href') || '').trim();
      return href === '' || href === '#';
    });

    assert(
      'All nav links have non-empty href attributes',
      emptyHrefs.length === 0,
      emptyHrefs.length === 0
        ? `All ${allNavLinks.length} link(s) have valid href values: ${allNavLinks.map(a => `"${a.getAttribute('href')}"`).join(', ')}`
        : `${emptyHrefs.length} link(s) with empty/hash-only href: ${emptyHrefs.map(a => `"${a.textContent.trim()}"`).join(', ')}`
    );
  }

  // ── Summary helper (called synchronously for tests 1, 2, 4; async for 3) ─
  function printSummary() {
    const total = passed + failed;
    const style = failed === 0
      ? 'color:#2e7d32;font-weight:bold'
      : 'color:#c62828;font-weight:bold';
    console.log(`%c\nResults: ${passed}/${total} tests passed`, style);
  }

  // Print partial summary after the synchronous tests (tests 1, 2, 4)
  // The async test (3) appends its own result and a final summary via setTimeout.
  console.groupCollapsed('%cAsiya\'s Flowers — Nav Tests', 'font-weight:bold;font-size:14px');
  console.log('Running 4 navigation assertions…\n');
  console.groupEnd();
})();
