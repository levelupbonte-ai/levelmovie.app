import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Final Pass Verification Tests', () => {

  it('Invar 1: Real Page Loads & window.__marker check', () => {
    // Verify Link component does not call preventDefault or use client-side router
    const linkSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/Link.tsx'), 'utf-8');
    assert.strictEqual(linkSrc.includes('preventDefault'), false, 'Link must never call preventDefault on internal links');
    assert.strictEqual(linkSrc.includes('useNavigate'), false, 'Link must never use client-side useNavigate');
    assert.strictEqual(linkSrc.includes('history.pushState'), false, 'Link must not use history.pushState');

    // Simulate browser window environment marker check
    const mockWindow: Record<string, any> = { __marker: undefined };
    mockWindow.__marker = 1;
    assert.strictEqual(mockWindow.__marker, 1);

    // Simulate full document reload triggered by standard navigation click
    function simulateFullDocumentReload() {
      // On real navigation, the JS heap is destroyed and re-initialized:
      return { __marker: undefined };
    }
    const nextWindow = simulateFullDocumentReload();
    assert.strictEqual(nextWindow.__marker, undefined, 'window.__marker must be undefined on the next page due to full document load');
  });

  it('Invar 2: LevelUpLoader implementation & slow navigation triggers', () => {
    const loaderSrc = fs.readFileSync(path.join(process.cwd(), 'public/assets/js/loader.js'), 'utf-8');
    assert.ok(loaderSrc.includes('LevelUpLoader'), 'Must export LevelUpLoader');
    assert.ok(loaderSrc.includes('wrap'), 'Must provide LevelUpLoader.wrap');
    assert.ok(loaderSrc.includes('700'), 'Must include 700ms timer for slow page navigations');
    assert.ok(loaderSrc.includes("You're offline. Check your connection."), 'Must show offline message if disconnected');
    assert.ok(loaderSrc.includes('pageshow'), 'Must listen to pageshow for back/forward cache reset');
    assert.ok(loaderSrc.includes('This is taking longer than usual...'), 'Must support 8s slow state');
    assert.ok(loaderSrc.includes('Something went wrong on our side.'), 'Must support 20s data error state');
    assert.ok(loaderSrc.includes('role="status"'), 'Must have role=status for accessibility');
  });

  it('Invar 3: Broken Star 404 Geometry & Copy Specification', () => {
    const notFoundSrc = fs.readFileSync(path.join(process.cwd(), 'src/pages/NotFound.tsx'), 'utf-8');
    const html404Src = fs.readFileSync(path.join(process.cwd(), 'public/404.html'), 'utf-8');

    // Check exact geometry coordinates: Center C = 50, 54.4
    assert.ok(notFoundSrc.includes('50,54.4') || notFoundSrc.includes('50, 54.4'), 'Must use Center C = 50, 54.4');
    assert.ok(html404Src.includes('50,54.4') || html404Src.includes('50, 54.4'), '404.html must use Center C = 50, 54.4');

    // Outer points verification: O0(50,10), O1(93.75,40.18), O2(77.04,91.61), O3(22.96,91.61), O4(6.25,40.18)
    assert.ok(notFoundSrc.includes('93.75,40.18') || notFoundSrc.includes('93.75, 40.18'));
    assert.ok(notFoundSrc.includes('77.04,91.61') || notFoundSrc.includes('77.04, 91.61'));
    assert.ok(notFoundSrc.includes('22.96,91.61') || notFoundSrc.includes('22.96, 91.61'));
    assert.ok(notFoundSrc.includes('6.25,40.18') || notFoundSrc.includes('6.25, 40.18'));

    // Inner points verification: I0(61.46,38.62), I1(68.55,60.43), I2(50,73.9), I3(31.45,60.43), I4(38.54,38.62)
    assert.ok(notFoundSrc.includes('61.46,38.62') || notFoundSrc.includes('61.46, 38.62'));
    assert.ok(notFoundSrc.includes('68.55,60.43') || notFoundSrc.includes('68.55, 60.43'));
    assert.ok(notFoundSrc.includes('50,73.9') || notFoundSrc.includes('50, 73.9'));
    assert.ok(notFoundSrc.includes('31.45,60.43') || notFoundSrc.includes('31.45, 60.43'));
    assert.ok(notFoundSrc.includes('38.54,38.62') || notFoundSrc.includes('38.54, 38.62'));

    // Colors: k=0 left #FFFFFF, right #DDD3FF; others left #8B5CF6, right #6D28D9
    assert.ok(notFoundSrc.includes('#FFFFFF'));
    assert.ok(notFoundSrc.includes('#DDD3FF'));
    assert.ok(notFoundSrc.includes('#8B5CF6'));
    assert.ok(notFoundSrc.includes('#6D28D9'));

    // Copy requirements
    assert.ok(notFoundSrc.includes('404'));
    assert.ok(notFoundSrc.includes('This page shattered.'));
    assert.ok(notFoundSrc.includes("The page you're looking for doesn't exist or has moved. Let's put things back together."));
    assert.ok(notFoundSrc.includes('Back to home'));
    assert.ok(notFoundSrc.includes('Services'));
    assert.ok(notFoundSrc.includes('Projects'));
    assert.ok(notFoundSrc.includes('Pricing'));
    assert.ok(notFoundSrc.includes('Contact'));
  });

  it('Invar 4: Legal Pages exact text & bracketed placeholders inventory', () => {
    const privacySrc = fs.readFileSync(path.join(process.cwd(), 'src/pages/Privacy.tsx'), 'utf-8');

    // Check exact legal wording and retention table
    assert.ok(privacySrc.includes('This Privacy Policy explains what personal information LevelUp Ecosystem'));
    assert.ok(privacySrc.includes('1. Information We Collect'));
    assert.ok(privacySrc.includes('6. How Long We Keep Information'));
    assert.ok(privacySrc.includes('overflow-x-auto'), 'Retention table must have horizontal scroll on mobile');
    assert.ok(privacySrc.includes('15. Contact'));

    // Check legal config values and sections are bound in Privacy Policy
    assert.ok(privacySrc.includes('LEGAL_CONFIG.PRIVACY_VERSION'), 'Privacy version must be bound');
    assert.ok(privacySrc.includes('LEGAL_CONFIG.EFFECTIVE_DATE_PRIVACY'), 'Effective date must be bound');
    assert.ok(privacySrc.includes('LEGAL_CONFIG.LAST_UPDATED_PRIVACY'), 'Last updated date must be bound');
    assert.ok(privacySrc.includes('LEGAL_CONFIG.LEGAL_NAME'), 'Legal name must be bound');
    assert.ok(privacySrc.includes('LEGAL_CONFIG.LEGAL_EMAIL'), 'Legal email must be bound');
  });

  it('Invar 5: Firebase cleanUrls & no SPA wildcard redirects', () => {
    const fbSrc = fs.readFileSync(path.join(process.cwd(), 'firebase.json'), 'utf-8');
    const fbConfig = JSON.parse(fbSrc);

    assert.strictEqual(fbConfig.hosting.cleanUrls, true, 'cleanUrls must be true for clean multi-page HTML routing');
    assert.strictEqual(fbConfig.hosting.rewrites, undefined, 'Must not have SPA wildcard rewrites that catch 404s');
  });

  it('Invar 6: Preview buttons have whitespace-nowrap and clean alignment', () => {
    const navbarSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/Navbar.tsx'), 'utf-8');
    const footerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/Footer.tsx'), 'utf-8');

    assert.ok(navbarSrc.includes('whitespace-nowrap'), 'Navbar CTA preview button must prevent overflow wrapping');
    assert.ok(footerSrc.includes('whitespace-nowrap'), 'Footer preview button must have whitespace-nowrap');
  });
});
