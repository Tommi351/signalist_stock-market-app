import Link from "next/link";

const FooterLink = ({text, linkText, href}: FooterLinkProps) => {
    return (
        <div>
           <div className="text-center pt-4">
             <p className="text-sm text-gray-500">
                 {text} {` `}
                 <Link href={href} className="footer-link">
                     {linkText}
                 </Link>
             </p>
           </div>
        </div>
    )
}
export default FooterLink
