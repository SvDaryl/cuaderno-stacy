/* =========================================================
   DATOS DE LA WEB — aquí se agregan temas nuevos.
   Para sumar una lección: crea su archivo .html y cambia su
   entrada en TEMAS a estado:'lista' con url y fecha.
   El mapa de cada materia, la barra lateral y el inicio se arman solos.
   Temarios tomados del examen de admisión UNI 2018-1 (11 nov 2026).
   ========================================================= */

window.SITE = {
  nombre: 'El cuaderno de Stacy',
  apodo: 'Chucky',            // el saludo del inicio
  whatsapp: ''                // tu número con código de país, ej. '51987654321'. Vacío = elegir contacto al enviar
};

window.MATERIAS = [
  { id:'matematica', nombre:'Matemática', desc:'Aritmética, álgebra, funciones hasta derivadas, geometría y trigonometría.', url:'matematica/index.html', activa:true },
  { id:'fisica',     nombre:'Física',     desc:'De las unidades y los vectores hasta la electricidad y la óptica.',         url:'fisica/index.html',     activa:true },
  { id:'quimica',    nombre:'Química',    desc:'Átomo, enlace, cálculos químicos, soluciones y química orgánica.',         url:'quimica/index.html',    activa:true }
];

/* Cada tema: id único · materia · bloque (grupo del mapa) · paso (fila dentro del bloque)
   · titulo · resumen · antes (temas que conviene ver primero) · estado 'lista' | 'pronto'
   · url y fecha cuando está lista. El orden de esta lista es el orden de anterior/siguiente. */
