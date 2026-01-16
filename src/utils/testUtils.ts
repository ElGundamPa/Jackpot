/**
 * Utilidades para testing de ventas desde la consola del navegador
 * 
 * Uso en consola del navegador:
 * window.simulateSale("Daniel Salazar", 5000)
 */

interface TestSale {
  agentName: string;
  amount: number;
  timestamp: number;
}

// Función global para simular ventas desde la consola
export const simulateSale = (agentName: string, amount: number) => {
  const sale: TestSale = {
    agentName: agentName.trim(),
    amount,
    timestamp: Date.now(),
  };

  console.log(`🎬 Simulando venta:`);
  console.log(`   Agente: ${sale.agentName}`);
  console.log(`   Monto: $${sale.amount.toLocaleString()}`);
  console.log(`   Duración de animación: 28 segundos de disfrute visual épico`);
  
  // Guardar en localStorage para que el hook lo detecte
  const testSalesKey = 'test_sales';
  const existingSales = JSON.parse(localStorage.getItem(testSalesKey) || '[]');
  existingSales.push(sale);
  localStorage.setItem(testSalesKey, JSON.stringify(existingSales));

  // Disparar evento personalizado para notificar al hook y forzar refetch inmediato
  const event = new CustomEvent('testSale', { detail: sale });
  window.dispatchEvent(event);

  console.log(`✅ Venta simulada y agregada`);
  console.log(`💡 Forzando actualización inmediata...`);
  console.log(`📝 La venta está en localStorage y se procesará en el siguiente fetch`);
  console.log(`   Si no ves la animación, espera unos segundos o ejecuta: window.refetch()`);
  
  return sale;
};

// Función para limpiar todas las ventas de prueba
export const clearTestSales = () => {
  localStorage.removeItem('test_sales');
  console.log('🗑️ Ventas de prueba eliminadas');
  // Disparar evento para forzar refetch
  window.dispatchEvent(new CustomEvent('clearTestSales'));
};

// Función para ver todas las ventas de prueba guardadas
export const listTestSales = () => {
  const testSales = JSON.parse(localStorage.getItem('test_sales') || '[]');
  console.log('📋 Ventas de prueba guardadas:', testSales);
  return testSales;
};

// Función para testear la animación del total global
export const testTotalGlobalAnimation = (increment: number = 1000, autoActivate: boolean = true) => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 TEST DE ANIMACIÓN DEL TOTAL GLOBAL');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`📊 Configuración del Test:`);
  console.log(`   Incremento: $${increment.toLocaleString()}`);
  console.log(`   Duración de celebración (jackpot): 12 segundos`);
  console.log(`   Duración de animación del total: 28 segundos`);
  console.log(`   Sonido: "subida de numero.mp3" (1.33s, volumen 60%)`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📋 FLUJO COMPLETO DE LA ANIMACIÓN');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('1️⃣  CELEBRACIÓN DEL JACKPOT (12 segundos):');
  console.log('   ✓ Aparece la pantalla de celebración con la persona que depositó');
  console.log('   ✓ Se reproduce la canción del agente');
  console.log('   ✓ Duración: 12 segundos');
  console.log('');
  console.log('2️⃣  ANIMACIÓN DEL TOTAL GLOBAL (28 segundos):');
  console.log('   ✓ Después de que termina el jackpot, el TOTAL GLOBAL empieza a subir');
  console.log('   ✓ El número sube desde la cantidad actual hasta la cantidad final');
  console.log('   ✓ Duración: 28 segundos');
  console.log('');
  console.log('3️⃣  AUDIO "subida de numero.mp3":');
  console.log('   ✓ Se reproduce cuando EMPIEZA la animación del total global');
  console.log('   ✓ Volumen: 60%');
  console.log('   ✓ Duración del audio: 1.33 segundos');
  console.log('   ✓ Se repite en loop cada 1.33 segundos durante los 28 segundos');
  console.log('   ✓ Total de repeticiones esperadas: ~21 veces');
  console.log('   ✓ Se detiene cuando termina la animación del total');
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ VERIFICACIONES A REALIZAR');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('🎬 Celebración del Jackpot:');
  console.log('   ✓ Debe aparecer inmediatamente al detectar el depósito');
  console.log('   ✓ Debe mostrar la foto y nombre del agente');
  console.log('   ✓ Debe reproducir la canción del agente');
  console.log('   ✓ Debe durar exactamente 12 segundos');
  console.log('');
  console.log('📈 Animación del Total Global:');
  console.log('   ✓ Debe empezar DESPUÉS de que termine el jackpot');
  console.log('   ✓ El número debe subir desde el valor actual al nuevo valor');
  console.log('   ✓ Debe durar exactamente 28 segundos');
  console.log('   ✓ Debe tener efectos visuales: brillo, pulso, cambio de color');
  console.log('');
  console.log('🔊 Audio "subida de numero.mp3":');
  console.log('   ✓ Debe empezar cuando INICIA la animación del total global');
  console.log('   ✓ NO debe sonar durante el jackpot');
  console.log('   ✓ Volumen: 60% (no muy fuerte)');
  console.log('   ✓ Debe repetirse cada 1.33 segundos');
  console.log('   ✓ Debe detenerse cuando termine la animación (28s)');
  console.log('   ✓ Total de repeticiones: aproximadamente 21 veces');
  console.log('');
  
  // Si autoActivate es true, automáticamente simular una venta para activar la animación
  if (autoActivate) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 ACTIVANDO TEST AUTOMÁTICAMENTE...');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log(`   Simulando venta para "Daniel Salazar" con monto $${increment.toLocaleString()}`);
    console.log('');
    console.log('   ⏱️  Observa el siguiente flujo:');
    console.log('   1. Aparecerá la celebración del jackpot (12 segundos)');
    console.log('   2. Luego el TOTAL GLOBAL empezará a subir (28 segundos)');
    console.log('   3. El audio "subida de numero" sonará durante la animación del total');
    console.log('');
    
    // Usar un agente por defecto que sabemos que existe
    const defaultAgent = "Daniel Salazar";
    simulateSale(defaultAgent, increment);
    
    console.log('✅ Test activado! Observa el flujo completo ahora.');
    console.log('');
  } else {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('💡 PARA ACTIVAR EL TEST MANUALMENTE:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log(`   window.simulateSale("Daniel Salazar", ${increment})`);
    console.log(`   O ejecuta: window.activateTotalGlobalTest(${increment})`);
    console.log('');
  }
  
  return {
    increment,
    jackpotDuration: 12,
    animationDuration: 28,
    audioDuration: 1.33,
    audioVolume: 0.6,
    expectedRepetitions: Math.ceil(28 / 1.33),
    activated: autoActivate
  };
};

