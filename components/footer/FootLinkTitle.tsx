interface FootLinkTitleProps {
    text: string;
}

export default function FootLinkTitle({ text }: FootLinkTitleProps) {
    return (
        <h3 
            className="font-semibold text-white text-lg whitespace-nowrap
                       lg:text-lg 
                       2xl:text-[22px]"
        >
            {text}
        </h3>
    );
}