window.TEMAS = [
  /* ===================== MATEMÁTICA ===================== */
  /* --- Aritmética --- */
  { id:'reales',       materia:'matematica', bloque:'Aritmética', paso:1, titulo:'Números reales e irracionales', resumen:'Naturales, enteros, racionales e irracionales: dónde vive cada número.', antes:[], estado:'pronto' },
  { id:'potencias',    materia:'matematica', bloque:'Aritmética', paso:1, titulo:'Potencias y raíces',         resumen:'Leyes de exponentes y cómo sacar una raíz cuadrada.', antes:[], estado:'pronto' },
  { id:'divisibilidad',materia:'matematica', bloque:'Aritmética', paso:2, titulo:'Divisibilidad y paridad',    resumen:'Cuándo un número divide a otro, pares e impares.', antes:['reales'], estado:'pronto' },
  { id:'primos',       materia:'matematica', bloque:'Aritmética', paso:3, titulo:'Divisores y números primos', resumen:'Descomposición en primos y cuántos divisores tiene un número.', antes:['divisibilidad'], estado:'pronto' },
  { id:'bases',        materia:'matematica', bloque:'Aritmética', paso:3, titulo:'Numeración en otras bases',  resumen:'Escribir números en base 2, 5 o 12, y volver a base 10.', antes:['potencias'], estado:'pronto' },
  { id:'mezclas',      materia:'matematica', bloque:'Aritmética', paso:3, titulo:'Promedios y mezclas',        resumen:'Precio medio de una mezcla y promedio ponderado.', antes:['reales'], estado:'pronto' },
  { id:'conteo',       materia:'matematica', bloque:'Aritmética', paso:4, titulo:'Conteo y combinaciones',     resumen:'Principio de multiplicación, permutaciones y combinaciones.', antes:['potencias'], estado:'pronto' },
  { id:'probabilidad', materia:'matematica', bloque:'Aritmética', paso:5, titulo:'Probabilidad',               resumen:'Casos favorables entre casos posibles, y "al menos uno".', antes:['conteo'], estado:'pronto' },
  /* --- Lógica --- */
  { id:'proposiciones',materia:'matematica', bloque:'Lógica',     paso:1, titulo:'Proposiciones y conectores', resumen:'Y, o, si… entonces, si y solo si: tablas de verdad.', antes:[], estado:'pronto' },
  { id:'cuantificadores',materia:'matematica',bloque:'Lógica',    paso:2, titulo:'Cuantificadores y negación', resumen:'"Todos", "algunos" y cómo negarlos bien.', antes:['proposiciones'], estado:'pronto' },
  /* --- Funciones (camino a derivadas) --- */
  { id:'plano',        materia:'matematica', bloque:'Funciones', paso:0, titulo:'Plano cartesiano',          resumen:'Pares ordenados y cómo ubicar puntos.', antes:[], estado:'pronto' },
  { id:'intervalos',   materia:'matematica', bloque:'Funciones', paso:0, titulo:'Conjuntos e intervalos',    resumen:'Cómo escribir “todos los números entre 2 y 5”.', antes:['reales'], estado:'pronto' },
  { id:'funcion',      materia:'matematica', bloque:'Funciones', paso:1, titulo:'¿Qué es una función?',      resumen:'La máquina que convierte un número en otro.', antes:['plano','intervalos'], estado:'lista', url:'matematica/funciones/1-que-es-una-funcion.html', fecha:'2026-11-10' },
  { id:'dominio',      materia:'matematica', bloque:'Funciones', paso:2, titulo:'Dominio y rango',           resumen:'Qué números pueden entrar y cuáles pueden salir.', antes:['funcion'], estado:'lista', url:'matematica/funciones/2-dominio-y-rango.html', fecha:'2026-11-10' },
  { id:'clasificacion',materia:'matematica', bloque:'Funciones', paso:3, titulo:'Algebraicas y trascendentes', resumen:'El árbol de familias de funciones.', antes:['dominio'], estado:'lista', url:'matematica/funciones/3-clasificacion.html', fecha:'2026-11-10' },
  { id:'polinomicas',  materia:'matematica', bloque:'Funciones', paso:4, titulo:'Funciones polinómicas',     resumen:'Constante, lineal, cuadrática y cúbica.', antes:['clasificacion'], estado:'lista', url:'matematica/funciones/4-polinomicas.html', fecha:'2026-11-10' },
  { id:'racionales',   materia:'matematica', bloque:'Funciones', paso:4, titulo:'Racionales e irracionales', resumen:'Fracciones y raíces con x.', antes:['clasificacion'], estado:'pronto' },
  { id:'trascendentes',materia:'matematica', bloque:'Funciones', paso:4, titulo:'Funciones trascendentes',   resumen:'Exponencial, logarítmica y trigonométricas.', antes:['clasificacion'], estado:'lista', url:'matematica/funciones/5-trascendentes.html', fecha:'2026-11-10' },
  { id:'operaciones',  materia:'matematica', bloque:'Funciones', paso:5, titulo:'Composición e inversa',     resumen:'Juntar máquinas y darles la vuelta.', antes:['polinomicas','trascendentes'], estado:'pronto' },
  { id:'limites',      materia:'matematica', bloque:'Funciones', paso:6, titulo:'Límites',                   resumen:'A qué valor se acerca una función.', antes:['operaciones','sucesiones'], estado:'pronto' },
  { id:'derivadas',    materia:'matematica', bloque:'Funciones', paso:7, titulo:'Derivadas',                 resumen:'La pendiente en cada punto: qué tan rápido cambia.', antes:['limites'], estado:'pronto' },
  { id:'optimizacion', materia:'matematica', bloque:'Funciones', paso:8, titulo:'Máximos y mínimos',         resumen:'Usar la derivada para encontrar la caja más grande.', antes:['derivadas'], estado:'pronto' },
  /* --- Álgebra --- */
  { id:'absoluto',     materia:'matematica', bloque:'Álgebra',   paso:1, titulo:'Valor absoluto',            resumen:'La distancia al cero y sus ecuaciones.', antes:['intervalos'], estado:'pronto' },
  { id:'inecuaciones', materia:'matematica', bloque:'Álgebra',   paso:2, titulo:'Inecuaciones',              resumen:'Lineales, cuadráticas, racionales y con valor absoluto.', antes:['absoluto','polinomicas'], estado:'pronto' },
  { id:'proglineal',   materia:'matematica', bloque:'Álgebra',   paso:3, titulo:'Programación lineal',       resumen:'La mejor decisión dentro de una región de restricciones.', antes:['inecuaciones','recta'], estado:'pronto' },
  { id:'sucesiones',   materia:'matematica', bloque:'Álgebra',   paso:1, titulo:'Sucesiones',                resumen:'Listas de números con una regla, y hacia dónde van.', antes:['funcion'], estado:'pronto' },
  { id:'complejos',    materia:'matematica', bloque:'Álgebra',   paso:2, titulo:'Números complejos',         resumen:'La unidad i, el plano complejo y el módulo.', antes:['reales','potencias'], estado:'pronto' },
  { id:'matrices',     materia:'matematica', bloque:'Álgebra',   paso:2, titulo:'Matrices y determinantes',  resumen:'Tablas de números que se suman y se multiplican.', antes:['reales'], estado:'pronto' },
  /* --- Geometría plana --- */
  { id:'angulos',      materia:'matematica', bloque:'Geometría plana', paso:1, titulo:'Ángulos y rectas paralelas', resumen:'Ángulos entre paralelas cortadas por una secante.', antes:[], estado:'pronto' },
  { id:'triangulos',   materia:'matematica', bloque:'Geometría plana', paso:2, titulo:'Triángulos',             resumen:'Suma de ángulos, desigualdad triangular y Pitágoras.', antes:['angulos'], estado:'pronto' },
  { id:'poligonos',    materia:'matematica', bloque:'Geometría plana', paso:3, titulo:'Polígonos regulares',    resumen:'Ángulos internos, centrales y diagonales.', antes:['triangulos'], estado:'pronto' },
  { id:'cuadrilateros',materia:'matematica', bloque:'Geometría plana', paso:3, titulo:'Cuadriláteros',          resumen:'Paralelogramos, trapecios y cuadriláteros inscriptibles.', antes:['triangulos'], estado:'pronto' },
  { id:'circunferencia',materia:'matematica',bloque:'Geometría plana', paso:4, titulo:'Circunferencia',         resumen:'Cuerdas, tangentes y ángulos inscritos.', antes:['triangulos'], estado:'pronto' },
  { id:'areas',        materia:'matematica', bloque:'Geometría plana', paso:5, titulo:'Áreas de regiones planas', resumen:'Triángulos, polígonos, círculos y regiones sombreadas.', antes:['poligonos','circunferencia'], estado:'pronto' },
  /* --- Geometría del espacio --- */
  { id:'poliedros',    materia:'matematica', bloque:'Geometría del espacio', paso:1, titulo:'Poliedros regulares', resumen:'Los cinco sólidos platónicos: caras, aristas y vértices.', antes:['poligonos'], estado:'pronto' },
  { id:'prismas',      materia:'matematica', bloque:'Geometría del espacio', paso:2, titulo:'Prisma, pirámide y cilindro', resumen:'Áreas y volúmenes de los sólidos más usados.', antes:['areas'], estado:'pronto' },
  { id:'esfera',       materia:'matematica', bloque:'Geometría del espacio', paso:3, titulo:'Esfera y casquetes',  resumen:'Área y volumen de la esfera y de sus partes.', antes:['prismas'], estado:'pronto' },
  { id:'revolucion',   materia:'matematica', bloque:'Geometría del espacio', paso:4, titulo:'Sólidos de revolución', resumen:'Girar una figura plana para crear un sólido.', antes:['esfera'], estado:'pronto' },
  /* --- Trigonometría --- */
  { id:'posnormal',    materia:'matematica', bloque:'Trigonometría', paso:1, titulo:'Ángulos en posición normal', resumen:'Ángulos en el plano cartesiano y sus cuadrantes.', antes:['plano','angulos'], estado:'pronto' },
  { id:'razones',      materia:'matematica', bloque:'Trigonometría', paso:1, titulo:'Razones trigonométricas',   resumen:'Seno, coseno y tangente en el triángulo rectángulo.', antes:['triangulos'], estado:'pronto' },
  { id:'circtrig',     materia:'matematica', bloque:'Trigonometría', paso:2, titulo:'Circunferencia trigonométrica', resumen:'El seno y el coseno como coordenadas de un punto que gira.', antes:['posnormal','razones'], estado:'pronto' },
  { id:'funtrig',      materia:'matematica', bloque:'Trigonometría', paso:3, titulo:'Funciones trigonométricas e inversas', resumen:'sen, cos, tan como funciones, y arcsen, arctan.', antes:['circtrig','trascendentes'], estado:'pronto' },
  /* --- Geometría analítica --- */
  { id:'recta',        materia:'matematica', bloque:'Geometría analítica', paso:1, titulo:'La recta',          resumen:'Pendiente, ecuación y punto de corte entre rectas.', antes:['plano'], estado:'pronto' },
  { id:'circanalitica',materia:'matematica', bloque:'Geometría analítica', paso:2, titulo:'Ecuación de la circunferencia', resumen:'Centro, radio y rectas tangentes.', antes:['recta','circunferencia'], estado:'pronto' },
  { id:'conicas',      materia:'matematica', bloque:'Geometría analítica', paso:3, titulo:'Parábola y elipse',  resumen:'Las otras cónicas: focos, vértices y ecuaciones.', antes:['circanalitica'], estado:'pronto' },

  /* ===================== FÍSICA ===================== */
  /* --- Bases --- */
  { id:'magnitudes',   materia:'fisica', bloque:'Bases', paso:1, titulo:'Magnitudes y unidades',  resumen:'El Sistema Internacional, prefijos y conversiones.', antes:[], estado:'lista', url:'fisica/bases/1-magnitudes.html', fecha:'2026-11-11' },
  { id:'dimensional',  materia:'fisica', bloque:'Bases', paso:2, titulo:'Análisis dimensional',   resumen:'Revisar si una fórmula tiene sentido con sus unidades.', antes:['magnitudes'], estado:'lista', url:'fisica/bases/2-analisis-dimensional.html', fecha:'2026-11-11' },
  { id:'vectores',     materia:'fisica', bloque:'Bases', paso:2, titulo:'Vectores',               resumen:'Magnitud, dirección y cómo se suman.', antes:['magnitudes','razones'], estado:'lista', url:'fisica/bases/3-vectores.html', fecha:'2026-11-11' },
  /* --- Cinemática --- */
  { id:'mru',          materia:'fisica', bloque:'Cinemática', paso:1, titulo:'MRU: velocidad constante', resumen:'Avanzar en línea recta sin acelerar ni frenar.', antes:['magnitudes','funcion'], estado:'lista', url:'fisica/cinematica/1-mru.html', fecha:'2026-11-11' },
  { id:'mruv',         materia:'fisica', bloque:'Cinemática', paso:2, titulo:'MRUV: la velocidad cambia', resumen:'Acelerar y frenar de forma pareja.', antes:['mru'], estado:'lista', url:'fisica/cinematica/2-mruv.html', fecha:'2026-11-11' },
  { id:'caida',        materia:'fisica', bloque:'Cinemática', paso:3, titulo:'Caída libre',              resumen:'El MRUV de todo lo que cae.', antes:['mruv'], estado:'lista', url:'fisica/cinematica/3-caida-libre.html', fecha:'2026-11-11' },
  { id:'circular',     materia:'fisica', bloque:'Cinemática', paso:3, titulo:'Movimiento circular',      resumen:'Velocidad angular y aceleración centrípeta.', antes:['mruv','vectores'], estado:'lista', url:'fisica/cinematica/4-movimiento-circular.html', fecha:'2026-11-11' },
  /* --- Dinámica --- */
  { id:'newton',       materia:'fisica', bloque:'Dinámica', paso:1, titulo:'Leyes de Newton',          resumen:'Fuerza, masa y aceleración: F = m · a.', antes:['mruv','vectores'], estado:'pronto' },
  { id:'rozamiento',   materia:'fisica', bloque:'Dinámica', paso:2, titulo:'Rozamiento',               resumen:'La fuerza que se opone a deslizar.', antes:['newton'], estado:'pronto' },
  { id:'estatica',     materia:'fisica', bloque:'Dinámica', paso:2, titulo:'Estática y equilibrio',    resumen:'Cuándo un cuerpo no se mueve: fuerzas que se anulan.', antes:['newton'], estado:'pronto' },
  { id:'trabajo',      materia:'fisica', bloque:'Dinámica', paso:3, titulo:'Trabajo y energía',        resumen:'Energía cinética, potencial y su conservación.', antes:['newton'], estado:'pronto' },
  { id:'choques',      materia:'fisica', bloque:'Dinámica', paso:4, titulo:'Cantidad de movimiento y choques', resumen:'Lo que se conserva cuando dos cuerpos chocan.', antes:['trabajo'], estado:'pronto' },
  { id:'gravitacion',  materia:'fisica', bloque:'Dinámica', paso:4, titulo:'Gravitación',              resumen:'La atracción entre masas y la gravedad a cierta altura.', antes:['newton','circular'], estado:'pronto' },
  /* --- Oscilaciones, fluidos y calor --- */
  { id:'mas',          materia:'fisica', bloque:'Oscilaciones, fluidos y calor', paso:1, titulo:'Movimiento armónico simple', resumen:'Un resorte que sube y baja: amplitud y periodo.', antes:['trabajo','funtrig'], estado:'pronto' },
  { id:'ondas',        materia:'fisica', bloque:'Oscilaciones, fluidos y calor', paso:2, titulo:'Ondas',            resumen:'Longitud de onda, frecuencia y rapidez.', antes:['mas'], estado:'pronto' },
  { id:'fluidos',      materia:'fisica', bloque:'Oscilaciones, fluidos y calor', paso:1, titulo:'Presión y fluidos', resumen:'Presión absoluta, manométrica y empuje.', antes:['newton'], estado:'pronto' },
  { id:'dilatacion',   materia:'fisica', bloque:'Oscilaciones, fluidos y calor', paso:1, titulo:'Temperatura y dilatación', resumen:'Por qué los metales crecen con el calor.', antes:['magnitudes'], estado:'pronto' },
  { id:'termo',        materia:'fisica', bloque:'Oscilaciones, fluidos y calor', paso:2, titulo:'Gas ideal y termodinámica', resumen:'P · V = n · R · T y el trabajo de un gas.', antes:['dilatacion','fluidos'], estado:'pronto' },
  /* --- Electricidad y magnetismo --- */
  { id:'carga',        materia:'fisica', bloque:'Electricidad y magnetismo', paso:1, titulo:'Carga, corriente y voltaje', resumen:'Qué se mueve por un cable y qué lo empuja.', antes:['magnitudes'], estado:'pronto' },
  { id:'circuitos',    materia:'fisica', bloque:'Electricidad y magnetismo', paso:2, titulo:'Resistencias y circuitos',  resumen:'Ley de Ohm, serie y paralelo.', antes:['carga'], estado:'pronto' },
  { id:'potencia',     materia:'fisica', bloque:'Electricidad y magnetismo', paso:3, titulo:'Potencia eléctrica',        resumen:'Cuánta energía gasta un foco por segundo.', antes:['circuitos'], estado:'pronto' },
  { id:'condensadores',materia:'fisica', bloque:'Electricidad y magnetismo', paso:3, titulo:'Condensadores',             resumen:'Guardar carga y energía, en serie y en paralelo.', antes:['circuitos'], estado:'pronto' },
  { id:'magnetismo',   materia:'fisica', bloque:'Electricidad y magnetismo', paso:4, titulo:'Campo magnético',           resumen:'Imanes, corrientes y el campo dentro de un solenoide.', antes:['circuitos','vectores'], estado:'pronto' },
  /* --- Óptica y física moderna --- */
  { id:'refraccion',   materia:'fisica', bloque:'Óptica y física moderna', paso:1, titulo:'Reflexión y refracción', resumen:'La luz rebota y se desvía al cambiar de medio.', antes:['razones'], estado:'pronto' },
  { id:'espejos',      materia:'fisica', bloque:'Óptica y física moderna', paso:2, titulo:'Espejos y lentes',       resumen:'Dónde se forma la imagen y de qué tamaño.', antes:['refraccion'], estado:'pronto' },
  { id:'fotoelectrico',materia:'fisica', bloque:'Óptica y física moderna', paso:3, titulo:'Efecto fotoeléctrico',   resumen:'La luz como paquetes de energía que arrancan electrones.', antes:['ondas','carga'], estado:'pronto' },

  /* ===================== QUÍMICA ===================== */
  /* --- Estructura de la materia --- */
  { id:'materia',      materia:'quimica', bloque:'Estructura de la materia', paso:1, titulo:'Materia y sus cambios',   resumen:'Sustancias, mezclas y cambios físicos o químicos.', antes:[], estado:'pronto' },
  { id:'atomo',        materia:'quimica', bloque:'Estructura de la materia', paso:2, titulo:'El átomo y el modelo de Bohr', resumen:'Protones, neutrones, electrones y niveles de energía.', antes:['materia'], estado:'pronto' },
  { id:'configuracion',materia:'quimica', bloque:'Estructura de la materia', paso:3, titulo:'Configuración electrónica', resumen:'Cómo se acomodan los electrones en el átomo.', antes:['atomo'], estado:'pronto' },
  { id:'periodica',    materia:'quimica', bloque:'Estructura de la materia', paso:4, titulo:'Tabla periódica',         resumen:'Grupos, periodos y propiedades que cambian en la tabla.', antes:['configuracion'], estado:'pronto' },
  /* --- Enlace químico --- */
  { id:'enlace',       materia:'quimica', bloque:'Enlace químico', paso:1, titulo:'Enlace y estructuras de Lewis', resumen:'Iónico, covalente y cómo dibujar los electrones.', antes:['periodica'], estado:'pronto' },
  { id:'geometria',    materia:'quimica', bloque:'Enlace químico', paso:2, titulo:'Geometría molecular',          resumen:'La forma de las moléculas y si son polares.', antes:['enlace'], estado:'pronto' },
  { id:'intermoleculares',materia:'quimica',bloque:'Enlace químico',paso:3, titulo:'Fuerzas intermoleculares',     resumen:'Por qué unos líquidos hierven antes que otros.', antes:['geometria'], estado:'pronto' },
  { id:'nomenclatura', materia:'quimica', bloque:'Enlace químico', paso:2, titulo:'Estado de oxidación y nomenclatura', resumen:'Nombrar óxidos, ácidos, bases y sales.', antes:['enlace'], estado:'pronto' },
  /* --- Cálculos químicos --- */
  { id:'mol',          materia:'quimica', bloque:'Cálculos químicos', paso:1, titulo:'Mol y masa molar',       resumen:'Contar átomos pesándolos.', antes:['atomo'], estado:'pronto' },
  { id:'centesimal',   materia:'quimica', bloque:'Cálculos químicos', paso:2, titulo:'Composición centesimal', resumen:'Qué porcentaje de un compuesto es cada elemento.', antes:['mol'], estado:'pronto' },
  { id:'estequiometria',materia:'quimica',bloque:'Cálculos químicos', paso:3, titulo:'Estequiometría',         resumen:'Cuánto producto sale de cierta cantidad de reactivo.', antes:['mol','nomenclatura'], estado:'pronto' },
  { id:'gasesq',       materia:'quimica', bloque:'Cálculos químicos', paso:3, titulo:'Gases',                  resumen:'La ecuación de los gases ideales en química.', antes:['mol'], estado:'pronto' },
  /* --- Reacciones y soluciones --- */
  { id:'soluciones',   materia:'quimica', bloque:'Reacciones y soluciones', paso:1, titulo:'Soluciones y concentración', resumen:'Molaridad, porcentaje en masa, fracción molar y diluciones.', antes:['mol'], estado:'pronto' },
  { id:'equilibrio',   materia:'quimica', bloque:'Reacciones y soluciones', paso:2, titulo:'Equilibrio químico',  resumen:'La constante de equilibrio y hacia dónde se mueve una reacción.', antes:['soluciones','estequiometria'], estado:'pronto' },
  { id:'acidos',       materia:'quimica', bloque:'Reacciones y soluciones', paso:3, titulo:'Ácidos, bases y pH',  resumen:'Qué mide el pH y cómo se calcula.', antes:['equilibrio','trascendentes'], estado:'pronto' },
  { id:'electroquimica',materia:'quimica',bloque:'Reacciones y soluciones', paso:3, titulo:'Electroquímica',      resumen:'Potenciales redox, pilas y corrosión.', antes:['nomenclatura','soluciones'], estado:'pronto' },
  /* --- Química orgánica y ambiente --- */
  { id:'organica',     materia:'quimica', bloque:'Química orgánica y ambiente', paso:1, titulo:'El carbono y los hidrocarburos', resumen:'Alcanos, alquenos, alquinos y cómo se nombran.', antes:['enlace'], estado:'pronto' },
  { id:'funorganicas', materia:'quimica', bloque:'Química orgánica y ambiente', paso:2, titulo:'Funciones orgánicas',  resumen:'Alcoholes, cetonas, ácidos y más.', antes:['organica'], estado:'pronto' },
  { id:'polimeros',    materia:'quimica', bloque:'Química orgánica y ambiente', paso:3, titulo:'Polímeros',            resumen:'Cadenas gigantes: plásticos, fibras y cauchos.', antes:['funorganicas'], estado:'pronto' },
  { id:'ambiente',     materia:'quimica', bloque:'Química orgánica y ambiente', paso:1, titulo:'Contaminación ambiental', resumen:'Qué contamina el agua, el aire y el suelo.', antes:['materia'], estado:'pronto' }
];

