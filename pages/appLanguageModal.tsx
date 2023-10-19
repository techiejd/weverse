import type { NextPage } from "next";

type LanguageModalType = {
  onClose?: () => void;
};

const LanguageModal: NextPage<LanguageModalType> = ({ onClose }) => {
  return (
    <div className="language-selection-modal bg-darkslategray [backdrop-filter:blur(16px)] h-[747px] overflow-y-auto flex flex-col items-center justify-center pt-4 px-4 pb-0 box-border min-w-[320px] max-w-full max-h-full overflow-auto text-left text-sm text-gray-700 font-text-sm-regular">
      <div className="w-full rounded-xl bg-white shadow-[0px_20px_24px_-4px_rgba(16,_24,_40,_0.08),_0px_8px_8px_-4px_rgba(16,_24,_40,_0.03)] h-[692px] overflow-hidden shrink-0 flex flex-col items-start justify-start pt-5 px-4 pb-4 box-border gap-[24px] max-w-[680px]">
        <div className="self-stretch flex flex-col items-end justify-start gap-[16px] text-gray-900">
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
              <div className="rounded-12xl bg-primary-50 w-[297px] flex flex-row items-center justify-center py-1 pr-2.5 pl-1 box-border mix-blend-multiply">
                <div className="flex flex-row items-center justify-center py-0 pr-0 pl-6 mix-blend-normal">
                  <div className="rounded-10xl bg-white w-[163px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
                    <div className="relative leading-[20px] font-semibold">
                      Idioma principal
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-center mix-blend-normal ml-[-6px]">
                  <div className="rounded-10xl w-[143px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
                    <div className="relative leading-[20px] font-medium">
                      Polyglota?
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch relative leading-[20px] text-gray-500">
              Esta será el idioma principal utilizado a travez de toda la
              aplicación.
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-[8px]">
            <input
              className="cursor-pointer flex flex-row items-center justify-center"
              type="radio"
            />
            <div className="relative leading-[20px] font-medium">English</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-[8px]">
            <input
              className="cursor-pointer flex flex-row items-center justify-center"
              type="radio"
            />
            <div className="relative leading-[20px] font-medium">Español</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-[8px]">
            <input
              className="cursor-pointer flex flex-row items-center justify-center"
              type="radio"
            />
            <div className="relative leading-[20px] font-medium">Français</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-[8px]">
            <input
              className="cursor-pointer flex flex-row items-center justify-center"
              type="radio"
            />
            <div className="relative leading-[20px] font-medium">Portugues</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-[8px]">
            <input
              className="cursor-pointer flex flex-row items-center justify-center"
              type="radio"
            />
            <div className="relative leading-[20px] font-medium">Deutsch</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-[8px]">
            <input
              className="cursor-pointer flex flex-row items-center justify-center"
              type="radio"
            />
            <div className="relative leading-[20px] font-medium">
              Nederlands
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-start">
          <div className="flex flex-row items-center justify-start gap-[8px]">
            <input
              className="cursor-pointer flex flex-row items-center justify-center"
              type="radio"
            />
            <div className="relative leading-[20px] font-medium">Polski</div>
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

export default LanguageModal;
