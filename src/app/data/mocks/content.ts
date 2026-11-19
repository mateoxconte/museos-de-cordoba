import { News, Museum, Edition } from "../models/content";
export const normalize = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export const cities = [
  "Córdoba capital",
  "Alta Gracia",
  "Río Cuarto",
  "Villa María",
];
export const types = [
  "Arte",
  "Ciencias naturales",
  "Historia",
  "Arte contemporáneo",
  "Cerámica",
];
export const news: News[] = [
  {
    slug: "nueva-mirada-arte-cordobes",
    title: "Una nueva mirada al arte cordobés",
    category: "Exposiciones",
    date: "12 de marzo de 2026",
    image: "palacio",
    intro:
      "Un recorrido por las obras, los espacios y las historias que nos invitan a mirar de nuevo.",
    body: [
      "La luz atraviesa los patios y descubre nuevas formas de encontrarnos con el arte. Esta exposición de ejemplo reúne pinturas, esculturas y miradas de distintas generaciones de artistas cordobeses.",
      "El recorrido propone detenerse en los detalles: los colores de un paisaje, la textura de una obra y las preguntas que cada pieza despierta. Las salas dialogan con la arquitectura del museo para construir una experiencia cercana.",
      "La propuesta incluye momentos de conversación y espacios para descubrir las obras a tu propio ritmo. Esta nota forma parte de la demo: la programación y sus datos son ilustrativos.",
    ],
  },
  {
    slug: "muestra-en-familia",
    title: "Una muestra para recorrer en familia",
    category: "Actividades",
    date: "10 de marzo de 2026",
    image: "familia",
    intro:
      "La curiosidad no tiene edad: una invitación a descubrir el mundo natural juntos.",
    body: [
      "Un fósil, una pregunta y una historia por descubrir. La propuesta de ejemplo acerca las ciencias naturales a grandes y chicos a través de un recorrido compartido.",
      "Las estaciones invitan a observar, imaginar y conversar sobre los seres que habitaron nuestro territorio. Un paseo pensado para que cada visitante encuentre algo que lo sorprenda.",
      "Los contenidos y actividades que se presentan son ilustrativos y no constituyen una agenda real.",
    ],
  },
  {
    slug: "patrimonio-vivo-interior",
    title: "Patrimonio vivo en el interior",
    category: "Patrimonio",
    date: "8 de marzo de 2026",
    image: "estancia",
    intro:
      "Los paisajes y edificios que guardan la memoria de nuestra provincia.",
    body: [
      "Cada pueblo conserva historias que merecen ser contadas. Los museos del interior ofrecen una puerta a las memorias de sus comunidades y al patrimonio que las une.",
      "Esta crónica de ejemplo recorre patios, archivos y objetos cotidianos que ayudan a comprender cómo se transformó la vida en Córdoba.",
      "Una invitación a viajar con otra mirada y a conocer el valor de los espacios culturales cercanos.",
    ],
  },
  {
    slug: "piezas-originarias",
    title: "Piezas originarias vuelven a exhibirse en Córdoba",
    category: "Patrimonio",
    date: "5 de marzo de 2026",
    image: "ceramica",
    intro:
      "La memoria de nuestros territorios, contada a través de sus objetos.",
    body: [
      "Las formas y los diseños de la cerámica permiten acercarnos a las historias de quienes habitaron estas tierras. Esta muestra ilustrativa invita a observar ese legado con respeto y curiosidad.",
      "El recorrido reúne materiales de ejemplo y propone reflexionar sobre el cuidado del patrimonio y la importancia de su contexto.",
    ],
  },
  {
    slug: "cincuenta-anos",
    title: "Un museo cordobés celebra sus 50 años",
    category: "Actividades",
    date: "1 de marzo de 2026",
    image: "regional",
    intro:
      "Un encuentro para celebrar las historias que construimos en comunidad.",
    body: [
      "Un museo también es la memoria de quienes lo visitan y lo cuidan. Esta celebración de ejemplo reúne relatos, fotografías y recuerdos de distintas generaciones.",
      "La propuesta imagina una jornada de puertas abiertas para volver a encontrarnos con nuestro patrimonio.",
    ],
  },
  {
    slug: "arte-contemporaneo",
    title: "Arte contemporáneo con sello cordobés",
    category: "Exposiciones",
    date: "26 de febrero de 2026",
    image: "arte",
    intro: "Nuevas voces y otras maneras de mirar nuestro presente.",
    body: [
      "Las salas se convierten en un espacio de encuentro entre artistas y visitantes. Esta exposición de ejemplo reúne obras que exploran el color, la forma y la vida cotidiana.",
      "La selección invita a construir interpretaciones propias y a conversar sobre las preguntas que nos atraviesan.",
    ],
  },
];
export const museums: Museum[] = [
  {
    slug: "arte-del-palacio",
    name: "Museo de Arte del Palacio",
    city: "Córdoba capital",
    type: "Arte",
    image: "palacio",
    description:
      "Patios luminosos, arquitectura histórica y una colección que invita a recorrer distintas miradas del arte cordobés.",
    address: "Av. del Patrimonio 100",
    hours: "Martes a domingo, de 10 a 18 h",
    contact: "Consultas en recepción",
    orientation:
      "Recorrido en planta baja. Consultá las condiciones de accesibilidad antes de la visita.",
  },
  {
    slug: "ciencias-naturales",
    name: "Museo de Ciencias Naturales",
    city: "Alta Gracia",
    type: "Ciencias naturales",
    image: "dinosaurio",
    description:
      "Un viaje por la diversidad natural de Córdoba, con fósiles y relatos para despertar la curiosidad de toda la familia.",
    address: "Calle de las Ciencias 250",
    hours: "Martes a domingo, de 9 a 17 h",
    contact: "Información en el ingreso del museo",
    orientation:
      "Visita estimada: 60 minutos. Espacios de descanso durante el recorrido.",
  },
  {
    slug: "museo-estancia",
    name: "Museo de la Estancia",
    city: "Río Cuarto",
    type: "Historia",
    image: "estancia",
    description:
      "Un lugar para descubrir la historia rural y los paisajes que forman parte de la identidad de nuestra provincia.",
    address: "Camino de la Estancia s/n",
    hours: "Miércoles a domingo, de 10 a 17 h",
    contact: "Consultas en la recepción",
    orientation:
      "Incluye un recorrido al aire libre. Se sugiere calzado cómodo.",
  },
  {
    slug: "arte-contemporaneo",
    name: "Museo de Arte Contemporáneo",
    city: "Villa María",
    type: "Arte contemporáneo",
    image: "arte",
    description:
      "Nuevas formas, materiales y perspectivas en un espacio abierto al arte de nuestro tiempo.",
    address: "Paseo de las Artes 80",
    hours: "Martes a sábado, de 11 a 19 h",
    contact: "Información en recepción",
    orientation: "Recorrido interior. Visita estimada: 45 minutos.",
  },
  {
    slug: "historico-regional",
    name: "Museo Histórico Regional",
    city: "Alta Gracia",
    type: "Historia",
    image: "regional",
    description:
      "Objetos, documentos y memorias que cuentan las transformaciones de la vida cotidiana en la región.",
    address: "Calle de la Memoria 45",
    hours: "Martes a domingo, de 10 a 18 h",
    contact: "Consultas en el ingreso",
    orientation:
      "Patio central y salas históricas. Consultá por acceso sin escalones.",
  },
  {
    slug: "ceramica",
    name: "Museo de Cerámica",
    city: "Córdoba capital",
    type: "Cerámica",
    image: "ceramica",
    description:
      "Un encuentro con la materia, el oficio y las tradiciones de la cerámica a través de piezas de distintas épocas.",
    address: "Pasaje de los Artesanos 30",
    hours: "Miércoles a domingo, de 10 a 18 h",
    contact: "Información en recepción",
    orientation: "Salas interiores. Se recomienda una visita de 40 minutos.",
  },
];
export const edition: Edition = {
  title: "Novedades de los museos",
  label: "Edición de ejemplo · Marzo 2026",
  intro:
    "Un momento para descubrir, una invitación a visitar. Acercamos el arte y la memoria de Córdoba a tu lectura.",
  editorial:
    "A veces, un paseo empieza con una pregunta. ¿Qué historias se esconden detrás de una puerta, una pieza o un cuadro? En esta edición te invitamos a mirar de cerca y a encontrar tu próximo recorrido cultural. Este texto editorial está escrito para el boletín y muestra que también puede incluir contenidos propios, además de noticias del portal.",
  newsSlugs: ["nueva-mirada-arte-cordobes", "muestra-en-familia"],
};