/* Ejemplos de uso: los que tienen "panel" se abren en la misma página. */
window.EJEMPLOS = [
  { panel:'funcion',     titulo:'De °C a °F',            tema:'funcion' },
  { panel:'dominio',     titulo:'La batería del celular', tema:'dominio' },
  { panel:'lineal',      titulo:'El precio de un taxi',   tema:'polinomicas' },
  { panel:'mru',         titulo:'Un viaje en bus',        tema:'mru' },
  { panel:'prefijos',    titulo:'Los megas de tu internet', tema:'magnitudes' },
  { panel:'vectores',    titulo:'Un avión con viento de costado', tema:'vectores' },
  { panel:'mruv',        titulo:'Frenar a tiempo',        tema:'mruv' },
  { panel:'circular',    titulo:'La rueda de tu bicicleta', tema:'circular' },
  { panel:'cuadratica',  titulo:'El camino de un balón',  tema:'polinomicas' },
  { panel:'cubica',      titulo:'La caja más grande',     tema:'polinomicas' },
  { panel:'exponencial', titulo:'Un chisme en WhatsApp',  tema:'trascendentes' },
  { panel:'log',         titulo:'La fuerza de un sismo',  tema:'trascendentes' },
  { panel:'seno',        titulo:'El sonido de una nota',  tema:'trascendentes' },
  { url:'ejemplos/vidrio-liquido.html', titulo:'El vidrio líquido de los celulares', desc:'Geometría y óptica en la pantalla.', tema:'funcion' }
];

window.EXAMENES = [
  { id:'funciones-1', titulo:'Funciones · Examen 1', desc:'Función, dominio y rango, clasificación. 8 preguntas.', url:'examenes/funciones-1.html' },
  { id:'fisica-1',    titulo:'Física · Examen 1',    desc:'Bases y cinemática: unidades, vectores, MRU, MRUV, caída libre y circular. 8 preguntas.', url:'examenes/fisica-1.html' }
];
