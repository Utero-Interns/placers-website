type SocialIconLinkProps = {
  href: string;
  Icon: React.ElementType;
};

export default function SocialIconLink({ href, Icon }: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon size={50} className=" text-white hover:text-[var(--color-primary)] cursor-pointer" strokeWidth={1}/>
    </a>
  );
}
