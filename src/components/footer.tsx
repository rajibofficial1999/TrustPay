import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "";

const Footer = () => {
  return (
    <div className="container">
      <div className="flex justify-between items-center py-10 flex-col md:flex-row gap-3">
        <p className="text-foreground/80">© 2024 {appName}</p>
        <ul className="flex items-center gap-3">
          <li>
            <Link className="font-semibold text-foreground/90" href="/about-us">
              About us
            </Link>
          </li>
          <li>
            <Link
              className="font-semibold text-foreground/90"
              href="/help-center"
            >
              Help Center
            </Link>
          </li>
          <li>
            <Link className="font-semibold text-foreground/90" href="/terms">
              Terms
            </Link>
          </li>
          <li>
            <Link
              className="font-semibold text-foreground/90"
              href="/privacy-policy"
            >
              Privacy
            </Link>
          </li>
        </ul>

        <ul className="flex items-center gap-2">
          <li>
            <a
              href="https://x.com/home"
              target="_blank"
              className="size-10 rounded-full flex justify-center items-center bg-white shadow-md"
            >
              <Twitter className="size-4" />
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com"
              target="_blank"
              className="size-10 rounded-full flex justify-center items-center bg-white shadow-md"
            >
              <Instagram className="size-4" />
            </a>
          </li>
          <li>
            <a
              href="https://facebook.com"
              target="_blank"
              className="size-10 rounded-full flex justify-center items-center bg-white shadow-md"
            >
              <Facebook className="size-4" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
