export interface NavItem {
  title: string;
  href: string;
  external?: boolean;
}

export const storefrontNavigation: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "Perfumes", href: "/perfumes" },
  { title: "Collections", href: "/collections" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
];



export const adminNavigation: NavItem[] = [
  { title: "Dashboard", href: "/admin" },
  { title: "Products", href: "/admin/products" },
  { title: "Orders", href: "/admin/orders" },
  { title: "Customers", href: "/admin/customers" },
  { title: "Reviews", href: "/admin/reviews" },
  { title: "Inventory", href: "/admin/inventory" },
  { title: "Coupons", href: "/admin/coupons" },
  { title: "Collections", href: "/admin/collections" },
  { title: "Categories", href: "/admin/categories" },
  { title: "Journal", href: "/admin/journal" },
  { title: "Settings", href: "/admin/settings" },
];

export const footerNavigation = {
  shop: [
    { title: "All Fragrances", href: "/perfumes" },
    { title: "New Arrivals", href: "/shop?sort=newest" },
    { title: "Collections", href: "/collections" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Journal", href: "/journal" },
    { title: "Contact", href: "/contact" },
    { title: "FAQ", href: "/faq" },
  ],
  legal: [
    { title: "Shipping & Delivery", href: "/shipping" },
    { title: "Returns & Exchanges", href: "/returns" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
  ],
};
