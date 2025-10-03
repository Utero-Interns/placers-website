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
      <Icon 
        className="text-white hover:text-[var(--color-primary)] cursor-pointer transition-colors duration-200
                   h-7 w-7 
                   lg:h-8 lg:w-8 
                   2xl:h-[50px] 2xl:w-[50px]" 
        strokeWidth={1}
      />
    </a>
  );
}