# Dashboard de Ventas - Sales Champions 🎰💰

Un dashboard interactivo para call centers que gamifica las ventas mostrando celebraciones animadas tipo "jackpot" cuando los agentes cierran nuevas ventas.

---

## 🎯 Objetivo

Aumentar la motivación y engagement de los agentes del call center mediante:

* ✅ Reconocimiento visual inmediato de logros de ventas
* ✅ Animaciones celebratorias con efecto casino/jackpot
* ✅ Visualización en tiempo real del rendimiento por equipos
* ✅ Ranking dinámico de agentes con iconos especiales

---

## 📁 Estructura del Proyecto (Actualizada)

```
src/
├── pages/
│   ├── Index.tsx              # Orquestador principal (simplificado)
│   └── NotFound.tsx           # Página 404
│
├── components/
│   ├── SpaceBackground.tsx    # Fondo animado con estrellas
│   ├── StartScreen.tsx        # Pantalla de inicio
│   ├── DashboardView.tsx      # Vista principal del dashboard
│   └── JackpotOverlay.tsx     # Celebración de nueva venta
│
├── hooks/
│   └── useGoogleSheetData.ts  # Hook principal (polling + detección)
│
├── config/
│   └── agents.config.ts       # Configuración centralizada (fotos, íconos, temas)
│
├── data/
│   └── mockData.ts            # Tipos TypeScript (Team, Agent)
│
└── integrations/
    └── supabase/
        └── functions/
            └── google-sheets-proxy/
                └── index.ts   # Edge Function (proxy a Google Sheets)
```

---

## 🔄 Flujo de Datos

```
Google Sheets 
    ↓
Google Apps Script (API JSON)
    ↓
Supabase Edge Function (Proxy)
    ↓
useGoogleSheetData Hook (Polling cada 10s)
    ↓
Index.tsx (Orquestador)
    ↓
DashboardView / JackpotOverlay
```

---

## 📊 Estructura de Google Sheets

### Hoja "Total" (Equipos y Agentes)

Los agentes están agrupados por rangos de filas:

| Equipo | Filas | Columnas            |
| ------ | ----- | ------------------- |
| Mesa 1 | 3-8   | B: Agente, E: Total |
| Mesa 2 | 10-16 | B: Agente, E: Total |
| Mesa 3 | 18-23 | B: Agente, E: Total |

 **Nota** : Si agregas más agentes o cambias las filas, debes actualizar el array `teamRanges` en el Apps Script.

### Hoja "Hoja 2" (Ventas Nuevas)

| Columna | Contenido                                       |
| ------- | ----------------------------------------------- |
| C       | Agente que realizó la venta                    |
| K       | Fecha de Entrada (cuando se finiquita la venta) |
| L       | Valor de la venta                               |

 **Importante** : La celebración se dispara cuando una fila en "Hoja 2" tiene valor en la columna K (Entrada).

---

## 🔧 Código de Google Apps Script

javascript

```javascript
functiondoGet(){
try{
var ss =SpreadsheetApp.getActiveSpreadsheet();
  
var sheetTotal = ss.getSheetByName("Total");
var dataTotal = sheetTotal.getDataRange().getValues();
  
var sheet2 = ss.getSheetByName("Hoja 2");
var data2 = sheet2.getDataRange().getValues();
  
var teams =processTeamsData(dataTotal);
var newSales =processNewSales(data2);
  
returnContentService
.createTextOutput(JSON.stringify({teams: teams,newSales: newSales }))
.setMimeType(ContentService.MimeType.JSON);
}catch(e){
returnContentService
.createTextOutput(JSON.stringify({error: e.toString()}))
.setMimeType(ContentService.MimeType.JSON);
}
}

functionprocessTeamsData(data){
var teamRanges =[
{name:"Mesa 1",startRow:3,endRow:8},
{name:"Mesa 2",startRow:10,endRow:16},
{name:"Mesa 3",startRow:18,endRow:23}
];
  
var teams =[];
  
for(var t =0; t < teamRanges.length; t++){
var teamConfig = teamRanges[t];
var team ={
id: teamConfig.name.toLowerCase().replace(/\s+/g,'-'),
name: teamConfig.name,
goal:50000,
agents:[]
};
  
for(var i = teamConfig.startRow-1; i < teamConfig.endRow&& i < data.length; i++){
var row = data[i];
var agentName = row[1];// Columna B
var sales =parseFloat(row[4])||0;// Columna E
  
if(agentName && agentName.toString().trim()!==''){
        team.agents.push({
id: agentName.toString().toLowerCase().replace(/\s+/g,'-')+'-'+ i,
name: agentName.toString().trim(),
avatar:"https://api.dicebear.com/7.x/avataaars/svg?seed="+encodeURIComponent(agentName),
sales: sales
});
}
}
  
if(team.agents.length>0){
      teams.push(team);
}
}
  
return teams;
}

functionprocessNewSales(data){
var sales =[];
  
for(var i =1; i < data.length; i++){
var row = data[i];
var agentName = row[2];// Columna C
var entryDate = row[10];// Columna K
var value =parseFloat(row[11])||0;// Columna L
  
if(agentName && entryDate && value >0){
      sales.push({
agentName: agentName.toString().trim(),
entryDate: entryDate.toString(),
value: value
});
}
}
  
return sales;
}
```

