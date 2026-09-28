import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Identity & Entity Pass Verification Tests', () => {

  it('Invar 1: Single Source of Truth identity.json matches exact specification', () => {
    const rootConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/identity.json'), 'utf-8'));
    const srcConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/config/identity.json'), 'utf-8'));

    assert.strictEqual(rootConfig.personName, 'Richelieu Bonte');
    assert.strictEqual(rootConfig.personRole, 'Founder of LevelUp Ecosystem');
    assert.strictEqual(
      rootConfig.personOneLiner,
      'Richelieu Bonte is the founder of LevelUp Ecosystem, a web design studio building secure, AI-assisted websites for local businesses and creators. He is a cybersecurity student based in San Diego, California, originally from the Democratic Republic of Congo.'
    );
    assert.strictEqual(rootConfig.orgName, 'LevelUp Ecosystem');
    assert.strictEqual(
      rootConfig.orgOneLiner,
      'LevelUp Ecosystem is a web design and development studio that builds fast, secure websites for local businesses, creators and portfolios.'
    );
    assert.strictEqual(rootConfig.studioName, 'LevelStudio');
    assert.strictEqual(rootConfig.contactEmail, 'hello@levelup-ecosystem.com');
    assert.deepStrictEqual(rootConfig, srcConfig);
  });

  it('Invar 2: Homepage index.html Structured Data (JSON-LD) Validation', () => {
    const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonLdMatch, 'index.html must contain JSON-LD block');

    const schemas = JSON.parse(jsonLdMatch[1]);
    const org = schemas.find((s: any) => s['@type'] === 'Organization');
    assert.ok(org, 'Must have Organization schema');
    assert.strictEqual(org['@id'], 'https://levelup-ecosystem.com/#org');
    assert.strictEqual(org.name, 'LevelUp Ecosystem');
    assert.strictEqual(org.url, 'https://levelup-ecosystem.com');
    assert.strictEqual(org.email, 'hello@levelup-ecosystem.com');
    assert.strictEqual(
      org.description,
      'LevelUp Ecosystem is a web design and development studio that builds fast, secure websites for local businesses, creators and portfolios.'
    );
    assert.deepStrictEqual(org.founder, { '@id': 'https://levelup-ecosystem.com/about/richelieu-bonte#person' });

    const app = schemas.find((s: any) => s['@type'] === 'SoftwareApplication');
    assert.ok(app, 'Must have SoftwareApplication schema for LevelStudio');
    assert.strictEqual(app['@id'], 'https://levelup-ecosystem.com/#levelstudio');
    assert.strictEqual(app.name, 'LevelStudio');
    assert.deepStrictEqual(app.isPartOf, { '@id': 'https://levelup-ecosystem.com/#org' });
    assert.deepStrictEqual(app.creator, { '@id': 'https://levelup-ecosystem.com/#org' });

    const faq = schemas.find((s: any) => s['@type'] === 'FAQPage');
    assert.ok(faq, 'Must have FAQPage schema');
    const q1 = faq.mainEntity.find((q: any) => q.name.includes('Who is Richelieu Bonte?'));
    assert.ok(q1, 'Must include FAQ Question: Who is Richelieu Bonte?');
    const q2 = faq.mainEntity.find((q: any) => q.name.includes('Who founded LevelUp Ecosystem?'));
    assert.ok(q2, 'Must include FAQ Question: Who founded LevelUp Ecosystem?');
    const q3 = faq.mainEntity.find((q: any) => q.name.includes('What is LevelStudio?'));
    assert.ok(q3, 'Must include FAQ Question: What is LevelStudio?');
  });

  it('Invar 3: Founder Page /about/richelieu-bonte Structured Data & Privacy Verification', () => {
    const html = fs.readFileSync(path.join(process.cwd(), 'about/richelieu-bonte/index.html'), 'utf-8');
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonLdMatch, 'Founder page must contain JSON-LD block');

    const schemas = JSON.parse(jsonLdMatch[1]);
    const profile = schemas.find((s: any) => s['@type'] === 'ProfilePage');
    assert.ok(profile, 'Must have ProfilePage schema');
    assert.strictEqual(profile.mainEntity['@type'], 'Person');
    assert.strictEqual(profile.mainEntity['@id'], 'https://levelup-ecosystem.com/about/richelieu-bonte#person');
    assert.strictEqual(profile.mainEntity.name, 'Richelieu Bonte');
    assert.strictEqual(profile.mainEntity.jobTitle, 'Founder');
    assert.deepStrictEqual(profile.mainEntity.worksFor, { '@id': 'https://levelup-ecosystem.com/#org' });
    assert.deepStrictEqual(profile.mainEntity.knowsAbout, ['Web design', 'Cybersecurity', 'AI-assisted development']);

    // Strict Founder Privacy: No phone, no private home address, no birth date, no school name
    assert.strictEqual(profile.mainEntity.birthDate, undefined);
    assert.strictEqual(profile.mainEntity.telephone, undefined);
    assert.strictEqual(profile.mainEntity.address, undefined);
    assert.strictEqual(profile.mainEntity.alumniOf, undefined);
    assert.strictEqual(profile.mainEntity.affiliation, undefined);
    assert.strictEqual(profile.mainEntity.aggregateRating, undefined);
  });

  it('Invar 4: Technology note transparency & forbidden promotional terms check', () => {
    const footerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/Footer.tsx'), 'utf-8');
    const processSrc = fs.readFileSync(path.join(process.cwd(), 'src/pages/Process.tsx'), 'utf-8');
    const securitySrc = fs.readFileSync(path.join(process.cwd(), 'src/pages/Security.tsx'), 'utf-8');

    const note = 'Domains and DNS are managed and protected through Cloudflare. Our AI previews use Google AI models. Websites are deployed on Vercel.';
    assert.ok(footerSrc.includes(note), 'Footer must contain technology note');
    assert.ok(processSrc.includes(note), 'Process must contain technology note');
    assert.ok(securitySrc.includes(note), 'Security must contain technology note');

    // Forbidden promotional words check in relation to infrastructure providers
    const checkNoPromotion = (src: string, file: string) => {
      assert.strictEqual(src.includes('Cloudflare partner'), false, `${file} must not claim Cloudflare partner`);
      assert.strictEqual(src.includes('Google partner'), false, `${file} must not claim Google partner`);
      assert.strictEqual(src.includes('Vercel partner'), false, `${file} must not claim Vercel partner`);
      assert.strictEqual(src.includes('certified by Google'), false, `${file} must not claim certified by Google`);
      assert.strictEqual(src.includes('endorsed by Google'), false, `${file} must not claim endorsed by Google`);
      assert.strictEqual(src.includes('official Google'), false, `${file} must not claim official Google`);
    };

    checkNoPromotion(footerSrc, 'Footer');
    checkNoPromotion(processSrc, 'Process');
    checkNoPromotion(securitySrc, 'Security');
  });

  it('Invar 5: Link placement from /about, footer, and homepage trust section', () => {
    const aboutSrc = fs.readFileSync(path.join(process.cwd(), 'src/pages/About.tsx'), 'utf-8');
    const footerSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/Footer.tsx'), 'utf-8');
    const homeSrc = fs.readFileSync(path.join(process.cwd(), 'src/pages/Home.tsx'), 'utf-8');

    assert.ok(aboutSrc.includes('/about/richelieu-bonte'), 'About page must link to founder page');
    assert.ok(footerSrc.includes('/about/richelieu-bonte'), 'Footer must link to founder page');
    assert.ok(footerSrc.includes("label: 'Richelieu Bonte'"), 'Footer must use anchor text Richelieu Bonte');
    assert.ok(homeSrc.includes('/about/richelieu-bonte'), 'Homepage trust section must link to founder page');
    assert.ok(homeSrc.includes('Richelieu Bonte'), 'Homepage trust section must mention Richelieu Bonte');
  });

  it('Invar 6: Sitemap and llms.txt integration', () => {
    const sitemapXml = fs.readFileSync(path.join(process.cwd(), 'public/sitemap.xml'), 'utf-8');
    const sitemapPage = fs.readFileSync(path.join(process.cwd(), 'src/pages/Sitemap.tsx'), 'utf-8');
    const llmsTxt = fs.readFileSync(path.join(process.cwd(), 'llms.txt'), 'utf-8');

    assert.ok(sitemapXml.includes('https://levelup-ecosystem.com/about/richelieu-bonte'), 'sitemap.xml must include founder page');
    assert.ok(sitemapPage.includes('/about/richelieu-bonte'), 'Sitemap.tsx must include founder page');
    assert.ok(llmsTxt.includes('/about/richelieu-bonte'), 'llms.txt must include founder page under key pages');
    assert.ok(llmsTxt.includes('Richelieu Bonte is the founder of LevelUp Ecosystem'), 'llms.txt must include founder one-liner');
    assert.ok(llmsTxt.includes('LevelStudio'), 'llms.txt must use LevelStudio');
  });
});
