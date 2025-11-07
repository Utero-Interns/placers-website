export default function SectionTag({
  text,
  bgColor,
  textColor,
}: {
  text: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <h1
      className={`font-bold w-fit rounded-full
            text-xs py-1 px-4
            sm:text-xs sm:py-1.5 sm:px-5
            md:text-xs md:py-2 md:px-6
            lg:text-xs lg:py-2.5 lg:px-8`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {text}
    </h1>
  );
}