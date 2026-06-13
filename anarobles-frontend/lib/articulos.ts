import { formatDate as formatDateUtil } from "@/lib/utils"

export type CategoriaSlug =
  | "arte-y-tecnica"
  | "tutoriales"
  | "proceso-creativo"
  | "inspiracion"
  | "reflexiones"

export const CATEGORIA_LABELS: Record<CategoriaSlug, string> = {
  "arte-y-tecnica":   "Arte y Técnica",
  "tutoriales":       "Tutoriales",
  "proceso-creativo": "Proceso Creativo",
  "inspiracion":      "Inspiración",
  "reflexiones":      "Reflexiones",
}

export type Articulo = {
  id: string
  slug: string
  titulo: string
  subtitulo?: string
  resumen: string
  categoria: CategoriaSlug
  fechaPublicacion: string // ISO "2026-03-15"
  tiempoLectura: number
  imagenDestacada: string
  imagenDestacadaAlt: string
  contenido: string // Markdown
  metaDescripcion?: string
  palabrasClave?: string[]
  destacado?: boolean
  relacionados?: string[] // slugs
}

const articulos: Articulo[] = [
  {
    id: "1",
    slug: "lenguaje-del-color",
    titulo: "El lenguaje secreto del color en la pintura contemporánea",
    subtitulo: "Cómo los artistas usamos el color para decir lo que las palabras no pueden",
    resumen:
      "El color no es solo apariencia — es temperatura, peso, emoción y coreografía. Entender cómo funciona transforma tu manera de pintar y de mirar.",
    categoria: "arte-y-tecnica",
    fechaPublicacion: "2026-03-15",
    tiempoLectura: 8,
    imagenDestacada: "/blog1.jpeg",
    imagenDestacadaAlt: "Paleta de colores vibrantes sobre lienzo texturado",
    destacado: true,
    relacionados: ["teoria-del-color-temperatura", "consejos-principiantes-oleo"],
    metaDescripcion:
      "Descubrí cómo los artistas usamos el color como lenguaje emocional en la pintura contemporánea.",
    palabrasClave: ["color", "pintura", "teoría del color", "arte contemporáneo"],
    contenido: `## El color antes de que sea color

Cuando paro frente a una superficie en blanco, lo primero que decido no es qué voy a pintar — es en qué *tono emocional* voy a trabajar.

Antes de elegir un pincel, me pregunto: ¿esta obra va a pesar o va a flotar? ¿Va a contener o va a expandir? Esas preguntas tienen respuesta en el color.

La teoría del color que aprendemos en las academias — la rueda cromática, los colores primarios, los complementarios — es el esqueleto. Pero lo que hace que una pintura *funcione* emocionalmente es otra cosa: es entender que cada color tiene temperatura, peso, historia cultural, y reacciones fisiológicas asociadas.

## Temperatura: la primera decisión que tomás sin saberlo

Todo color tiene una temperatura percibida. Y esa temperatura afecta cómo el ojo del espectador recorre la obra.

Los **colores cálidos** (rojos, naranjas, amarillos) avanzan visualmente. Se acercan. Crean urgencia, tensión, presencia. Son los que el ojo ve primero.

Los **colores fríos** (azules, violetas, algunos verdes) retroceden. Generan distancia, calma, profundidad. Son los que el ojo encuentra después.

En una composición bien resuelta, la temperatura no es aleatoria — es coreografía. Usás un naranja intenso donde querés que el ojo se detenga, y un azul suave donde querés que descanse.

> "El color es el teclado, los ojos son las armonías, y el alma es el piano con muchas cuerdas. El artista es la mano que, tocando una tecla u otra deliberadamente, hace vibrar el alma."
> — Wassily Kandinsky

## Por qué los grises no son neutrales

Una de las cosas que más trabajo con mis alumnos es sacarles el miedo a los grises sucios. El gris mezclado con pigmento puro no es lo mismo que el gris de imprenta.

Un gris con temperatura cálida (mezcla de tierras, ocres, blancos marfil) hace vibrar los naranjas que lo rodean. Un gris frío (azul + blanco + un toque de negro) hace que los rojos parezcan más saturados de lo que son.

Esto es la **simultaneidad de contraste** que describió Chevreul en 1839 y que sigue siendo igual de cierta hoy: los colores no existen solos, existen en relación.

![Comparación de grises cálidos y fríos junto a un naranja](/artwork-2.jpg)
*Los mismos naranjes se perciben diferente según la temperatura del gris que los rodea*

## Armonías que funcionan más allá del tiempo

Hay combinaciones de color que aparecen en la pintura renacentista, en el arte japonés del siglo XVII, y en la publicidad contemporánea. No es coincidencia.

**Complementarios con moderación**: rojo y verde, azul y naranja, violeta y amarillo. Juntos al 100% de saturación crean vibración visual incómoda. Juntos con diferente valor (uno claro, uno oscuro) o diferente saturación (uno vivo, uno apagado) crean tensión productiva.

**Análogos con acento**: elegir tres colores adyacentes en la rueda (azul, azul-verde, verde) y agregar un toque de su complementario (rojo-naranja) como acento. Es la combinación que más aparece en la naturaleza y por eso nos resulta orgánica.

**Monocromáticos con valor**: usar un solo color en distintos valores (claro a oscuro) crea unidad visual muy fuerte. Es lo que hace que ciertas obras sean visualmente "tranquilas" incluso cuando el tema es tenso.

## Lo que la paleta dice antes de que empieces a mirar

Hay un experimento que hago siempre en los talleres: muestro la misma composición — mismas formas, misma estructura — en dos paletas distintas. Una cálida, una fría. Les pregunto a los alumnos qué palabras les genera cada versión.

Los resultados son consistentes: la versión cálida genera palabras como *urgente*, *cercana*, *viva*, *íntima*. La fría genera *lejana*, *serena*, *melancólica*, *formal*.

Misma forma. Distinto vocabulario.

Eso es el color como lenguaje. No lo que representa la imagen — lo que **sentís** antes de entender qué estás mirando.

## Para llevarte

- La temperatura de los colores secundarios (los grises, los apagados) importa tanto como los colores principales.
- El ojo sigue la temperatura cálida. Usá eso para guiar la lectura de tu obra.
- Antes de mezclar, preguntate: ¿qué emoción quiero que este área de la tela transmita?
- El color no funciona solo — siempre en relación con lo que lo rodea.

Si querés profundizar en esto con ejercicios prácticos, el curso [Iniciación a la Acuarela](/cursos/iniciacion-acuarela) incluye un módulo dedicado enteramente a la gestión del color dentro de la mancha húmeda.`,
  },
  {
    id: "2",
    slug: "consejos-principiantes-oleo",
    titulo: "5 errores que todos cometemos al empezar con óleo (y cómo evitarlos)",
    resumen:
      "El óleo es un medio generoso, pero tiene su propio ritmo. Estos son los cinco errores más comunes en los primeros meses — y cómo superarlos.",
    categoria: "tutoriales",
    fechaPublicacion: "2026-02-28",
    tiempoLectura: 6,
    imagenDestacada: "/artwork-2.jpg",
    imagenDestacadaAlt: "Pinceles y óleos sobre mesa de artista",
    relacionados: ["lenguaje-del-color", "teoria-del-color-temperatura"],
    palabrasClave: ["óleo", "pintura", "principiantes", "técnica"],
    contenido: `## El óleo tiene su propio ritmo

Cuando empezás a pintar con óleo, lo primero que sentís es extrañeza. Viene de trabajar con acrílico, acuarela, o incluso lápiz, y de repente el material no responde como esperabas.

El óleo es un medio lento. Pacientemente lento. Y esa lentitud es exactamente lo que lo hace diferente — pero también lo que genera la mayoría de los errores al principio.

Estos son los cinco que veo más seguido en mis talleres.

## Error 1: Mezclar directamente en el lienzo sin preparar

El primer impulso de cualquier principiante es agarrar el pincel, cargar con dos colores, y mezclarlos directamente sobre la tela. El resultado: una mancha marrón indefinida donde debería haber una transición suave.

**Por qué pasa**: el óleo necesita espacio y tiempo para integrarse. Mezclado en la paleta, podés controlar la proporción y el valor. Mezclado en el lienzo, el resultado depende del orden en que pusiste los colores y de cuánto material había.

**Cómo evitarlo**: preparar en paleta al menos 3 valores de cada color que vayas a usar (claro, medio, oscuro) antes de empezar. Así tenés material listo y no improvisás sobre la tela.

## Error 2: Agregar médium sin entender qué hace

Los médiums (aceite de linaza, esencia de trementina, Liquin, etc.) modifican la consistencia, el tiempo de secado, y el brillo del óleo. Usarlos sin conocerlos crea problemas concretos.

**El más común**: mezclar demasiado aceite en las capas inferiores. El aceite de linaza ralentiza el secado. Si las capas de abajo tardan más en secar que las de arriba, la pintura se agrieta con el tiempo.

**La regla práctica**: "fat over lean" — las capas más profundas deben tener menos aceite y las capas superiores pueden tener más. Una forma simple: la primera capa diluida con trementina, las siguientes sin diluir o con un toque de aceite.

## Error 3: Tener miedo de tapar

El óleo es opaco. Tapar es su superpoder. Sin embargo, muchos principiantes trabajan demasiado fino por miedo a "arruinar" lo que ya está.

**La realidad**: nada es permanente mientras esté húmedo. Y una vez seco, podés pintar encima sin problema. La ventaja del óleo frente a la acuarela es exactamente esa: podés corregir.

**Ejercicio**: en tu próxima sesión, identificá algo que no te guste y tapalo con una capa opaca. Observá cómo el miedo desaparece con la práctica.

## Error 4: No esperar entre sesiones

A diferencia de la acuarela o el acrílico, el óleo puede tardar días o semanas en secar según el grosor de la capa.

**El problema de no esperar**: pintar encima de una capa húmeda mezcla los colores involuntariamente. Las capas se ensucian, pierden luminosidad, y el resultado final tiene una apariencia opaca.

**Cuánto esperar**: si podés tocar la capa sin que se mueva, podés continuar. Con Liquin el secado puede ser de 24-48h. Con aceite puro puede ser una semana o más.

## Error 5: Comparar la velocidad de trabajo con otros medios

Este es el error más conceptual y probablemente el más dañino: tratar de trabajar con la velocidad de la acuarela o el acrílico.

El óleo tiene su propio ritmo, y ese ritmo no es defecto — es una característica. Permite revisitar, corregir, trabajar una área mientras otra seca, y construir capas de profundidad que otros medios no permiten.

Cuando aceptás la lentitud como parte del proceso, el óleo deja de ser frustrante y se convierte en el medio más generoso que existe.

---

Si querés aprender a usar el óleo con paciencia y técnica, el curso [El Retrato como Búsqueda](/cursos/retrato-busqueda) incluye módulos completos de manejo de óleo, desde la preparación de la paleta hasta el trabajo por capas.`,
  },
  {
    id: "3",
    slug: "inspiracion-mediterranea",
    titulo: "Inspiración mediterránea: del lienzo a la realidad",
    resumen:
      "En enero de 2026 pinté una serie inspirada en el Mediterráneo sin haber estado ahí. Un proceso sobre cómo transformar referencias en emoción real.",
    categoria: "proceso-creativo",
    fechaPublicacion: "2026-01-10",
    tiempoLectura: 5,
    imagenDestacada: "/artwork-3.jpg",
    imagenDestacadaAlt: "Serie mediterránea — proceso en el taller",
    relacionados: ["importancia-del-boceto", "lenguaje-del-color"],
    palabrasClave: ["proceso creativo", "inspiración", "serie", "Mediterráneo"],
    contenido: `## El mar que no conocí en persona

En enero de 2026 pinté una serie de cuatro obras inspiradas en el Mediterráneo. Nunca estuve ahí.

Las fuentes fueron fotografías de Nápoles tomadas por una amiga, un documental sobre pintura italiana del Quattrocento, y algunas novelas que describían la luz de esa región con una precisión que ninguna foto puede capturar.

Eso es algo que aprendí con el tiempo: la inspiración más potente no siempre viene de la experiencia directa. A veces viene de las capas — una imagen más un texto más una música más un recuerdo de algo que no viviste pero que de alguna forma ya conocés.

## El proceso real

La primera semana fue de investigación. No pinté nada. Solo miré.

Acumulé referencias visuales: los azules de Capri, la textura de los muros viejos, el naranja quemado de los techos al atardecer. También leí sobre el impresionismo mediterráneo, sobre Cézanne en Provenza, sobre los colores que él llamaba "las manchas de sensación".

La segunda semana hice bocetos. No bocetos de composición — bocetos de paleta. Probé combinaciones de colores en papeles pequeños, buscando la temperatura exacta del azul del mar según la hora del día.

![Bocetos de paleta mediterránea](/artwork-4.jpg)
*Pruebas de color antes de empezar las obras finales*

## Lo que no salió como esperaba

La primera obra fue un desastre deliberado. La llamo así porque en ese momento la sentí como un fracaso, pero retrospectivamente fue necesaria.

Intenté representar el mar de manera literal — agua, espuma, horizonte. El resultado fue una postal. Bonita, técnicamente correcta, completamente vacía.

Deseché esa dirección y empecé de nuevo con una pregunta diferente: ¿qué *siento* cuando pienso en el Mediterráneo? No qué veo — qué siento.

La respuesta fue: luz densa, calor que pesa, tiempo que se mueve despacio.

Con esa respuesta como guía, las tres obras siguientes salieron en una semana.

## La lección que me llevé

La inspiración geográfica — un lugar, una cultura, un paisaje — funciona mejor cuando se convierte en inspiración emocional. El Mediterráneo no era el tema. El tema era esa calidad de luz que hace que el tiempo parezca más lento.

Eso es transportable a cualquier obra, en cualquier lugar.`,
  },
  {
    id: "4",
    slug: "elegir-pinceles-acuarela",
    titulo: "Cómo elegir pinceles para acuarela sin gastar de más",
    resumen:
      "Con tres pinceles bien elegidos podés hacer el 90% de lo que necesitás en acuarela. Guía práctica para no caer en los sets que venden de todo pero sirven poco.",
    categoria: "tutoriales",
    fechaPublicacion: "2026-01-28",
    tiempoLectura: 7,
    imagenDestacada: "/artwork-5.jpg",
    imagenDestacadaAlt: "Colección de pinceles de acuarela sobre superficie de madera",
    relacionados: ["consejos-principiantes-oleo", "importancia-del-boceto"],
    palabrasClave: ["acuarela", "pinceles", "materiales", "principiantes"],
    contenido: `## No necesitás muchos, necesitás los correctos

Una de las primeras preguntas que recibo en los talleres de acuarela es: "¿Qué pinceles necesito comprar?"

La respuesta honesta es: probablemente menos de los que pensás.

Con tres pinceles bien elegidos podés hacer el 90% de lo que necesitás en acuarela. El problema es que la industria vende sets de doce que incluyen la mitad de pinceles que nunca vas a usar.

## Las dos características que importan

Antes de hablar de marcas o pelo de pincel, hay dos características que definen si un pincel sirve para acuarela o no.

**La panza**: el vientre del pincel tiene que poder retener agua. Un buen pincel de acuarela carga mucho pigmento diluido y lo libera de manera controlada. Uno malo se vacía en dos pinceladas.

**La punta**: un pincel redondo de buena calidad, cuando está mojado, tiene que armar una punta perfecta al apretarlo suavemente contra una superficie. Esa punta te permite tanto hacer grandes manchas planas como trazos finos.

Si un pincel redondo no arma punta cuando está mojado, descartalo sin culpa.

## Los tres pinceles esenciales

**Redondo grande (Nº 10 o 12)**: para las manchas grandes, los fondos, y las lavadas amplias. Es el que más vas a usar.

**Redondo mediano (Nº 6 o 7)**: para detalles medianos, texturas, y zonas de transición. El caballo de batalla.

**Redondo fino (Nº 2 o 3)**: para los detalles finales, los bordes definidos, y las líneas. No lo uses antes de tener las masas grandes resueltas.

Con estos tres, podés hacer prácticamente todo.

## Pelo natural vs. sintético

La tradición dice que los mejores pinceles de acuarela son de pelo de marta cibelina. Eso es verdad — pero también cuestan entre 40 y 150 dólares cada uno.

La buena noticia: los pinceles sintéticos de alta gama de los últimos diez años se acercaron mucho en rendimiento. Marcas como Escoda Versatil o Princeton Neptune son opciones reales si no tenés presupuesto para marta.

Lo que no recomiendo: los sets económicos de cerdas mezcladas que se venden en ferias. El pelo mezclado no arma punta, retiene poco agua, y va a frustrarte antes de que el problema sea tu técnica.

## Cuándo reemplazar un pincel

Un pincel hay que reemplazarlo cuando ya no puede armar punta al mojarlo. No antes.

El desgaste natural de los pinceles no es un problema — es una herramienta que tiene historia. Algunos de los mejores pinceles que tengo están ligeramente curvados y hacen líneas que un pincel nuevo no haría igual.

Cuidalos: nunca los dejes parados sobre la punta, lavalos con jabón neutro después de cada sesión, y secalos horizontalmente o con la punta hacia abajo.`,
  },
  {
    id: "5",
    slug: "importancia-del-boceto",
    titulo: "Por qué el boceto es la parte más honesta del proceso creativo",
    resumen:
      "El boceto no es el borrador de la obra — es donde la obra existe en estado puro. Sin la presión de la permanencia, las decisiones reales aparecen.",
    categoria: "proceso-creativo",
    fechaPublicacion: "2025-12-05",
    tiempoLectura: 5,
    imagenDestacada: "/artwork-6.jpg",
    imagenDestacadaAlt: "Cuaderno de bocetos abierto con estudios en carboncillo",
    relacionados: ["inspiracion-mediterranea", "elegir-pinceles-acuarela"],
    palabrasClave: ["boceto", "proceso creativo", "carboncillo", "diseño"],
    contenido: `## El boceto no es el borrador — es la obra

Durante mucho tiempo pensé que los bocetos eran el paso previo a la obra real. El "todavía no cuento" del proceso creativo.

Me equivocaba.

El boceto es donde la obra existe en estado puro, sin la presión de la permanencia. Es donde tomás decisiones antes de saber que las estás tomando. Es donde aparece lo que realmente querés decir.

## Lo que el boceto revela que la obra terminada oculta

Cuando alguien me pregunta cómo trabajo, suelo mostrarle los bocetos antes que las obras finales. Porque en los bocetos están las dudas, los cambios de dirección, las versiones descartadas que a veces eran mejores que la que elegí.

Una obra terminada tiene la apariencia de inevitabilidad. Parece que no pudo haber sido de otra manera. El boceto muestra que pudo haber sido de veinte maneras distintas, y que la elección fue exactamente eso — una elección.

## El carboncillo como pensamiento

Trabajo los bocetos casi siempre con carboncillo. No por tradición — por practicidad.

El carboncillo borra con facilidad. Esa facilidad te invita a probar sin compromiso. Y sin compromiso, las ideas salen más libres.

Cuando empezás a bocetar con algo que no borra fácil (un marcador permanente, una pluma), la mente se tensa. Cada línea carga el peso de la permanencia. Y ese peso mata la espontaneidad que necesitás en la fase de exploración.

![Página de bocetos con carboncillo](/artwork-7.jpg)
*Una página de bocetos típica: ideas que compiten, algunas que sobreviven*

## La pregunta que hago antes de cada boceto

Antes de poner el carboncillo en el papel, me hago una pregunta: ¿cuál es la tensión de esta obra?

No la composición, no la paleta — la tensión. El conflicto visual o emocional que hace que valga la pena mirarla.

A veces la tensión es entre luz y sombra. A veces entre lo que está y lo que falta. A veces entre la forma esperada de un objeto y cómo yo lo estoy interpretando.

Con esa tensión clara, el boceto se organiza solo. Sin ella, puedo bocetar durante horas sin llegar a ningún lado.

## Una práctica concreta

Si todavía no tenés el hábito del boceto, te propongo esto: antes de empezar cualquier obra, hacé mínimo tres versiones del encuadre en papel pequeño (10x10 cm está bien). No en el soporte final — en papeles de borrador.

Tres versiones diferentes: una centrada, una asimétrica, una con la composición invertida o recortada de forma inesperada.

Después elegí. Y cuando elegís entre tres opciones, lo que elegís no es lo primero que se te ocurrió — es lo que mejor funciona.

Esa diferencia hace toda la obra.`,
  },
  {
    id: "6",
    slug: "teoria-del-color-temperatura",
    titulo: "Temperatura del color: la diferencia entre una obra fría y una obra viva",
    resumen:
      "La temperatura es más sutil que la saturación — y por eso tiene más poder. Un mismo color puede sentirse cálido o frío dependiendo de lo que lo rodea.",
    categoria: "arte-y-tecnica",
    fechaPublicacion: "2025-11-18",
    tiempoLectura: 9,
    imagenDestacada: "/artwork-8.jpg",
    imagenDestacadaAlt: "Estudio comparativo de paletas cálidas y frías",
    relacionados: ["lenguaje-del-color", "consejos-principiantes-oleo"],
    palabrasClave: ["temperatura del color", "paleta", "pintura", "técnica"],
    contenido: `## La misma paleta, dos sensaciones

Tomá cualquier color de tu paleta — el azul ultramar, por ejemplo. Mezclalo con blanco de titanio. Ahora mezclá el mismo azul con blanco marfil.

¿Ves la diferencia?

El blanco de titanio es frío — tiene un tinte ligeramente azulado o verdoso. El blanco marfil es cálido — tiene un tinte amarillento. La mezcla con titanio produce un azul-gris frío. La mezcla con marfil produce un azul-gris que tiende al violeta suave.

Misma proporción de azul. Resultado completamente diferente.

Eso es la temperatura del color en la práctica.

## Por qué importa más que la saturación

Cuando empezamos a pintar, nos obsesionamos con la saturación — qué tan vivo o apagado está un color. La saturación es visible, obvia, fácil de controlar.

La temperatura es más sutil. Opera debajo de la conciencia del espectador. Y por eso tiene más poder.

Un cuadro puede tener todos sus colores muy saturados y sentirse inerte. Otro puede tener colores muy apagados y sentirse vibrante. La diferencia casi siempre está en la gestión de la temperatura.

## Los colores no tienen temperatura fija

Este es el punto que más confunde: la temperatura de un color es siempre relativa.

El rojo cadmio parece cálido cuando está solo. Pero comparado con el rojo de cadmio naranja (que tiene más amarillo), se vuelve frío.

El cerúleo (azul-verde) parece frío. Pero comparado con el azul de Prusia (que tiene más negro y verde), se vuelve cálido.

En la práctica: cada vez que mezcles o coloques un color, preguntate no si es cálido o frío en abstracto, sino si es más cálido o más frío que lo que tiene al lado.

## Calor donde querés atención, frío donde querés descanso

Esta es la aplicación más directa de la temperatura a la composición.

El ojo humano es atraído por el calor. Entonces: ponés temperatura cálida donde querés que el ojo se detenga. Creás zonas de calma con temperatura fría para que el ojo pueda descansar antes de volver al foco.

En un retrato: el calor en la piel iluminada, el frío en las sombras. En un paisaje: el calor en la zona focal, el frío en el fondo.

## Los grises más importantes de tu paleta

Los grises son donde la temperatura tiene más impacto, porque los grises no tienen saturación que distraiga.

Un gris cálido (mezcla con ocre o tierra) junto a un azul hace que el azul parezca más frío y más saturado de lo que es.

Un gris frío (mezcla con azul o violeta) junto a un naranja hace que el naranja parezca más cálido y vibrante.

Los grises no son neutrales — son amplificadores de la temperatura de lo que los rodea.

> Si querés que un color parezca más vivo, rodealo de su complementario apagado en temperatura opuesta. La vibración que generan es lo que hace que una pintura parezca que tiene luz propia.

## Ejercicio práctico

Hacé dos estudios de color pequeños (15x15 cm) con la misma composición simple:

**Estudio 1**: paleta completamente cálida. Todos los colores, incluyendo los apagados y los grises, mezclados con algún ocre, amarillo, o tierra.

**Estudio 2**: paleta completamente fría. Todos los colores, incluyendo los apagados y los grises, mezclados con algún azul, violeta, o verde frío.

Comparalos. Esa comparación te enseña más sobre temperatura del color que cualquier explicación teórica.`,
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────

export function getArticulos(): Articulo[] {
  return [...articulos].sort(
    (a, b) =>
      new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
  )
}

export function getArticulo(slug: string): Articulo | undefined {
  return articulos.find((a) => a.slug === slug)
}

export function getArticulosPorCategoria(cat: CategoriaSlug): Articulo[] {
  return getArticulos().filter((a) => a.categoria === cat)
}

export function getArticulosRelacionados(slugs: string[]): Articulo[] {
  return slugs
    .map((slug) => articulos.find((a) => a.slug === slug))
    .filter((a): a is Articulo => a !== undefined)
}

export function getArticulosDestacados(): Articulo[] {
  return getArticulos().filter((a) => a.destacado === true)
}

export function formatFecha(iso: string): string {
  return formatDateUtil(iso)
}
