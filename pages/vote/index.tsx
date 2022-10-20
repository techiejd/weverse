import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { Candidate, Media, VotesRes } from "../../modules/sofia/schemas";
import * as React from "react";

import Cards from "./card";
import Grid from "@mui/material/Grid";

import styles from "../../styles/Home.module.css";

const Challenge: NextPage = () => {
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const [starAllowance, setStarAllowance] = useState<Number>();
  // const voteFetch = async () => {
  //   const response = await fetch(
  //     "http://localhost:3000/api/vote?psid=5813040455394701"
  //   );
  //   const voteInfo = await response.json();
  //   console.log(voteInfo);
  //   setCandidates(voteInfo.candidates);
  // };
  // useEffect(() => {
  //   voteFetch();
  // }, []);
  const info = {
    candidates: [
      {
        message:
          "Problema: Todos los ríos conducen al océano y los …ue todos conducen a nuestro océano.\n\n#WeRaceEmp01",
        id: "737230100931116_787061609281298",
        medias: [
          {
            height: 405,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/309658415_5850673871611435_7480836411348490647_n.jpg?stp=dst-jpg_s720x720&_nc_cat=106&ccb=1-7&_nc_sid=5bac3a&_nc_eui2=AeHCfGNtvVfQWioYLWPXnrtvLxe3lf03togvF7eV_Te2iMhyl3BKkz_WYnqybloYvfM&_nc_ohc=OdSYbJiSxooAX9evPIl&_nc_ht=scontent.feoh1-1.fna&edm=AFuVL-cEAAAA&oh=00_AT8uYAChwPWEcJIdPuQHi510yTfuGpXfE8PdswfvmnY8mg&oe=6355C9E1",
            type: "photo",
          },
          {
            height: 200,
            width: 200,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/309618441_5850673618278127_5724987250226003487_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=5bac3a&_nc_eui2=AeE6fjwJMGnvgggYncEPn45qw_wAsjtnbL_D_ACyO2dsv_mm8fEtcf-E_sAxDX6fOME&_nc_ohc=OW0mW4bP65AAX9WkKG2&_nc_ht=scontent.feoh1-1.fna&edm=AFuVL-cEAAAA&oh=00_AT8WMhT-u9tF_VocaFPXukgdxtjgVzN7-Yf2VXPN7bQ6PA&oe=6355AF62",
            type: "photo",
          },
          {
            height: 206,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/309663983_5850673854944770_455956841320319569_n.jpg?stp=dst-jpg_p206x206&_nc_cat=104&ccb=1-7&_nc_sid=5bac3a&_nc_eui2=AeEhnQCgCBotrNOODD0CmTLxYGEaI1k75flgYRojWTvl-aXrvnlcihAvx-IDaRvrz8I&_nc_ohc=steALjUcITMAX_seJZz&_nc_ht=scontent.feoh1-1.fna&edm=AFuVL-cEAAAA&oh=00_AT_wpLPqTPy5T_d6BE_R16uNGH_hTqU3aRHlfYStBHjDYg&oe=635657F1",
            type: "photo",
          },
          {
            height: 256,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/309708081_5850673834944772_176170653748478393_n.jpg?stp=dst-jpg_s720x720&_nc_cat=102&ccb=1-7&_nc_sid=5bac3a&_nc_eui2=AeEZbM17GnLVX9qjevFDrOSDDAx_VAMott4MDH9UAyi23n6IB56q2ZY9tk2a4Zq-ktk&_nc_ohc=9CeSTgSO6i8AX-70WNt&_nc_ht=scontent.feoh1-1.fna&edm=AFuVL-cEAAAA&oh=00_AT8dlGl71HM2cVc9oDh74wRZjc4S5ulyv5M9RKSWJ0-YUw&oe=63561D78",
            type: "photo",
          },
          {
            height: 720,
            width: 333,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/309882175_5850673938278095_9055270560829967323_n.jpg?stp=cp1_dst-jpg_s720x720&_nc_cat=106&ccb=1-7&_nc_sid=5bac3a&_nc_eui2=AeExfStUVEvKqMISCu3j8tAKatEkeCb-gclq0SR4Jv6ByZKtoheP0qgOL6McyHH9VI4&_nc_ohc=FKyE2A8xjEUAX9BUbXt&_nc_ht=scontent.feoh1-1.fna&edm=AFuVL-cEAAAA&oh=00_AT8tBL39XZrNTG0OgVyBiifhyzmQhShdi_ondE_oBN3lLQ&oe=635679E2",
            type: "photo",
          },
          {
            height: 720,
            width: 333,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/309546878_5850673958278093_5444446887345712546_n.jpg?stp=cp1_dst-jpg_s720x720&_nc_cat=104&ccb=1-7&_nc_sid=5bac3a&_nc_eui2=AeFOTbzCFhtiuvu0kSkFX1FmMhKEfAXS6l4yEoR8BdLqXuaCGqY4Pse4M0Ey_iDOOcA&_nc_ohc=C7FSWVTrLqAAX8DVFRb&_nc_ht=scontent.feoh1-1.fna&edm=AFuVL-cEAAAA&oh=00_AT9-7lCnV-vygaAg-1ulpQj1XWKl3dqQDyFhu7NedFDqUg&oe=63576877",
            type: "photo",
          },
        ],
      },
      {
        message:
          "#weracereporteros @everyone\n\n¡🧞‍♀️Hola, queridos …ace**!\n# ¡Juntos hacemos magia, les deseo éxitos!",
        id: "737230100931116_803498314304294",
        medias: [
          {
            height: 604,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…5gcLzp6jBz5LFbG2pv7FW91l8Sv3ZmQywefHQ&oe=635739AB",
            type: "photo",
          },
          {
            height: 405,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…Xv-Wh3rFlUnCwYJu9axDXxh5AqdnwpA-EN8bg&oe=635717CD",
            type: "photo",
          },
          {
            height: 481,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…e6sKon7n3Y3m_rKOC92mpq2Q7gBkM64BkKdhw&oe=635725CC",
            type: "photo",
          },
          {
            height: 394,
            width: 700,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…q2DWZK-ZA5-7wY6s_3kX4RrKAE5tCy3yfoF3Q&oe=63563915",
            type: "photo",
          },
          {
            height: 360,
            width: 640,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…xqCOLLAupUKH01Eb7UJBLwCrvjwfyJIsdm1FQ&oe=6356A5BC",
            type: "photo",
          },
          {
            height: 405,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…RKrV9E6Ylg60eodFxOF2K4FF59NJRnxSQPLBA&oe=635688C4",
            type: "photo",
          },
          {
            height: 390,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…015VV9JMCjjedbOmwEOwLBrarthu78QfW7sSA&oe=63568E86",
            type: "photo",
          },
          {
            height: 405,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…Xw0SSnqadQg4LbOue6c2i8TwwXMeSEjaf_Pog&oe=6356FDB2",
            type: "photo",
          },
          {
            height: 401,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…WTd_qQ3MWU6Uiqe7wzIE0JMxPsNoHqhCKI_Xg&oe=6356F132",
            type: "photo",
          },
          {
            height: 482,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…4HWWKyr-X8TzN_eudGyl1HJPgqSy6T6UUkxZA&oe=6355820F",
            type: "photo",
          },
          {
            height: 406,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…w6uo8-3sg5OdQwouSVZEmYwL7WRmA7IlnoXFA&oe=63571F0A",
            type: "photo",
          },
          {
            height: 720,
            width: 576,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…KyT6uI2skg23wf2znD7NoJkLTFYrCtSsoAGpQ&oe=63568FCD",
            type: "photo",
          },
        ],
      },
      {
        message:
          "Hola a tod@s a l@s del WeVerse!\nLes quiero compart…para adquirir mas confianza en su propio billete?",
        id: "737230100931116_794918365162289",
        medias: [
          {
            height: 720,
            image:
              "https://external.feoh1-1.fna.fbcdn.net/emg1/v/t13/4968114496153072368?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FT1S4TjPp0Qo%2Fmaxresdefault.jpg&fb_obo=1&utld=ytimg.com&stp=c0.5000x0.5000f_dst-emg0_p720x720_q75&_nc_eui2=AeE0I-YSEa5NN56UMc-EihiL_YkdYyWSWrj9iR1jJZJauCGpfu50CuKgN7-Mhc_kvr4&ccb=13-1&oh=06_AbEdbJvIMKa4ktQ3v6K8YV6X4yO_BepL8O1kOL2njlhRVA&oe=63537496&_nc_sid=6ac203",
            source: "https://www.youtube.com/embed/T1S4TjPp0Qo?autoplay=1",
            type: "share",
            width: 720,
          },
        ],
      },
      {
        message:
          "Hola comunidad de OneWe. \nMi nombre es Yesica Gira…mos a personas que viven del mismo.\n\n#weraceemp01",
        id: "737230100931116_787300919257367",
        medias: [
          {
            height: 720,
            width: 540,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…uE2Mzchnv828FeXpe0TMLybUcQAi_qxLAqwWQ&oe=6356B825",
            type: "photo",
          },
          {
            height: 640,
            width: 352,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t15.5256-…lswAasactjAtqzeY4rTZA0wKT08XwdWKsuC3w&oe=6355F237",
            source:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t42.1790-…u10nZJMzSR44an46uasK5sLyWQf0k-14DpaKQ&oe=6353245F",
            type: "video",
          },
          {
            height: 606,
            width: 719,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…fuxiMzCDimzJwb-tfmndC1kOk0zlI6342ypfw&oe=6356E818",
            type: "photo",
          },
          {
            height: 720,
            width: 377,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…hdGBOgKmuXTaJH8HUf6W4dAqkgGMPbQsnth3A&oe=63572B1C",
            type: "photo",
          },
          {
            height: 640,
            width: 640,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t15.5256-…jaUNumNe-zJHgTBhNZNphTyEAI0z_Y87vLlSg&oe=6356856D",
            source:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.25447…br0zLPjiQ5Plg&oe=63562785&_nc_rid=623836378875736",
            type: "video",
          },
        ],
      },
      {
        message:
          "🧞‍♀️💕¡Buenas tardes WeMembers!\n\nHoy les traigo u…OneWe** para aclarar cualquier duda que tengan.🥰",
        id: "737230100931116_778655173455275",
        medias: [
          {
            height: 720,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…TD7FvCW8gQnd5xAl1Bq2LCwHWTnb1eWfr0-_w&oe=6357579B",
            type: "photo",
          },
        ],
      },
      {
        message:
          "🧞¡Buenos días WeMembers! 🥰\n\n¡Les quería comparti…ención al participar!\n#WeRankEmp01\n#WeRank\n**\n\n**",
        id: "737230100931116_788402342480558",
        medias: [
          {
            height: 405,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t15.5256-…uhaCbJrXW_qV_HaRfQoEO7Qi2F51v160KtHvA&oe=6355CF23",
            type: "video",
          },
          {
            height: 405,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…PrUXYLXbXbOGE1bjTkuSkGF8CG82GVjfdKmew&oe=6355FFB4",
            type: "photo",
          },
          {
            height: 405,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…TpSE2JIAEYiOA8cpQ9zrJm7A4aYbGFJ9VKVCQ&oe=63570F43",
            type: "photo",
          },
        ],
      },
      {
        message:
          "🧞‍♀️ Hola WeMembers!💕\n\n ¡Hace días que no los sa…unidad (likes) serán recompensados acorde a ello!",
        id: "737230100931116_793476488639810",
        medias: [
          {
            height: 720,
            width: 720,
            image:
              "https://external.feoh1-1.fna.fbcdn.net/emg1/v/t13/…URiiyKIXD89PdK8VJo-R6w&oe=6353763E&_nc_sid=af6770",
            source: "https://www.youtube.com/embed/fO9rwFY5s0c?autoplay=1",
            type: "share",
          },
        ],
      },
      {
        message:
          "Hola Comunidad de OneWe🌎! \n\nMi nombre es Zuelly M…día, el cual lo hace más interesante. \n#WePremios",
        id: "737230100931116_798412378146221",
        medias: [
          {
            height: 720,
            width: 540,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…RFZ9OB5hNziueUSLKNFZCSBeKYSas5JRyo-mQ&oe=63570BB8",
            type: "photo",
          },
          {
            height: 720,
            width: 574,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…ax77eV6iFCRf77-_FVWCCvY78ET4RtXskjCBA&oe=6356255E",
            type: "photo",
          },
        ],
      },
      {
        message:
          "🪐 El WeVerse:\nEs un universo de realidad aumentad…eso de millones de personas a nuestra plataforma.",
        id: "737230100931116_786821762638616",
      },
      {
        message:
          "Forme y crecí con un grupo de niños, llevándolos d…res y la cultura de una sociedad sana en deporte.",
        id: "737230100931116_787309202589872",
        medias: [
          {
            height: 540,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…PvhYWTlKE0VeB_ld0Ade8cZN84ZNkmc2U6lMQ&oe=6356A763",
            type: "photo",
          },
        ],
      },
      {
        message:
          "Hola WeFriends\n\nMi nombre es camila y me apasiona …7SxHIY_PWv6hgm6J_TN8SS05pNgscVED-2I&__tn__=*NK-R)",
        id: "737230100931116_787304149257044",
        medias: [
          {
            height: 540,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…2znoUd4t2_Haw2MSiv4LqoFPCPLyGWbF0H90g&oe=63562D6B",
            type: "photo",
          },
          {
            height: 540,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…Xv7Aq-bY4U8kgy8S8ycqFIWwJ5amnqQT15w8w&oe=63559DFD",
            type: "photo",
          },
          {
            height: 720,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…87uTSHBV6WwzaAbJWpptEO6xveKu5AM38xvOg&oe=63574AB7",
            type: "photo",
          },
          {
            height: 406,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…L7bYJAPsbIWEKBaNX8tM__VxQYqAOlXeUpAog&oe=6356D426",
            type: "photo",
          },
          {
            height: 406,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…6UWRkggX2WjqwMK7XTBo0mriJzWzngu-13fnQ&oe=635640A8",
            type: "photo",
          },
          {
            height: 540,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…CSnN8p77fsy4_lbUzTa1SrC7V3m1mJfYf-7WA&oe=6355CAC6",
            type: "photo",
          },
        ],
      },
      {
        message:
          "Hola comunidad OneWe mi nombre es José Manuel Gonz…ial a través de Yoga y Mindfulness.\n\n#weraceemp01",
        id: "737230100931116_787309432589849",
        medias: [
          {
            height: 480,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…ei2EFZti1RL6TCmXInHIk1yLm9BCPClbrvt3Q&oe=6355BA68",
            type: "photo",
          },
        ],
      },
      {
        message:
          "Hola comunidad OneWe mi nombre es Carlos Mario.\nAq… vía para reflexionar sobre la vida.\n#weraceemp01",
        id: "737230100931116_787169125937213",
        medias: [
          {
            height: 480,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…G3a0MRZ-rKezJk5FBJvq1h7R6m1V_ZPAqXsPg&oe=6355939C",
            type: "photo",
          },
        ],
      },
      {
        message:
          "**¿Por qué OneWe?\n**En este momento de nuestra his…e recompensa dentro del **WeVerse\n\n#WeRaceEmp01**",
        id: "737230100931116_786816429305816",
        medias: [
          {
            height: 360,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…qXJZWRVrOjFg0YPJV5qQ0iBHotLH639DCZOdg&oe=6356A1B5",
            type: "photo",
          },
          {
            height: 720,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…7ooLVN4pokFzTigbkTbB0lYwXocBDjpx9I3xg&oe=63573345",
            type: "photo",
          },
          {
            height: 720,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…vdqCLxLv5aVLNaVelFyovC6EZZfvKyeGa4wgg&oe=63562056",
            type: "photo",
          },
        ],
      },
      {
        message:
          "Con alegria quiero aprovechar esta oportunidad par…cuentros, dando click en el link 👇🏻👇🏻👇🏻👇🏻",
        id: "737230100931116_787323232588469",
        medias: [
          {
            height: 476,
            width: 476,
            image:
              "https://scontent.cdninstagram.com/v/t51.2885-15/75…LI5dfIDnLWHlth20480CzOBJzkXi42FKqjGow&oe=635651EB",
            type: "share",
          },
        ],
      },
      {
        message:
          "Hola comunidad de OneWe, mi nombre es Milena Franc…evo generacional. Iragua Ancestral\n\n #weraceemp01",
        id: "737230100931116_787306189256840",
        medias: [
          {
            height: 480,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…IML85sKbc4nrchDtWfQ8KFdqjD3NoK813POiw&oe=6355F684",
            type: "photo",
          },
          {
            height: 720,
            width: 530,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…6TIUD2eQ5WTUuznHHz089IC7ZCNJ5jESNKO9Q&oe=6355C89B",
            type: "photo",
          },
          {
            height: 720,
            width: 540,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…WzwP-nrAsM3e6RxD36T3QqzLsfArIpdr5Hxxw&oe=635617BE",
            type: "photo",
          },
          {
            height: 720,
            width: 540,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…SgpOWI3za-aplNVOLP93mQIHFay1lwsqND39g&oe=63563650",
            type: "photo",
          },
          {
            height: 720,
            width: 576,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…OCgEe7pZWuHnmRvpWVWg1iX--gIVR5E32ESCA&oe=6356D532",
            type: "photo",
          },
          {
            height: 480,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…pMs_xBX7U4jyEHgXNYVHBrz0EgDZP7icv97Dw&oe=63564C35",
            type: "photo",
          },
          {
            height: 480,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…oz0EvNprQ1hGme7FtdSn0Rva_F3u-IQE0CseA&oe=63565DBE",
            type: "photo",
          },
          {
            height: 720,
            width: 480,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…crUKAVM262ITWALm09pHoRsS7oizSPUMFxRGA&oe=63574A15",
            type: "photo",
          },
        ],
      },
      {
        message:
          "¡Hola comunidad OneWe me llamo Yuliana! \nUna de mi…sos de educación básica o media. \n\n#weraceemp01\n\n",
        id: "737230100931116_787278049259654",
        medias: [
          {
            height: 720,
            width: 720,
            image:
              "https://external.feoh1-1.fna.fbcdn.net/emg1/v/t13/…DpTgQ_YPuoLmaJ1SBLchLQ&oe=63531274&_nc_sid=6ac203",
            source: "https://www.youtube.com/embed/t2vge4egjO8?autoplay=1",
            type: "share",
          },
        ],
      },
      {
        message:
          "!Hola!\nPara mí, las experiencias más lindas que he…nómico y compañía para los animales.\n#WeRaceEmp01",
        id: "737230100931116_787298129257646",
        medias: [
          {
            height: 720,
            width: 405,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…AC_Ynoc4_L2gPfg5QNJkQmo9jotom9wkm8nQA&oe=635766BF",
            type: "photo",
          },
          {
            height: 720,
            width: 585,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…PYygZYwlSRxjl-0Z6jYKgcyJA7x8a0svdmRpA&oe=6356E625",
            type: "photo",
          },
          {
            height: 720,
            width: 540,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…4pUx08580BwR3BOZxsuSo_N08rKVEfXw78YrQ&oe=6355F853",
            type: "photo",
          },
          {
            height: 720,
            width: 405,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…UrwQxiWCpD1nJhKMCKkLiXQ18DKccU8Dj_uBg&oe=63565736",
            type: "photo",
          },
          {
            height: 720,
            width: 542,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…6P4JPMh2YSRzTR3WXN7nwGTImUZFqJmq7ticw&oe=63561EA2",
            type: "photo",
          },
        ],
      },
      {
        message:
          "@everyone\nEsta peli está basada en una historia re…thevalley.es/blog/el-nino-domo-viento-innovacion/",
        id: "737230100931116_798408468146612",
        medias: [
          {
            height: 37,
            width: 37,
            image:
              "https://external.feoh1-1.fna.fbcdn.net/emg1/v/t13/…Xu0XNtdH6PruOGcK_KLkIA&oe=635309C5&_nc_sid=6ac203",
            type: "share",
          },
        ],
      },
      {
        message:
          "🧞¡Hola WeMembers! 🥰\nLes quería contar de parte d…nes!🤣\n\nNospi en breve! @everyone\n\nAquí va el mío",
        id: "737230100931116_798386521482140",
        medias: [
          {
            height: 720,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…_NWKv3Z1E1I4LqUPcqzqjC9bVvuP74GxEg5jw&oe=63557F8B",
            type: "photo",
          },
        ],
      },
      {
        message:
          "Hola comunidad 🍃 \n\nMi nombre es Zuelly Martinez,s…preocuparnos por un estrato social.\n\n#weraceemp01",
        id: "737230100931116_787304749256984",
        medias: [
          {
            height: 720,
            width: 424,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…kLmOnbDKtjHrFc-cEWHG0Q9KsO1AeU7Ka7p4A&oe=6355FB68",
            type: "photo",
          },
          {
            height: 720,
            width: 405,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…z-hZxWdrO_kjFOshwWLOf6zO_lIb2dzC0JEdQ&oe=63576870",
            type: "photo",
          },
          {
            height: 720,
            width: 333,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…Gvv328_mJSBVPrxl0TT3koHaO8gg2aL--Yp2w&oe=635729AE",
            type: "photo",
          },
          {
            height: 720,
            width: 333,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…DQIZAgowUkXPK8kMbpDzokvS_evUaX9_76t_w&oe=6356F3D0",
            type: "photo",
          },
        ],
      },
      {
        message:
          "Hola comunidad👋 mi nombre es Leidy Tatiana Jarami…tos, juegos y cuentos.\n.\n.\n.  \n#weraceemp01\n\n🙌👋",
        id: "737230100931116_787306685923457",
        medias: [
          {
            height: 381,
            width: 720,
            image:
              "https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808…cIzMylavqCc74sdComGaXnh3cXZjF2tITWgzw&oe=635595CD",
            type: "photo",
          },
        ],
      },
      {
        message:
          "Hola Wemembers¡¡¡\nLes quiero compartir lo que viví…da propia. Donde el límite depende de nosotros.\n\n",
        id: "737230100931116_795933595060766",
        medias: [
          {
            height: 720,
            width: 720,
            image:
              "https://external.feoh1-1.fna.fbcdn.net/emg1/v/t13/…URiiyKIXD89PdK8VJo-R6w&oe=6353763E&_nc_sid=af6770",
            source: "https://www.youtube.com/embed/fO9rwFY5s0c?autoplay=1",
            type: "share",
          },
        ],
      },
    ],
    psid: 5813040455394701,
    starAllowance: 5,
  };
  useEffect(() => {
    setCandidates(info.candidates);
    setStarAllowance(info.starAllowance);
  }, []);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {candidates ? (
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {candidates.map((can) => (
              <Grid xs={8}>
                <Cards
                  key={can.id}
                  candidate={can}
                  starAllowance={starAllowance}
                  setStarAllowance={setStarAllowance}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>loading...</>
        )}
      </main>
    </div>
  );
};

export default Challenge;
