export interface Post {
  id: number;
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