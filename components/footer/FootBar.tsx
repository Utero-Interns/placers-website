import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import SocialIconLink from "./SocialIconLink";
import FootLinkTitle from "./FootLinkTitle";
import FootLink from "./FootLink";


export default function FootBar() {
    return (

        <footer className="flex flex-col items-center bg-[var(--color-black2)] px-6 py-10 2xl:py-16">

            <div className="flex w-full flex-col gap-12 mb-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8 2xl:w-11/12 2xl:items-center 2xl:mb-11">

                <img 
                    src="/logo-placers-white.png" 
                    alt="Placers Logo" 
                    className="h-24 w-24 self-center lg:h-32 lg:w-32 lg:self-start 2xl:h-48 2xl:w-48 2xl:m-16"
                />

                <div className="flex flex-col self-start space-y-[18px]">
                    <FootLinkTitle text="SITE MAP" />
                    
                    <FootLink href="/populer" text="Populer" />
                    <FootLink href="/promo" text="Promo" />
                    <FootLink href="/blog" text="Blog" />
                </div>

                <div className="flex flex-col self-start space-y-[18px]">
                    <FootLinkTitle text="FOLLOW US" />

                    <div className="flex space-x-8 2xl:space-x-10">
                        <SocialIconLink href="https://www.facebook.com" Icon={Facebook} />
                        <SocialIconLink href="https://www.twitter.com" Icon={Twitter} />
                        <SocialIconLink href="https://www.instagram.com" Icon={Instagram} />
                        <SocialIconLink href="https://www.youtube.com" Icon={Youtube} />
                    </div>
                </div>

                <div className="flex w-full flex-col self-start space-y-[18px] lg:w-auto 2xl:w-[519px]">
                    <FootLinkTitle text="CONTACT US" />

                    <FootLink href="https://uteroindonesia.com/" text="PT. Utero Kreatif Indonesia" />
                    <FootLink href="https://maps.app.goo.gl/rSkKi7UfVtdWgyD99" text="Jalan Bantaran 1 No. 25 Tulusrejo, Kec. Lowokwaru Malang - Jawa Timur, Indonesia | Postal Code  65141" />
                    <FootLink href="" text="+6281 999 900 900 (Wahyu)"/>
                    <FootLink href="" text="+6281 7388 616 (Utero)"/>
                    <FootLink href="mailto:marketingutero@gmail.com" text="marketingutero@gmail.com"/>
                </div>

            </div>

            <div className="flex w-11/12 flex-col items-center border-t border-gray-700 pt-6 2xl:items-end">
                {/* Font size is now responsive, starting smaller (text-sm) and scaling up to the original size (2xl:text-[20px]). */}
                <p className="text-center text-sm lg:text-base 2xl:text-[20px] 2xl:text-right">
                    © 2025 Placers x TCW. All rights reserved
                </p>
            </div>
        </footer>
    );
}