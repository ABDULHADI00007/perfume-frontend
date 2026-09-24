export interface NavLink {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
}

export interface NavGroup {
  label?: string;
  items: NavLink[];
}
