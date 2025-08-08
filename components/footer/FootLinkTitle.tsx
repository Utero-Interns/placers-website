interface FootLinkTitleProps {
    text: string;
}

export default function FootLinkTitle({ text }: FootLinkTitleProps) {
    return (
        <h1 className="font-semibold text-[22px]">{text}</h1>
    );
}