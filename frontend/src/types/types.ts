import type { ReactNode } from 'react';

export interface Post {
  id: number;
  tldr: string | null;
  views: number;
  title: string;
  content: string;
  //TODO: content_format: 'md' | 'mdx';
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

export interface Idea {
  id: number;
  content: string;
  images: string[];
  created_at: string;
  updated_at: string;
  is_published: boolean;
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
  icon: string;
}

export interface NavButtonProps {
  onClick?: () => void;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  className?: string;
  to?: string;
  ariaLabel: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  children: ReactNode;
}
