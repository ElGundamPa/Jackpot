/**
 * Script para testear la animación del Total Global
 * Uso: npm run test:total-global [incremento]
 * Ejemplo: npm run test:total-global 5000
 * 
 * Este script proporciona instrucciones para testear la animación
 * del total global y su sonido asociado
 */

const args = process.argv.slice(2);
const increment = args.length > 0 ? parseFloat(args[0]) : 1000;

if (isNaN(increment) || increment <= 0) {
  console.log('❌ Error: El incremento debe ser un número positivo');
  console.log('');
  console.log('📖 Uso: npm run test:total-global [incremento]');
  console.log('📖 Ejemplo: npm run test:total-global 5000');
  process.exit(1);
}

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('🧪 TEST DE ANIMACIÓN DEL TOTAL GLOBAL');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('📊 Configuración del Test:');
console.log(`   Incremento: $${increment.toLocaleString()}`);
console.log(`   Duración de animación: 28 segundos`);
console.log(`   Sonido: "subida de numero.mp3"`);
console.log(`   Duración del audio: 1.33 segundos (1 segundo y 33 centésimas)`);
console.log(`   Volumen del audio: 60%`);
console.log(`   Repeticiones esperadas: ${Math.ceil(28 / 1.33)} veces`);
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('📋 INSTRUCCIONES PARA EJECUTAR EL TEST');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('1️⃣  Abre la aplicación en el navegador');
console.log('');
console.log('2️⃣  Abre la consola del navegador (F12 → pestaña Console)');
console.log('');
console.log('3️⃣  Ejecuta el test de animación:');
console.log(`    window.testTotalGlobalAnimation(${increment})`);
console.log('');
console.log('4️⃣  Para activar la animación, simula una venta:');
console.log(`    window.simulateSale("Daniel Salazar", ${increment})`);
console.log('    (Puedes usar cualquier agente válido)');
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('✅ VERIFICACIONES A REALIZAR');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('🎬 Animación Visual:');
console.log('   ✓ El número del "TOTAL GLOBAL" debe empezar a subir inmediatamente');
console.log('   ✓ La animación debe durar exactamente 28 segundos');
console.log('   ✓ Debe haber efectos visuales: brillo, pulso, cambio de color');
console.log('   ✓ El número debe llegar exactamente al valor final');
console.log('');
console.log('🔊 Sonido:');
console.log('   ✓ El sonido debe empezar cuando inicia la animación');
console.log('   ✓ El volumen debe ser al 60% (no muy fuerte)');
console.log('   ✓ El audio debe repetirse cada 1.33 segundos');
console.log('   ✓ El sonido debe detenerse cuando termine la animación (28s)');
console.log('   ✓ Total de repeticiones: aproximadamente 21 veces');
console.log('');
console.log('⏱️  Sincronización:');
console.log('   ✓ El sonido debe estar sincronizado con la animación');
console.log('   ✓ El sonido debe detenerse exactamente cuando termina la animación');
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('💡 COMANDOS ÚTILES');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('Ver información del test:');
console.log(`   window.testTotalGlobalAnimation(${increment})`);
console.log('');
console.log('Simular venta (activa la animación):');
console.log(`   window.simulateSale("Daniel Salazar", ${increment})`);
console.log('');
console.log('Ver ventas de prueba:');
console.log('   window.listTestSales()');
console.log('');
console.log('Limpiar ventas de prueba:');
console.log('   window.clearTestSales()');
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('🎯 EJEMPLOS DE PRUEBA');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('Prueba con incremento pequeño:');
console.log('   window.simulateSale("Isaac Fernandez", 500)');
console.log('');
console.log('Prueba con incremento mediano:');
console.log(`   window.simulateSale("Samanta Rous", ${increment})`);
console.log('');
console.log('Prueba con incremento grande:');
console.log('   window.simulateSale("Juan de Dios", 10000)');
console.log('');
console.log('═══════════════════════════════════════════════════════════');
