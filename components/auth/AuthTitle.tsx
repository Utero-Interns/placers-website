'use state';

import Link from 'next/link';

type AuthTitleProps = {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export default function AuthTitle({ title, description, linkText, linkHref }: AuthTitleProps) {
  return (
    <div className="text-center">
        <h1 className="font-extrabold text-[28px] md:text-[39px] leading-[100%] tracking-normal font-poppins text-red-600">
            {title}
        </h1>
        <p className="text-sm mt-2 text-gray-600">
            {description}{' '}
            <Link href={linkHref} className="text-red-600 font-semibold hover:underline">
            {linkText}
            </Link>
        </p>
    </div>
  );
}