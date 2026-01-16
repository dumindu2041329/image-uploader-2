import Link from "next/link";
import { ImageIcon, Github, Twitter, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  { href: "#", label: "GitHub", icon: Github },
  { href: "#", label: "Twitter", icon: Twitter },
  { href: "#", label: "LinkedIn", icon: Linkedin },
  { href: "#", label: "Email", icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30 glass-subtle">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4 group">
              <div className="h-9 w-9 rounded-xl bg-primary shadow-lg shadow-primary/25 flex items-center justify-center transition-transform group-hover:scale-105">
                <ImageIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span>ImageVault</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              A privacy-first image manager that runs entirely in your browser. No servers, no cloud—just you and your images.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
              </li>
              <li>
                <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">Get started</Link>
              </li>
              <li>
                <Link href="/auth/sign-in" className="hover:text-foreground transition-colors">Sign in</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ImageVault. Built with Next.js & Tailwind CSS.
            </p>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Made with ❤️ by Dumindu Damsara.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
