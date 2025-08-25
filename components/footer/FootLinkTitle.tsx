interface FootLinkTitleProps {
    text: string;
}

export default function FootLinkTitle({ text }: FootLinkTitleProps) {
    return (
        <h3 
            className="font-semibold text-lg whitespace-nowrap
                       lg:text-xl 
                       2xl:text-[22px]"
        >
            {text}
        </h3>
    );
}