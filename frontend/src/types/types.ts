import { ReactNode } from "react";

export interface Post {
  id: number;
  tldr: string | null;
  views: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  slug: string;
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface About {
  id: number;
  title: string;
  content: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface SocialIconProps {
  platform: string;
  url: string;
  lightIcon: string;
  darkIcon: string;
}


export interface NavButtonProps {
  onClick?: () => void;
  className?: string;
  to?: string;
  ariaLabel: string;
  children: ReactNode;
};

export interface NavBarProps {
  setDrawerOpen: (open: boolean) => void;
  drawerVisible: boolean;
  drawerActive: boolean;
}
