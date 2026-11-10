/**
 * GTM Verification Script
 * Pega este código en la consola del navegador para verificar GTM
 */

(function() {
  console.log('%c🔍 GTM Verification Script', 'color: #4285f4; font-size: 16px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4285f4;');

  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // Test 1: Verificar window.dataLayer
  console.log('\n%c✓ Test 1: window.dataLayer existe', 'color: #0f9d58; font-weight: bold;');
  if (typeof window.dataLayer !== 'undefined') {
    results.passed.push('dataLayer existe');
    console.log('  ✓ window.dataLayer está definido');
    console.log('  ℹ️ Eventos en dataLayer:', window.dataLayer.length);
  } else {
    results.failed.push('dataLayer NO existe');
    console.error('  ✗ window.dataLayer NO está definido');
  }

  // Test 2: Verificar eventos page_view
  console.log('\n%c✓ Test 2: Eventos page_view', 'color: #0f9d58; font-weight: bold;');
  const pageViews = window.dataLayer ? window.dataLayer.filter(e => e.event === 'page_view') : [];
  if (pageViews.length > 0) {
    results.passed.push(`${pageViews.length} evento(s) page_view`);
    console.log(`  ✓ Se encontraron ${pageViews.length} evento(s) page_view`);
    console.log('  📊 Eventos page_view:', pageViews);
  } else {
    results.warnings.push('No hay eventos page_view');
    console.warn('  ⚠️ No se encontraron eventos page_view');
    console.warn('  ℹ️ Navega a otra página para generar eventos');
  }

  // Test 3: Verificar GTM snippet
  console.log('\n%c✓ Test 3: GTM Script cargado', 'color: #0f9d58; font-weight: bold;');
  const gtmScripts = Array.from(document.querySelectorAll('script')).filter(
    s => s.src && s.src.includes('googletagmanager.com/gtm.js')
  );
  if (gtmScripts.length > 0) {
    results.passed.push('GTM script cargado');
    console.log('  ✓ Script de GTM encontrado');
    console.log('  📍 URL:', gtmScripts[0].src);
  } else {
    results.failed.push('GTM script NO encontrado');
    console.error('  ✗ Script de GTM NO encontrado');
  }

  // Test 4: Verificar GTM Container ID
  console.log('\n%c✓ Test 4: Container ID', 'color: #0f9d58; font-weight: bold;');
  const hasCorrectContainer = gtmScripts.some(s => s.src.includes('GTM-5JLMXZPT'));
  if (hasCorrectContainer) {
    results.passed.push('Container ID correcto (GTM-5JLMXZPT)');
    console.log('  ✓ Container ID: GTM-5JLMXZPT');
  } else {
    results.failed.push('Container ID incorrecto');
    console.error('  ✗ Container ID no encontrado o incorrecto');
  }

  // Test 5: Verificar noscript iframe
  console.log('\n%c✓ Test 5: Noscript iframe', 'color: #0f9d58; font-weight: bold;');
  const gtmIframes = Array.from(document.querySelectorAll('iframe')).filter(
    iframe => iframe.src && iframe.src.includes('googletagmanager.com/ns.html')
  );
  if (gtmIframes.length > 0) {
    results.passed.push('Noscript iframe presente');
    console.log('  ✓ GTM noscript iframe encontrado');
  } else {
    results.warnings.push('Noscript iframe no visible (normal con JS habilitado)');
    console.warn('  ⚠️ GTM noscript iframe no visible (esto es normal con JavaScript habilitado)');
  }

  // Test 6: Verificar estructura de eventos page_view
  console.log('\n%c✓ Test 6: Estructura de eventos', 'color: #0f9d58; font-weight: bold;');
  if (pageViews.length > 0) {
    const lastPageView = pageViews[pageViews.length - 1];
    const hasRequiredFields = lastPageView.page_path && lastPageView.page_location && lastPageView.page_title;

    if (hasRequiredFields) {
      results.passed.push('Eventos page_view con estructura correcta');
      console.log('  ✓ Último evento page_view:');
      console.log('    - page_path:', lastPageView.page_path);
      console.log('    - page_location:', lastPageView.page_location);
      console.log('    - page_title:', lastPageView.page_title);
    } else {
      results.failed.push('Eventos page_view con estructura incorrecta');
      console.error('  ✗ Faltan campos en evento page_view');
      console.error('    Evento:', lastPageView);
    }
  }

  // Test 7: Verificar CSP (intentar detectar errores)
  console.log('\n%c✓ Test 7: Content Security Policy', 'color: #0f9d58; font-weight: bold;');
  console.log('  ℹ️ Revisa la consola para errores CSP');
  console.log('  ℹ️ No debe haber errores como "Refused to load..." relacionados con GTM');

  // Resumen
  console.log('\n%c📊 RESUMEN', 'color: #4285f4; font-size: 14px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4285f4;');

  console.log(`\n%c✓ PASADOS: ${results.passed.length}`, 'color: #0f9d58; font-weight: bold;');
  results.passed.forEach(item => console.log(`  ✓ ${item}`));

  if (results.warnings.length > 0) {
    console.log(`\n%c⚠️  ADVERTENCIAS: ${results.warnings.length}`, 'color: #f4b400; font-weight: bold;');
    results.warnings.forEach(item => console.warn(`  ⚠️ ${item}`));
  }

  if (results.failed.length > 0) {
    console.log(`\n%c✗ FALLIDOS: ${results.failed.length}`, 'color: #db4437; font-weight: bold;');
    results.failed.forEach(item => console.error(`  ✗ ${item}`));
  }

  // Status final
  console.log('\n%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #4285f4;');
  if (results.failed.length === 0) {
    console.log('%c✅ GTM ESTÁ FUNCIONANDO CORRECTAMENTE', 'color: #0f9d58; font-size: 14px; font-weight: bold;');
  } else {
    console.log('%c❌ GTM TIENE PROBLEMAS', 'color: #db4437; font-size: 14px; font-weight: bold;');
    console.log('%cRevisa los errores arriba', 'color: #db4437;');
  }
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'color: #4285f4;');

  // Tips
  console.log('%c💡 TIPS:', 'color: #4285f4; font-weight: bold;');
  console.log('  1. Para ver todos los eventos: window.dataLayer');
  console.log('  2. Para ver solo page_view: window.dataLayer.filter(e => e.event === "page_view")');
  console.log('  3. Navega a otra página y vuelve a ejecutar este script');
  console.log('  4. Usa Tag Assistant para más detalles: https://tagassistant.google.com/');
  console.log('  5. Activa Preview Mode en GTM para debug avanzado\n');

  return {
    passed: results.passed.length,
    warnings: results.warnings.length,
    failed: results.failed.length,
    dataLayer: window.dataLayer,
    pageViews: pageViews
  };
})();
