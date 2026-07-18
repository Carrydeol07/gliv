/**
 * Live API Smoke Test — Module 03 Provider Manager
 * 
 * This script makes REAL requests to AniList, Jikan, and MangaUpdates
 * to verify that endpoint URLs, request shapes, and response parsing
 * all work against the actual live APIs.
 * 
 * Run with: npx tsx src/providers/__tests__/smoke-test.ts
 */

async function smokeTest() {
  const results: { test: string; status: string; details: string }[] = [];
  
  console.log('═══════════════════════════════════════════════');
  console.log('  GLIV Module 03 — Live API Smoke Test');
  console.log('═══════════════════════════════════════════════\n');

  // ─── 1. AniList GraphQL: Search Anime ─────────────────────
  try {
    console.log('1. AniList: Searching for "Naruto" (Anime)...');
    const anilistRes = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        query: `query ($search: String) {
          Page(page: 1, perPage: 5) {
            media(search: $search, type: ANIME) {
              id
              idMal
              title { romaji english native }
              description
              episodes
              status
              genres
              coverImage { large }
            }
          }
        }`,
        variables: { search: 'Naruto' }
      })
    });

    if (!anilistRes.ok) throw new Error(`HTTP ${anilistRes.status}`);
    const anilistData = await anilistRes.json() as any;
    const media = anilistData.data?.Page?.media;
    
    if (!media || media.length === 0) throw new Error('No results returned');
    
    const first = media[0];
    const checks = [
      ['id exists', !!first.id],
      ['title.romaji exists', !!first.title?.romaji],
      ['coverImage.large exists', !!first.coverImage?.large],
      ['genres is array', Array.isArray(first.genres)],
      ['status exists', !!first.status],
    ];
    
    const allPassed = checks.every(([, v]) => v);
    console.log(`   ✅ ${media.length} results. First: "${first.title.romaji}" (ID: ${first.id}, MAL: ${first.idMal})`);
    checks.forEach(([name, val]) => console.log(`      ${val ? '✓' : '✗'} ${name}`));
    results.push({ test: 'AniList Search', status: allPassed ? 'PASS' : 'PARTIAL', details: `${media.length} results, ${checks.filter(([,v]) => v).length}/${checks.length} field checks` });
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message}`);
    results.push({ test: 'AniList Search', status: 'FAIL', details: e.message });
  }

  console.log();

  // ─── 2. Jikan REST: Search Anime ──────────────────────────
  try {
    console.log('2. Jikan: Searching for "Naruto" (Anime)...');
    // Jikan has a strict rate limit, wait a moment
    await new Promise(r => setTimeout(r, 1000));
    
    const jikanRes = await fetch('https://api.jikan.moe/v4/anime?q=Naruto&limit=5', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!jikanRes.ok) throw new Error(`HTTP ${jikanRes.status}`);
    const jikanData = await jikanRes.json() as any;
    const data = jikanData.data;
    
    if (!data || data.length === 0) throw new Error('No results returned');
    
    const first = data[0];
    const checks = [
      ['mal_id exists', !!first.mal_id],
      ['title exists', !!first.title],
      ['images.jpg exists', !!first.images?.jpg],
      ['synopsis exists', typeof first.synopsis === 'string'],
      ['genres is array', Array.isArray(first.genres)],
    ];
    
    const allPassed = checks.every(([, v]) => v);
    console.log(`   ✅ ${data.length} results. First: "${first.title}" (MAL ID: ${first.mal_id})`);
    checks.forEach(([name, val]) => console.log(`      ${val ? '✓' : '✗'} ${name}`));
    results.push({ test: 'Jikan Search', status: allPassed ? 'PASS' : 'PARTIAL', details: `${data.length} results, ${checks.filter(([,v]) => v).length}/${checks.length} field checks` });
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message}`);
    results.push({ test: 'Jikan Search', status: 'FAIL', details: e.message });
  }

  console.log();

  // ─── 3. MangaUpdates REST: Search Manga ───────────────────
  try {
    console.log('3. MangaUpdates: Searching for "One Piece" (Manga)...');
    const muRes = await fetch('https://api.mangaupdates.com/v1/series/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ search: 'One Piece', perpage: 5 })
    });

    if (!muRes.ok) throw new Error(`HTTP ${muRes.status}`);
    const muData = await muRes.json() as any;
    const muResults = muData.results;
    
    if (!muResults || muResults.length === 0) throw new Error('No results returned');
    
    const first = muResults[0].record;
    const checks = [
      ['series_id exists', !!first.series_id],
      ['title exists', !!first.title],
      ['type exists', !!first.type],
      ['image exists', !!first.image],
      ['description exists', typeof first.description === 'string'],
    ];
    
    const allPassed = checks.every(([, v]) => v);
    console.log(`   ✅ ${muResults.length} results. First: "${first.title}" (ID: ${first.series_id})`);
    checks.forEach(([name, val]) => console.log(`      ${val ? '✓' : '✗'} ${name}`));
    results.push({ test: 'MangaUpdates Search', status: allPassed ? 'PASS' : 'PARTIAL', details: `${muResults.length} results, ${checks.filter(([,v]) => v).length}/${checks.length} field checks` });
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message}`);
    results.push({ test: 'MangaUpdates Search', status: 'FAIL', details: e.message });
  }

  console.log();

  // ─── 4. AniList: Get Metadata by ID ───────────────────────
  try {
    console.log('4. AniList: Getting metadata for Naruto (ID: 20)...');
    const metaRes = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        query: `query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            idMal
            title { romaji english native }
            description
            episodes
            status
            genres
            coverImage { large }
            characters(sort: FAVOURITES_DESC) {
              edges { node { name { full } } role }
            }
            studios {
              nodes { name isAnimationStudio }
            }
            trailer { id site }
          }
        }`,
        variables: { id: 20 }
      })
    });

    if (!metaRes.ok) throw new Error(`HTTP ${metaRes.status}`);
    const metaData = await metaRes.json() as any;
    const m = metaData.data?.Media;
    
    if (!m) throw new Error('No media returned');
    
    const checks = [
      ['id matches', m.id === 20],
      ['title.romaji exists', !!m.title?.romaji],
      ['characters edges exist', Array.isArray(m.characters?.edges)],
      ['studios nodes exist', Array.isArray(m.studios?.nodes)],
      ['genres is array', Array.isArray(m.genres)],
    ];
    
    const allPassed = checks.every(([, v]) => v);
    console.log(`   ✅ "${m.title.romaji}" — ${m.episodes} episodes, ${m.characters?.edges?.length} characters, ${m.studios?.nodes?.length} studios`);
    checks.forEach(([name, val]) => console.log(`      ${val ? '✓' : '✗'} ${name}`));
    results.push({ test: 'AniList Metadata', status: allPassed ? 'PASS' : 'PARTIAL', details: `${checks.filter(([,v]) => v).length}/${checks.length} field checks` });
  } catch (e: any) {
    console.log(`   ❌ FAILED: ${e.message}`);
    results.push({ test: 'AniList Metadata', status: 'FAIL', details: e.message });
  }

  console.log();

  // ─── SUMMARY ──────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════════════');
  
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const partial = results.filter(r => r.status === 'PARTIAL').length;
  
  results.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`  ${icon} ${r.test}: ${r.details}`);
  });
  
  console.log(`\n  Total: ${passed} passed, ${partial} partial, ${failed} failed out of ${results.length}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

smokeTest().catch(err => {
  console.error('Smoke test runner crashed:', err);
  process.exit(1);
});
