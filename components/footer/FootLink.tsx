type FootLinkProps = {
    href: string;
    text: string;
};

export default function FootLink({ href, text }: FootLinkProps) {
    return (
        <a className="text-[20px] hover:text-[var(--color-primary)]" href={href}>{text}</a>
    );
}