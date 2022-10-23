/* eslint-disable @next/next/no-img-element */
// TODO(jimenez1917): look into next Image for optimization.
import type { NextPage } from "next";
import React from "react";
import aboutUsStyle from "./../styles/aboutUs.module.css";

const AboutUs: NextPage = () => {
  return (
    <div className={aboutUsStyle.aboutUs}>
      <nav className={aboutUsStyle.nav}>
        <img className={aboutUsStyle.logo} src="/Icon.png" alt="logo" />
        <h1 className={aboutUsStyle.title}>OneWe Networks LLC</h1>
      </nav>
      <div className={aboutUsStyle.Banner}>
        <h2 className={aboutUsStyle.BannerH2}>ONEWE NETWORKS LLC </h2>
      </div>
      <div className={aboutUsStyle.header}></div>
      <div className={aboutUsStyle.markdiv}>
        <p className={aboutUsStyle.markdivPsubBanner}>
          {`"Systems were made for men, and not men for systems, and the interest
          of man which is self-development, is above all systems, whether
          theological, political or economic."`}
          <br />
          <br />- C. H. Douglas
        </p>
      </div>
      <main>
        <section className={aboutUsStyle.first}>
          <h3 className={aboutUsStyle.seccionP}>
            Aunque OneWe Networks LLC es completamente virtual, fue registrado
            en Delaware en septiembre del 2022.
          </h3>
          <hr className={aboutUsStyle.hr} />
          <div className={aboutUsStyle.twoColumns}>
            <div>
              <img className={aboutUsStyle.img} src="/iStock-1214656143.jpg" />
            </div>
            <div>
              <p className={aboutUsStyle.mision}>NUESTRA MISIÓN EMPRESARIAL</p>
              <p className={aboutUsStyle.seccionParrafo}>
                En OneWe nuestra misión crear tecnología y herramientas para la
                autonomía y el desarrollo comunitario desde la educación y las
                redes sociales.
              </p>
            </div>
          </div>
          <div className={aboutUsStyle.twoColumns}>
            <div>
              <img className={aboutUsStyle.img} src="/iStock-1224265287.jpg" />
              <p className={aboutUsStyle.mision}>QUIENES SON LOS CLIENTES</p>
              <p className={aboutUsStyle.seccionParrafo}>
                Nuestros clientes son comunidades de todo el mundo
              </p>
            </div>
            <div>
              <div className={aboutUsStyle.twitter}>
                <blockquote className="twitter-tweet">
                  <p lang="en" dir="ltr">
                    Decentralization doesn&#39;t mean an absence of leaders, but
                    an abundance of them.
                  </p>
                  &mdash; Balaji Srinivasan (@balajis){" "}
                  <a href="https://twitter.com/balajis/status/1405383009558155265?ref_src=twsrc%5Etfw">
                    June 17, 2021
                  </a>
                </blockquote>{" "}
                <script
                  async
                  src="https://platform.twitter.com/widgets.js"
                  charSet="utf-8"
                ></script>
              </div>
              <p className={aboutUsStyle.mision}>LA FILOSOFÍA DE ONEWE</p>
              <p className={aboutUsStyle.seccionPFilosofia}>
                Descentralizado es siempre mejor que centralizado.
                <br />
                <br /> La comunidad es una forma comprobada desde tiempos
                milenarios de organización de las personas.
                <br />
                <br /> Creemos que las comunidades son esencialmente buenas.
                <br />
                <br /> Creemos que cada comunidad tiene algo que aportar.
                <br />
                <br />
                Creemos que un entorno abierto y honesto puede sacar lo mejor de
                las comunidades.
                <br /> <br />
                Reconocemos y respetamos a cada comunidad como única.
                <br />
                <br /> El capitalismo se puede y debe usar para el bienestar de
                todos.
                <br />
              </p>
            </div>
          </div>
        </section>
        <section className={aboutUsStyle.second}>
          <hr className={aboutUsStyle.hr} />
          <p className={aboutUsStyle.serviciosP}>PRODUCTOS Y SERVICIOS</p>
          <div className={aboutUsStyle.markdiv}>
            <p className={aboutUsStyle.markdivP}>
              Ofrecemos herramientas capitalistas centradas en la comunidad, un
              camino flexible y una red para implementar el capitalismo comunal.
            </p>
          </div>
          <div className={aboutUsStyle.threeColumns}>
            <div>
              <img
                className={aboutUsStyle.imgOn3}
                src="/iStock-935705246.jpg"
              />
              <p className={aboutUsStyle.mision}>BLOCKCHAIN</p>
              <p className={aboutUsStyle.seccionPThreeColumns}>
                Para permitir la cooperación y desarrollo descentralizado
                captando el valor del impacto social e innovación.
              </p>
            </div>
            <div>
              <img
                className={aboutUsStyle.imgOn3}
                src="/iStock-1188009561-1.jpg"
              />
              <p className={aboutUsStyle.mision}>
                CONTRATOS
                <br /> INTELIGENTES
              </p>
              <p className={aboutUsStyle.seccionPThreeColumns}>
                Crear apoyo mutuo. Permitiendo la toma de decisiones más
                ecuánimes para todos.
              </p>
            </div>
            <div>
              <img
                className={aboutUsStyle.imgOn3}
                src="/iStock-667434682.jpg"
              />
              <p className={aboutUsStyle.mision}>
                USTEDES A CADA
                <br /> PASO
              </p>
              <p className={aboutUsStyle.seccionPThreeColumns}>
                Escuchamos sus necesidades y les ayudamos a integrar nuestras
                herramientas para la toma de decisiones.
              </p>
            </div>
          </div>
        </section>
        <hr className={aboutUsStyle.hr} />
        <section className={aboutUsStyle.first}>
          <div className={aboutUsStyle.twoColumns}>
            <div>
              <img className={aboutUsStyle.imgFundador} src="/JD.jpeg" />
            </div>
            <div>
              <p className={aboutUsStyle.mision}>Co-Fundador</p>
              <p className={aboutUsStyle.seccionParrafo}>
                Hola, soy Juan David (JD), cofundador de OneWe. Después de
                trabajar en Google durante 5 años en Mountain View y Tokio,
                decidí ingresar al espacio del desarrollo comunitario.
                <br />
                <br />
                Soy apasionado por las tecnologías innovadoras de alto impacto
                social.
                <br />
                <br />
                Cuando no estoy trabajando en OneWe, me puedes encontrar en una
                academia de baile, en un intercambio de idiomas, en los espacios
                para juegos de mesa, un museo o un parque.
                <br />
                <br />
                En general, me encanta el contacto con las personas y compartir,
                discutir y ejecutar ideas que transforman nuestro mundo en un
                lugar más chimba.
              </p>
            </div>
          </div>
          <div className={aboutUsStyle.twoColumns}>
            <div>
              <p className={aboutUsStyle.mision}>Co-Fundador</p>
              <p className={aboutUsStyle.seccionParrafo}>
                Hola, soy Nicolas Martinez, cofundador de OneWe soy un
                emprendedor colombiano en los campos de la tecnología y el
                impacto social.
                <br />
                <br />
                He cultivado mi experiencia en desarrollo comunitario por medio
                de la educación, el comercio y la tecnología a través de
                colaborar con distintas startups de alto impacto social.
                <br />
                <br />
                Mi experiencia más reciente fue como director de crecimiento en
                Somos Internet, una startup de telecomunicaciones (YC W21), que
                trabaja para hacer del internet de alta velocidad y calidad un
                recurso accesible para todas las personas sin importar su
                estrato o capacidad económica.
                <br />
                <br />A partir del éxito de Somos, me di cuenta del potencial
                que tiene la tecnología cuando se usa de manera eficiente y con
                el enfoque correcto.
              </p>
            </div>
            <div>
              <img className={aboutUsStyle.imgFundador} src="/Nico.jpeg" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