// Función para activar directamente la animación del total global
export const activateTotalGlobalTest = (increment: number = 1000) => {
  console.log(`🚀 Activando test del Total Global con incremento de $${increment.toLocaleString()}`);
  return testTotalGlobalAnimation(increment, true);
};

// Función específica para testear SOLO la animación del total global (sin jackpot)
// Útil para verificar que el audio funciona correctamente
export const testTotalGlobalOnly = (increment: number = 1000) => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 TEST SOLO DE ANIMACIÓN DEL TOTAL GLOBAL');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('⚠️  NOTA: Esta función simula un cambio directo en el total');
  console.log('   para probar la animación SIN la celebración del jackpot.');
  console.log('');
  console.log('📊 Configuración:');
  console.log(`   Incremento: $${increment.toLocaleString()}`);
  console.log(`   Duración de animación: 28 segundos`);
  console.log(`   Audio: "subida de numero.mp3" (1.33s, volumen 60%)`);
  console.log('');
  console.log('✅ Lo que deberías ver:');
  console.log('   1. El número del TOTAL GLOBAL empezará a subir inmediatamente');
  console.log('   2. El audio "subida de numero" se reproducirá en loop');
  console.log('   3. La animación durará 28 segundos');
  console.log('   4. El audio se detendrá cuando termine la animación');
  console.log('');
  console.log('🚀 Activando test...');
  
  // Simular una venta para activar el cambio en el total
  const defaultAgent = "Daniel Salazar";
  simulateSale(defaultAgent, increment);
  
  console.log('✅ Test activado! Observa el TOTAL GLOBAL ahora.');
  console.log('');
  
  return {
    increment,
    animationDuration: 28,
    audioDuration: 1.33,
    audioVolume: 0.6,
    expectedRepetitions: Math.ceil(28 / 1.33)
  };
};

// Hacer las funciones disponibles globalmente
if (typeof window !== 'undefined') {
  (window as any).simulateSale = simulateSale;
  (window as any).clearTestSales = clearTestSales;
  (window as any).listTestSales = listTestSales;
  (window as any).testTotalGlobalAnimation = testTotalGlobalAnimation;
  (window as any).activateTotalGlobalTest = activateTotalGlobalTest;
  (window as any).testTotalGlobalOnly = testTotalGlobalOnly;
  console.log('💡 Funciones de testeo cargadas:');
  console.log('   - window.simulateSale("Nombre Agente", monto)');
  console.log('   - window.clearTestSales()');
  console.log('   - window.listTestSales()');
  console.log('   - window.testTotalGlobalAnimation(incremento, autoActivate?) - Test completo (jackpot + total global)');
  console.log('   - window.activateTotalGlobalTest(incremento) - Activa test completo');
  console.log('   - window.testTotalGlobalOnly(incremento) - NUEVO: Test solo del total global (sin jackpot)');
}
