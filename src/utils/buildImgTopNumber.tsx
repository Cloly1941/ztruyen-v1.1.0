// ** Next
import Image from "next/image";

// ** Config
import { CONFIG_IMG } from "@/configs/img";

type TBuildTopNumber = {
    rank?: number;
};

const baseUrl = CONFIG_IMG.TOP_NUMBER;
const file = ".png";

export const buildImgTopNumber = ({ rank }: TBuildTopNumber) => {
    if (!rank && rank !== 0) return null;

    const rawDigits = String(Math.abs(rank)).split("");

    let digits = [...rawDigits];

    if (rawDigits.length === 1 && Number(rawDigits[0]) >= 4) {
        digits = ["0", rawDigits[0]];
    }

    const isSingle = digits.length === 1;

    return (
        <div
            className={
                isSingle
                    ? "absolute top-1/2 sm:-top-2 sm:-z-10 right-0 sm:-left-8 "
                    : "absolute top-1/2 sm:-top-2 sm:-z-10 right-0 sm:-left-9 flex"
            }
        >
            {digits.map((digit, index) => {
                let imgName = digit;

                if (!isSingle && digit === "1") {
                    imgName = "1.1";
                }

                return (
                    <div
                        key={index}
                        className={
                            isSingle
                                ? "relative w-[39px] h-[64px]"
                                : "relative w-[20px] h-[32px]"
                        }
                    >
                        <Image
                            src={`${baseUrl}/${imgName}${file}`}
                            alt={`digit-${digit}`}
                            fill
                        />
                    </div>
                );
            })}
        </div>
    );
};