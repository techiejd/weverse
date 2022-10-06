import * as schemas from '../../schemas';
import * as ejs from 'ejs';
import * as path from 'path';
import {makeButtonMessage, GroupHandler,
  getFlattenedPaginatedData} from '../../utils';
import {OneWePrivateConversationHandler} from
  './../oneWePrivateConversationHandler';
import {getUserSnapshot} from '../../../../common/db';
import { logger } from '../../../../common/logger';
import type { NextApiRequest, NextApiResponse } from 'next';

// Colombia is GMT-05:00 and month starts by 0
export const since = new Date(2022, 8, 27, 15);
// export const until = new Date(2022, 8, 29, 0);

export const makeJuryRoomFor =
(psid:string) : schemas.MessengerMessage => makeButtonMessage(
    `Ingresa a la sala del jurado a través de este botón.`,
    [{title: `A votar`, url: 'https://onewe.tech/vote?psid=' + psid}]);

export const learnAbout : schemas.MessengerMessage = makeButtonMessage(
    'Hola ya empezó #WeRaceEmp01',
    [
      {title: 'Linea de tiempo ⌛', url: 'https://youtu.be/xaq6A6Fdy8A'},
      {title: 'Primer Misión! 👀', url: 'https://youtu.be/YKsNFFRlvf0'},
      {title: 'Publicar Ya 📷', url: 'https://www.facebook.com/groups/737230100931116'},
    ]
);

/*
const posts = [
  // José - 1
  `En mi comunidad soy profesor de yoga y meditación para beneficio de \
todos los seres sintientes.`,
  `Hago parte de la organización de dislalicos unidos para la región \
Caribe, con el propósito de generar conciencia del correcto uno de la \
letra "R"`,
  // Leydi - 3
  `Apoyé a comunidades Embera Chami del municipio de Andes en la construcción \
de la escuela de lenguas en la que ellos nos enseñaban su lengua y nosotros ( \
Área artística de Medellín en ese momento) la lengua del español.`,
  `Participé como voluntaria por más de 6 meses junto a una amiga en la \
creación del espacio artístico ( teatro y manualidades) con los niños de \
Antorchas de vida, un orfanato de la ciudad de Medellín, culminando el \
aprendizaje con una bella obra de teatro en Diciembre donde resimbolizamos \
junto con ellos lo que era una familia y el verdadero espíritu de la amistad \
y el amor.`,
  // JD - 1
  `Enseñe ingles en el SENA como voluntariado.`,
  `Cuidé un río durante cuatro años monitoreando y reportando indicadores de \
contaminación.`,
  // Devon - 2
  `Hago un producto que facilita la terapia psicodélica. Por ejemplo, \
los veteranos ucranianos diagnosticados con PTSD de la guerra actual`,
  `Cofundé una organización sin fines de lucro que ayuda a miles de \
personas a aprender idiomas`,
  // Sol - 2
  `He compartido servicio de recreación en dibujo, pintura y juegos en \
el pabellón de pediatría en el hospital general y en el pabellón de \
quemados en san Vicente de Paul con una fundación cristiana. `,
  `He sido voluntaria en la fundación Juguemos en el Bosque apadrinando \
niños de bajos recursos en días de recreación en el parque norte. `,
  // Nico - 2
  `Apadrinar como mentor una familia desplazada por la violencia y \
acompañarlos a vender en la calle, conseguir trabajo, apartamento y \
estabilizarse económicamente y desarrollar inteligencia emocional para \
administrar mejor su patrimonio.`,
  `Trabajar con el cónsul de Dubai y un emprendedor caficultor para activar \
la economía de el corregimiento de palmitas, dando como resultado lá compra a \
un precio mucho más justo de la producción de café y sus subproductos que \
antes se desaprovechan, además de  incentivar la producción orgánica en la \
región ya que era requisito, lo que mejoro la calidad de vida de los \
agricultores, trajo especies nativas nuevamente a repoblar he impulso el \
turismo ecológico.`,
  // Zuelly - 1
  `Con mi familia compramos utiles escolares y regalamos estos elementos a \
niños de bajos recursos `,
  `Durante mi jornadas labores regale medicamentos que no cubría la eps  a \
pacientes con  alteraciones respiratorias y con poca facilidad económica.`,
  // Cristian - 2
  `He acompañado a empresas y emprendedores en el proceso de conceptualización \
de marca y estructuración de planes estratégicos para logro de objetivos.`,
  `He acompañado a las personas a construir marca personal, ayudándolos a \
encontrar y consolidar su vocación y misión de vida.`,
  // Carlos - 3
  `Lleve a un mochilero hasta un pueblo y le ayude para que se comunicará \
con su familia.`,
  `Realice un taller para niños en el barrio de Manrrique.`,
  // Camila - 3
  `Cree en mi anterior empleo un estándar de evaluación de accesibilidad \
web, lo cual impacta positivamente las personas con algún tipo de \
discapacidad cognitiva a acceder a la web, en este caso a las páginas \
de las secretarias de tránsito del país.`,
  `Todas las navidades en la empresa familiar hacemos novenas con los \
niños de escasos recursos de la zona y les damos regalos y merienda el 24.`,
  // Anelim - 3
  `Busco dignificar el proceso del tejido en comunidades como la de \
Aguadas Caldas y su sombrero Aguadeño buscando no solo un valor agregado \
sino innovación y relevo generacional. Iragua Ancestral`,
  `hago parte de una red de Mujeresqueviajan&Emprenden que pretende \
potencializar la independencia de la mujer por medio de charlas talleres, \
ferias y viajes.`,
  // David - 2
  `Lideré un proyecto de Hockey Sobre Patines para llevar a los niños \
de bajos recursos a poder disciplinarse con el deporte y obtener los \
valores por medio de este.`,
  `De la mano del Colegio Alemán prepare a 20 estudiantes para poder \
realizar sus estudios en Alemania.`,
  // Yuliana - 2
  `Participe en el diseño de los módulos para Bachillerato digital \
gratuito, por la gobernación de Antioquia secretaría de educación \
departamental, enfocado en las personas que por diferentes motivos han \
tenido que suspender sus procesos de educación básica o media.`,
  `Dicté un taller en el Hormiguero colectivo cultural a niños del \
territorio de reutilización de botellas plástico en la creación de macetas,\
 se plantaron varias suculentas y se les orientó el cuidado y riego.`,
  // Andrea - 3
  `Trabaje como representante de víctimas, con asesorías de orientación y \
acompañamiento legal por delitos de violencia intrafamiliar.`,
  `Apoye a una fundación con la recolección de implementos de aseo, ropa, \
juguetes, y realizando múltiples actividades de juego y recreación a niños \
de escasos recursos dentro de la cuidad.`,
  // Yesica - 2
  `Brindar acompañamiento y atención a personas de la tercera edad que \
estuvieron mal de salud y necesitaban el cuidado absoluto (bañar, vestir, \
cambiar pañal, ayudarlos a mover de lugar, darles de comer, etc).`,
  ` Liderar un proyecto ambiental para fomentar la limpieza y cuidado de \
los espacios públicos con Jornadas de recolección de basura y separación de \
residuos que aportamos al grupo de reciclaje del municipio.`,
];
*/