### Cómo desplegar el Apps Script:

1. Abre tu Google Sheet
2. Ve a **Extensiones → Apps Script**
3. Pega el código anterior
4. Guarda el proyecto
5. Click en **Implementar → Nueva implementación**
6. Selecciona tipo: **Aplicación web**
7. Configura:
   * Ejecutar como: **Yo**
   * Quién tiene acceso: **Cualquier persona**
8. Click en **Implementar**
9. Copia la URL generada

---

## ⚙️ Configuración

### Variables de Entorno

El proyecto usa Lovable Cloud (Supabase) con las siguientes variables configuradas automáticamente:

* `SUPABASE_URL`
* `SUPABASE_ANON_KEY`

### URL del Apps Script

La URL del Apps Script se configura en:

typescript

```typescript
// supabase/functions/google-sheets-proxy/index.ts

constAPPS_SCRIPT_URL="https://script.google.com/macros/s/TU_URL_AQUI/exec";
```

### Configuración de Fotos y Temas

Centralizada en `src/config/agents.config.ts`:

typescript

```typescript
exportconstAGENT_PHOTOS:Record<string,string>={
"Anny":"https://...",
// ... más agentes
};

exportconstTEAM_ICONS=[/* URLs de Firebase */];

exportconstTEAM_THEMES=[
{ bg:"bg-gradient-to-b from-fuchsia-500 to-purple-600",...},
// ... más temas
];
```

---

## 🎨 Tema Visual

El dashboard usa un tema de **tesoro/casino espacial** con:

* **Colores primarios** : Dorados, morados, cyan, naranja
* **Fondo** : Espacio con estrellas y nebulosas
* **Tipografía** : Bebas Neue para títulos
* **Efectos** : Brillos, partículas, fuegos artificiales, rayos de sol

---

## 🚀 Características

* ✅ Actualización automática cada 10 segundos
* ✅ Detección de nuevas ventas finiquitadas
* ✅ Celebración animada tipo jackpot con foto del agente
* ✅ Partículas de monedas y fuegos artificiales
* ✅ Efectos de sonido (coin sounds)
* ✅ Ranking dinámico con iconos especiales (🥇🥈🥉)
* ✅ Diseño responsive
* ✅ Avatares personalizados por agente

---

## 📝 Notas Importantes

1. **Polling vs Realtime** : El sistema usa polling cada 10 segundos. Para actualizaciones más rápidas, reduce el intervalo en `useGoogleSheetData(10000)`.
2. **Identificación de ventas** : Las ventas se identifican por combinación `agentName + entryDate + value` para evitar duplicados.
3. **Carga inicial** : La primera carga no dispara celebraciones para evitar múltiples animaciones al abrir el dashboard.
4. **Nombres de agentes** : Deben coincidir exactamente entre la hoja "Total" y "Hoja 2" (se ignoran mayúsculas/minúsculas y espacios extra).
5. **Archivos simplificados** : El proyecto ahora usa componentes modulares:

* `Index.tsx` es solo un orquestador (80 líneas)
* La lógica visual está separada en componentes reutilizables
* La configuración está centralizada en `agents.config.ts`

---

## 🛠️ Tecnologías

* **Frontend** : React 18, TypeScript, Vite
* **Estilos** : Tailwind CSS, Custom CSS Animations
* **Animaciones** : Framer Motion
* **Backend** : Supabase Edge Functions (Deno)
* **Datos** : Google Sheets + Google Apps Script
* **UI Components** : Lucide Icons

---

## 📞 Soporte

### Para modificar columnas o estructura del Excel:

1. Actualiza el código del Apps Script (funciones `processTeamsData` y `processNewSales`)
2. Vuelve a desplegar el Apps Script como nueva implementación

### Para agregar nuevos agentes:

1. Agrega la foto en Firebase Storage
2. Actualiza `AGENT_PHOTOS` en `src/config/agents.config.ts`
3. Actualiza el Excel con el nombre exacto del agente

### Para agregar nuevos equipos:

1. Actualiza `teamRanges` en el Apps Script
2. Agrega un nuevo ícono en `TEAM_ICONS` en `agents.config.ts`
3. Opcionalmente agrega un nuevo tema en `TEAM_THEMES`

---

## 🎯 Roadmap

* [ ] Persistencia de datos con localStorage/sessionStorage
* [ ] Gráficos de rendimiento histórico
* [ ] Notificaciones push
* [ ] Modo administrador con configuración dinámica
* [ ] Soporte multi-idioma
* [ ] Exportar reportes en PDF

---

## 👥 Créditos

Desarrollado con ❤️ para optimizar la motivación de equipos de ventas.

 **Versión** : 2.0 (Refactorizada - Diciembre 2025)
