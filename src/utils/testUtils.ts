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

// Hacer las funciones disponibles globalmente
if (typeof window !== 'undefined') {
  (window as any).simulateSale = simulateSale;
  (window as any).clearTestSales = clearTestSales;
  (window as any).listTestSales = listTestSales;
  console.log('💡 Funciones de testeo cargadas:');
  console.log('   - window.simulateSale("Nombre Agente", monto)');
  console.log('   - window.clearTestSales()');
  console.log('   - window.listTestSales()');
}
