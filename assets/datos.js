/* =========================================================
   DATOS DE LA WEB — aquí se agregan temas nuevos.
   Para sumar una lección: crea su archivo .html y añade
   una entrada en TEMAS con estado:'lista'.
   ========================================================= */

window.SITE = {
  nombre: 'El cuaderno de Stacy',
  apodo: 'Chucky',            // el saludo del inicio
  whatsapp: ''                // tu número con código de país, ej. '51987654321'. Vacío = elegir contacto al enviar
};

window.MATERIAS = [
  { id:'matematica', nombre:'Matemática', desc:'Funciones, y después límites y derivadas.', url:'matematica/index.html', activa:true },
  { id:'fisica',     nombre:'Física',     desc:'Movimiento, fuerzas y energía.',            url:'',  activa:false },
  { id:'quimica',    nombre:'Química',    desc:'Átomos, tabla periódica y reacciones.',     url:'',  activa:false }
];

/* paso = fila del mapa (se lee de arriba hacia abajo).
   antes = temas que conviene ver primero. */
window.TEMAS = [
  { id:'plano',        materia:'matematica', bloque:'Funciones', paso:0, titulo:'Plano cartesiano',          resumen:'Pares ordenados y cómo ubicar puntos.', antes:[], estado:'pronto' },
  { id:'intervalos',   materia:'matematica', bloque:'Funciones', paso:0, titulo:'Conjuntos e intervalos',    resumen:'Cómo escribir “todos los números entre 2 y 5”.', antes:[], estado:'pronto' },
  { id:'funcion',      materia:'matematica', bloque:'Funciones', paso:1, titulo:'¿Qué es una función?',      resumen:'La máquina que convierte un número en otro.', antes:['plano','intervalos'], estado:'lista', url:'matematica/funciones/1-que-es-una-funcion.html', fecha:'2026-11-10' },
  { id:'dominio',      materia:'matematica', bloque:'Funciones', paso:2, titulo:'Dominio y rango',           resumen:'Qué números pueden entrar y cuáles pueden salir.', antes:['funcion'], estado:'lista', url:'matematica/funciones/2-dominio-y-rango.html', fecha:'2026-11-10' },
  { id:'clasificacion',materia:'matematica', bloque:'Funciones', paso:3, titulo:'Algebraicas y trascendentes', resumen:'El árbol de familias de funciones.', antes:['dominio'], estado:'lista', url:'matematica/funciones/3-clasificacion.html', fecha:'2026-11-10' },
  { id:'polinomicas',  materia:'matematica', bloque:'Funciones', paso:4, titulo:'Funciones polinómicas',     resumen:'Constante, lineal, cuadrática y cúbica.', antes:['clasificacion'], estado:'lista', url:'matematica/funciones/4-polinomicas.html', fecha:'2026-11-10' },
  { id:'racionales',   materia:'matematica', bloque:'Funciones', paso:4, titulo:'Racionales e irracionales', resumen:'Fracciones y raíces con x.', antes:['clasificacion'], estado:'pronto' },
  { id:'trascendentes',materia:'matematica', bloque:'Funciones', paso:4, titulo:'Funciones trascendentes',   resumen:'Exponencial, logarítmica y trigonométricas.', antes:['clasificacion'], estado:'lista', url:'matematica/funciones/5-trascendentes.html', fecha:'2026-11-10' },
  { id:'operaciones',  materia:'matematica', bloque:'Funciones', paso:5, titulo:'Composición e inversa',     resumen:'Juntar máquinas y darles la vuelta.', antes:['polinomicas','trascendentes'], estado:'pronto' },
  { id:'limites',      materia:'matematica', bloque:'Funciones', paso:6, titulo:'Límites',                   resumen:'A qué valor se acerca una función.', antes:['operaciones'], estado:'pronto' },
  { id:'derivadas',    materia:'matematica', bloque:'Funciones', paso:7, titulo:'Derivadas',                 resumen:'La pendiente en cada punto: qué tan rápido cambia.', antes:['limites'], estado:'pronto' }
];

/* Ejemplos de uso: los que tienen "panel" se abren en la misma página. */
window.EJEMPLOS = [
  { panel:'funcion',     titulo:'De °C a °F',            tema:'funcion' },
  { panel:'dominio',     titulo:'La batería del celular', tema:'dominio' },
  { panel:'lineal',      titulo:'El precio de un taxi',   tema:'polinomicas' },
  { panel:'cuadratica',  titulo:'El camino de un balón',  tema:'polinomicas' },
  { panel:'cubica',      titulo:'La caja más grande',     tema:'polinomicas' },
  { panel:'exponencial', titulo:'Un chisme en WhatsApp',  tema:'trascendentes' },
  { panel:'log',         titulo:'La fuerza de un sismo',  tema:'trascendentes' },
  { panel:'seno',        titulo:'El sonido de una nota',  tema:'trascendentes' },
  { url:'ejemplos/vidrio-liquido.html', titulo:'El vidrio líquido de los celulares', desc:'Geometría y óptica en la pantalla.', tema:'funcion' }
];

window.EXAMENES = [
  { id:'funciones-1', titulo:'Funciones · Examen 1', desc:'Función, dominio y rango, clasificación. 8 preguntas.', url:'examenes/funciones-1.html' }
];
