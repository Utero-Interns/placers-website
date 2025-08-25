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
                  text-sm py-1.5 px-6
                  md:text-base md:py-2 md:px-8
                  2xl:text-lg 2xl:px-12`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {text}
    </h1>
  );
}