import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import SocialIconLink from "./SocialIconLink";
import FootLinkTitle from "./FootLinkTitle";
import FootLink from "./FootLink";
import Image from "next/image";

export default function FootBar() {
    return (
        <footer className="flex flex-col items-center bg-[var(--color-black2)] text-white px-6 py-10 2xl:py-16">
            <div className="flex w-full flex-col gap-12 mb-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8 2xl:w-11/12 2xl:items-center 2xl:mb-11">

                {/* Logo hanya tampil di desktop */}
                <Image
                    src="/logo-placers-white.png"
                    alt="Placers Logo"
                    className="hidden lg:block h-24 w-24 mx-auto lg:mx-0 lg:my-auto lg:h-32 lg:w-32 2xl:h-48 2xl:w-48"
                />

                {/* Site Map */}
                <div className="flex flex-col self-start space-y-4">
                    <FootLinkTitle text="SITE MAP" />
                    <FootLink href="/promo" text="Promo" />
                    <FootLink href="/blog" text="Blog" />
                </div>

                {/* Social Media */}
                <div className="flex flex-col self-start space-y-4">
                    <FootLinkTitle text="FOLLOW US" />
                    <div className="flex space-x-6">
                        <SocialIconLink href="https://www.facebook.com/uteroadvertisingindonesia" Icon={Facebook} />
                        <SocialIconLink href="https://x.com/utero_indonesia" Icon={Twitter} />
                        <SocialIconLink href="https://instagram.com/uteroindonesia" Icon={Instagram} />
                        <SocialIconLink href="https://www.youtube.com/channel/UCkdJC5Tw0bk0xK9sUR80xnA" Icon={Youtube} />
                    </div>
                </div>

                {/* Contact */}
                <div className="flex w-full flex-col self-start space-y-3 lg:w-[380px]">
                    <FootLinkTitle text="CONTACT" />
                    <FootLink href="https://uteroindonesia.com/" text="PT. Utero Kreatif Indonesia" />
                    <FootLink
                        href="https://maps.app.goo.gl/rSkKi7UfVtdWgyD99"
                        text="Jalan Bantaran I No. 25, Tulusrejo, Kec. Lowokwaru, Malang - Jawa Timur, Indonesia | Postal Code 65141"
                    />
                    <FootLink href="" text="+6281 999 900 900 (Wahyu)" />
                    <FootLink href="" text="+6281 7388 616 (Utero)" />
                    <FootLink href="mailto:marketingutero@gmail.com" text="marketingutero@gmail.com" />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="flex w-11/12 items-center border-t border-gray-700 pt-6 justify-between">
                {/* Logo hanya tampil di mobile */}
                <Image
                    src="/logo-placers-white.png"
                    alt="Placers Logo"
                    className="h-8 w-8 lg:hidden"
                />

                <p className="text-white text-xs lg:text-sm text-right w-full">
                    © 2025 Placers x TCW. All rights reserved
                </p>
            </div>
        </footer>
    );
}