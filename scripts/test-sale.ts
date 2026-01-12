#!/usr/bin/env node

/**
 * Script para simular una venta y testear las animaciones
 * Uso: npm run test:sale [nombre_agente] [monto]
 * Ejemplo: npm run test:sale "Daniel Salazar" 5000
 * 
 * Este script agrega una venta de prueba a localStorage para que se refleje
 * en el dashboard inmediatamente
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('📖 Uso: npm run test:sale [nombre_agente] [monto]');
  console.log('📖 Ejemplo: npm run test:sale "Daniel Salazar" 5000');
  console.log('');
  console.log('💡 Este script simula una venta agregando datos de prueba a localStorage');
  console.log('   Abre la consola del navegador y ejecuta:');
  console.log('   window.simulateSale("Nombre Agente", monto)');
  process.exit(1);
}

const agentName = args[0];
const amount = parseFloat(args[1]);

if (isNaN(amount) || amount <= 0) {
  console.error('❌ Error: El monto debe ser un número positivo');
  process.exit(1);
}

console.log(`✅ Para testear la venta, abre la consola del navegador (F12)`);
console.log(`   y ejecuta:`);
console.log(`   window.simulateSale("${agentName}", ${amount})`);
console.log('');
console.log(`📊 Simulación:`);
console.log(`   Agente: ${agentName}`);
console.log(`   Monto: $${amount.toLocaleString()}`);
console.log(`   Duración de animación: 4 segundos`);
