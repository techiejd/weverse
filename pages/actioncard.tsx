import { NextPage } from "next";

const ComponentActionCard: NextPage = () => {
  return (
    <div className="w-full h-full rounded-2xl bg-white flex flex-col pt-2 px-2 pb-6 box-border items-center justify-start gap-[12px] min-w-[280px] max-w-[433px] max-h-[600px] text-left text-xs text-white font-card-body-text sm:h-full">
      <div className="self-stretch flex-1 flex flex-col items-center justify-start min-h-[200px] max-h-[336px] z-[4]">
        <div className="self-stretch flex-1 rounded-xl flex flex-col items-start justify-start bg-[url('/action-image7@3x.png')] bg-cover bg-no-repeat bg-[top] max-h-[336px]">
          <div className="flex flex-row py-2 px-1 items-start justify-start z-[0]">
            <button className="cursor-pointer [border:none] py-2 px-0 bg-gray-400 rounded-41xl flex flex-row flex-wrap box-border items-start justify-start min-w-[90px] max-w-[393px]">
              <div className="flex flex-row py-0 px-2.5 items-center justify-start gap-[6px]">
                <div className="flex flex-row items-center justify-start max-w-[300px]">
                  <img
                    className="relative w-8 h-[33px] object-cover"
                    alt=""
                    src="/maker-logo5@2x.png"
                  />
                </div>
                <div className="flex flex-row items-center justify-start gap-[4px] max-w-[348px]">
                  <div className="flex flex-row flex-wrap items-center justify-start">
                    <b
                      className="relative text-xs font-bold font-card-body-text text-blue-0 text-left inline-block min-w-[10px] max-w-[260px]"
                      id="Maker name"
                    >
                      Impat maker name
                    </b>
                  </div>
                  <div className="rounded-2xs bg-lightgoldenrodyellow flex flex-col py-0.5 px-1.5 items-start justify-center">
                    <div className="relative text-xs font-card-body-text text-blue-400 text-left inline-block max-w-[185px]">
                      Type of maker
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="self-stretch flex flex-row p-2 items-center justify-between mt-[-54px]">
          <button className="cursor-pointer [border:none] py-1 px-3 bg-white rounded-11xl flex flex-row items-center justify-start gap-[6px]">
            <img
              className="relative w-[9.27px] h-[10.7px]"
              alt=""
              src="/vector13.svg"
            />
            <div className="relative text-xs font-semibold font-card-body-text text-black text-center">
              Medellin
            </div>
          </button>
          <button className="cursor-pointer [border:none] p-0 bg-[transparent] relative w-[34px] h-[34px]">
            <div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-[50%] bg-gray-500" />
            <img
              className="absolute h-[57.83%] w-[66.18%] top-[21.3%] right-[16.91%] bottom-[20.87%] left-[16.91%] max-w-full overflow-hidden max-h-full"
              alt=""
              src="/vector14.svg"
            />
          </button>
        </div>
      </div>
      <div className="self-stretch flex flex-col py-0 px-1 items-start justify-center z-[3]">
        <div className="rounded-xl bg-lightslategray h-[18px] flex flex-row p-2 box-border items-center justify-start">
          <div className="relative">Accion</div>
        </div>
      </div>
      <div className="self-stretch flex flex-row flex-wrap py-0 px-1 items-start justify-start z-[2] text-base text-gray-100 sm:flex-row sm:gap-[8px] sm:items-start sm:justify-start">
        <small
          className="flex-1 relative leading-[24px] font-medium line-clamp-3"
          id="Action card text copy"
        >
          Ayudamos a 150 niños de un colegio de escasos recursos a utilizar
          inteligencia aritificial para cambiarles la vida y todo esto es extra
          que aparece cuando escribo mucho
        </small>
      </div>
      <div className="flex flex-row pt-0 px-0 pb-2 items-center justify-center gap-[26px] z-[1] text-black">
        <img
          className="relative w-[95.75px] h-[16.5px]"
          alt=""
          src="/5-stars-rating6.svg"
        />
        <div className="rounded-2xl bg-aliceblue-200 w-[133px] overflow-hidden shrink-0 flex flex-row p-2.5 box-border items-center justify-between">
          <img
            className="relative w-4 h-4"
            alt=""
            src="/testimonials-icon10.svg"
          />
          <div className="relative leading-[22px] font-medium">
            11 Testimonials
          </div>
        </div>
      </div>
      <button className="cursor-pointer [border:none] py-0 px-2.5 bg-aliceblue-300 w-full rounded-lg h-9 overflow-hidden shrink-0 flex flex-col box-border items-center justify-center max-w-[338px] z-[0] hover:bg-aliceblue-100">
        <div className="relative text-xs leading-[22px] font-medium font-card-body-text text-darkblue text-center inline-block w-[217.32px]">
          Apoyar
        </div>
      </button>
    </div>
  );
};

export default ComponentActionCard;
