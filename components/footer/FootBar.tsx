import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import SocialIconLink from "./SocialIconLink";
import FootLinkTitle from "./FootLinkTitle";
import FootLink from "./FootLink";


export default function FootBar() {
    return (
        <footer className="flex flex-col items-center bg-[var(--color-black2)] py-16">
            <div className="flex items-center justify-between w-11/12 mb-11">

                <img 
                    src="/logo-placers-white.png" 
                    alt="" 
                    className="h-48 w-48 m-16"
                />

                <div className="flex flex-col self-start space-y-[18px]">
                    <FootLinkTitle text="SITE MAP" />
                    
                    <FootLink href="/populer" text="Populer" />
                    <FootLink href="/promo" text="Promo" />
                    <FootLink href="/blog" text="Blog" />
                </div>

                <div className="flex flex-col self-start space-y-[18px]">
                    <FootLinkTitle text="FOLLOW US" />

                    <div className="flex space-x-10">
                        <SocialIconLink href="https://www.facebook.com" Icon={Facebook} />
                        <SocialIconLink href="https://www.twitter.com" Icon={Twitter} />
                        <SocialIconLink href="https://www.instagram.com" Icon={Instagram} />
                        <SocialIconLink href="https://www.youtube.com" Icon={Youtube} />
                    </div>
                </div>

                <div className="flex flex-col w-[519px] self-start space-y-[18px]">
                    <FootLinkTitle text="CONTACT US" />

                    <FootLink href="https://uteroindonesia.com/" text="PT. Utero Kreatif Indonesia" />
                    <FootLink href="https://maps.app.goo.gl/rSkKi7UfVtdWgyD99" text="Jalan Bantaran 1 No. 25 Tulusrejo, Kec. Lowokwaru Malang - Jawa Timur, Indonesia | Postal Code  65141" />
                    <FootLink href="" text="+6281 999 900 900 (Wahyu)"/>
                    <FootLink href="" text="+6281 7388 616 (Utero)"/>
                    <FootLink href="mailto:marketingutero@gmail.com" text="marketingutero@gmail.com"/>
                </div>

            </div>
            <hr className="w-11/12"/>
            <div className="flex justify-end w-11/12">
                <p className="mt-[15px] text-[20px]">© 2025 Placers x TCW. All rights reserved</p>
            </div>
        </footer>
    );
}