type FootLinkProps = {
    href: string;
    text: string;
};

export default function FootLink({ href, text }: FootLinkProps) {
    return (
        <a 
            className="text-sm text-white leading-relaxed hover:text-[var(--color-primary)] transition-colors duration-200 
                       lg:text-sm 
                       2xl:text-[20px]" 
            href={href}
        >
            {text}
        </a>
    );
}