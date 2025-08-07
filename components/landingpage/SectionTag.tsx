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
      className={`text-lg font-bold py-2 px-12 w-fit rounded-full`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {text}
    </h1>
  );
}
