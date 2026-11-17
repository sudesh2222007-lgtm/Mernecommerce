import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-perks">
        <div className="perk">
          <Truck size={20} />
          <div>
            <strong>Free Shipping</strong>
            <p>On orders over ₹2,000</p>
          </div>
        </div>
        <div className="perk">
          <RotateCcw size={20} />
          <div>
            <strong>Easy Returns</strong>
            <p>30-day return window</p>
          </div>
        </div>
        <div className="perk">
          <ShieldCheck size={20} />
          <div>
            <strong>Secure Checkout</strong>
            <p>Your data stays protected</p>
          </div>
        </div>
        <div className="perk">
          <Headphones size={20} />
          <div>
            <strong>24/7 Support</strong>
            <p>We're here to help</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="brand-mini">
          <span className="brand-mark">N</span> NORRA ECOM
        </span>
        <p>© {new Date().getFullYear()} NORRA ECOM · Luxury Maison &amp; Curated Atelier. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
