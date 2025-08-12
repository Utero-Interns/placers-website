type FootLinkProps = {
    href: string;
    text: string;
};

export default function FootLink({ href, text }: FootLinkProps) {
    return (
        <a 
            className="text-base leading-relaxed hover:text-[var(--color-primary)] transition-colors duration-200 
                       lg:text-lg 
                       2xl:text-[20px]" 
            href={href}
        >
            {text}
        </a>
    );
}