import type { NextPage } from "next";

type LanguageModalMultilanguageType = {
  onClose?: () => void;
};

const LanguageModalMultilanguage: NextPage<LanguageModalMultilanguageType> = ({
  onClose,
}) => {
  return (
    <div className="language-selection-modal bg-darkslategray [backdrop-filter:blur(16px)] h-[828px] overflow-y-auto flex flex-col items-center justify-center pt-4 px-4 pb-0 box-border min-w-[320px] max-w-full max-h-full overflow-auto text-left text-sm text-gray-900 font-text-sm-regular">
      <div className="w-full rounded-xl bg-white shadow-[0px_20px_24px_-4px_rgba(16,_24,_40,_0.08),_0px_8px_8px_-4px_rgba(16,_24,_40,_0.03)] h-[727px] overflow-hidden shrink-0 flex flex-col items-start justify-start pt-5 px-4 pb-4 box-border gap-[24px] max-w-[680px]">
        <div className="self-stretch flex flex-col items-end justify-start gap-[16px]">
          <button
            className="cursor-pointer p-0 bg-primary-100 relative rounded-9xl box-border w-14 h-14 border-[8px] border-solid border-primary-50"
            onClick={onClose}
          >
            <img
              className="absolute top-[calc(50%_-_16px)] left-[calc(50%_-_16px)] w-6 h-6 overflow-hidden"
              alt=""
              src="/close-icon.svg"
            />
          </button>
          <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
            <div className="self-stretch relative text-lg leading-[28px] font-semibold">
              Escoge tu idioma
            </div>
            <div className="self-stretch flex flex-col items-center justify-center p-2.5 text-center text-primary-700">
              <div className="rounded-12xl bg-primary-50 flex flex-row items-center justify-center p-1 mix-blend-multiply">
                <button className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-center mix-blend-normal">
                  <div className="rounded-10xl w-[143px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
                    <div className="relative text-sm leading-[20px] font-medium font-text-sm-regular text-primary-700 text-center">
                      Idioma principal
                    </div>
                  </div>
                </button>
                <div className="flex flex-row items-center justify-center mix-blend-normal ml-[-6px]">
                  <div className="rounded-10xl bg-white flex flex-row items-center justify-center py-2.5 px-8">
                    <div className="relative leading-[20px] font-semibold">
                      Polyglota?
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch relative leading-[20px] text-gray-500">
              Puedes ver el contenido de nuestra comunidad en diferentes idiomas
              al mismo tiempo manteniendo el idioma principal de tu aplicación.
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-[24px] text-gray-700">
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-start gap-[8px]">
              <input
                className="flex flex-row items-center justify-center"
                type="checkbox"
              />
              <div className="relative leading-[20px] font-medium">English</div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-start gap-[8px]">
              <input
                className="flex flex-row items-center justify-center"
                type="checkbox"
              />
              <div className="relative leading-[20px] font-medium">Español</div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-start gap-[8px]">
              <input
                className="flex flex-row items-center justify-center"
                type="checkbox"
              />
              <div className="relative leading-[20px] font-medium">
                Français
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-start gap-[8px]">
              <input
                className="flex flex-row items-center justify-center"
                type="checkbox"
              />
              <div className="relative leading-[20px] font-medium">
                Portugues
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-start gap-[8px]">
              <input
                className="flex flex-row items-center justify-center"
                type="checkbox"
              />
              <div className="relative leading-[20px] font-medium">Deutsch</div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-start gap-[8px]">
              <input
                className="flex flex-row items-center justify-center"
                type="checkbox"
              />
              <div className="relative leading-[20px] font-medium">
                Nederlands
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-start gap-[8px]">
              <input
                className="flex flex-row items-center justify-center"
                type="checkbox"
              />
              <div className="relative leading-[20px] font-medium">Polski</div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
          <div className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch rounded-lg flex flex-row items-start justify-start">
            <button className="cursor-pointer py-2.5 px-[18px] bg-primary-600 flex-1 rounded-lg shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] overflow-hidden flex flex-row items-center justify-center border-[1px] border-solid border-primary-600">
              <div className="relative text-base leading-[24px] font-semibold font-text-sm-regular text-white text-left">
                Guardar
              </div>
            </button>
          </div>
          <button className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch rounded-lg flex flex-row items-start justify-start">
            <div className="flex-1 rounded-lg bg-white shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] overflow-hidden flex flex-row items-center justify-center py-2.5 px-[18px] border-[1px] border-solid border-gray-300">
              <div className="relative text-base leading-[24px] font-semibold font-text-sm-regular text-gray-700 text-left">
                Anular
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageModalMultilanguage;