const parsePostForVotingInfo = async (post: schemas.Post) => {
  let medias : Array<{
    height: number | undefined;
    width: number | undefined;
    image: string | undefined;
    source: string | undefined;
    type: string;
}> | undefined = undefined;
  if (post.attachments) {
    const attachment2MediaObject = (a: Record<string, unknown>) => {
      const attachment = schemas.attachment.parse(a);
      return {
        height: attachment.media?.image?.height,
        width: attachment.media?.image?.width,
        image: attachment.media?.image?.src,
        source: attachment.media?.source,
        type: attachment.type,
      };
    };
    if (post.attachments.data[0] && post.attachments.data[0].subattachments) {
      medias =
    (await getFlattenedPaginatedData(
        post.attachments.data[0].subattachments))
        .map(attachment2MediaObject);
    } else {
      medias = (await getFlattenedPaginatedData(post.attachments))
          .map(attachment2MediaObject);
    }
  }
  return {
    message: post.message,
    id: post.id,
    medias: medias,
  };
};

const shuffle = (array: Array<any>) => {
  let currentIndex = array.length; let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

// TODO(techiejd): Move to pages.
export function vote(
  req: NextApiRequest,
  res: NextApiResponse
) {
      logger.info({query: req.query}, 'vote req query');
      getUserSnapshot(String(req.query.psid)).then(async (userSnapshot) => {
        const posts = (await
        GroupHandler.getWeVersePosts(userSnapshot.data().token,
            since, undefined, 'all')).filter((post) =>
          post.id != '737230100931116_778655173455275' &&
          post.id != '737230100931116_786821762638616');
        shuffle(posts);
        const candidates = await Promise.all(
            posts.map(parsePostForVotingInfo));
        ejs.renderFile(
            path.join(__dirname, '../../../views/vote.ejs'),
            {
              candidates: candidates,
              starAllowance: 5,
              psid: req.query.psid,
            },
            (err, string) => {
              if (err) {
                logger.error({error: err}, 'Error in rendering vote.');
                res.send(
                    `Hola hubo un error, por favor contactar \
support@onewe.foundation`);
                return;
              }
              res.send(string);
            });
      });
    };

export const requestJuryRoom = (params: Record<string, any>) => {
  const convoHandler = new OneWePrivateConversationHandler(
      params.senderId);
  convoHandler.send(makeJuryRoomFor(params.senderId));
};

// TODO(techiejd): Move to pages.
export function submit(
  req: NextApiRequest,
  res: NextApiResponse
) {
      const psid = String(req.query.psid);
      getUserSnapshot(psid).then(async (userSnapshot) => {
        const candidateIdsToVoteAmounts = Object.entries(req.body)
            .reduce((filtered: Array<[string, number]>,
                formCandidateInfoTuple: [string, unknown]
            /** ['candidate-id', 'numVotes'] */) => {
              const numVotes = Number(formCandidateInfoTuple[1]);
              if ( numVotes > 0) {
                const candidateId =
            formCandidateInfoTuple[0].replace('candidate-', '');
                filtered.push([candidateId, numVotes]);
              }
              return filtered;
            }, new Array<[string, number]>());
        userSnapshot.ref.update({
          ['challenges.bB3EYkEY9oOm2w2Yk6Iu.votes']:
          Object.fromEntries(candidateIdsToVoteAmounts),
        });

        const posts = await
        GroupHandler.getWeVersePosts(userSnapshot.data().token,
            since, undefined, 'all');
        const voteTable =
        candidateIdsToVoteAmounts.map((idToVoteAmount: [string, number])=>{
          const post = posts.find((post) => post.id == idToVoteAmount[0]);
          return {
            message: post?.message?.slice(0, 150),
            votesGiven: idToVoteAmount[1],
          };
        });
        ejs.renderFile(
            path.join(__dirname, '../../../views/submitVote.ejs'),
            {voteTable: voteTable},
            (err, string) => {
              if (err) {
                logger.error({error: err}, 'Error in submitting vote.');
                res.send(
                    `Hola hubo un error, por favor contactar \
support@onewe.foundation`);
                return;
              }
              res.send(string);
            });
        new OneWePrivateConversationHandler(psid).send({text: '👏 Votaste!'});
      });
    };
