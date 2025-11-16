import douban from '../assets/icons/douban.svg';
import github from '../assets/icons/github.svg';
import instagram from '../assets/icons/instagram.svg';
import linkedin from '../assets/icons/linkedin.svg';
import telegram from '../assets/icons/telegram.svg';
import twitter from '../assets/icons/twitter.svg';
import wechat from '../assets/icons/wechat.svg';
import youtube from '../assets/icons/youtube.svg';
import type { SocialIconProps } from '../types/types';

export const socialIcons: SocialIconProps[] = [
  {
    platform: 'douban',
    url: 'https://douban.com/',
    icon: douban,
  },
  {
    platform: 'instagram',
    url: 'https://instagram.com/',
    icon: instagram,
  },
  {
    platform: 'linkedin',
    url: 'https://linkedin.com/in/',
    icon: linkedin,
  },
  {
    platform: 'twitter',
    url: 'https://twitter.com/',
    icon: twitter,
  },
  {
    platform: 'github',
    url: 'https://github.com/',
    icon: github,
  },
  {
    platform: 'telegram',
    url: 'https://telegram.org/',
    icon: telegram,
  },
  {
    platform: 'youtube',
    url: 'https://youtube.com/',
    icon: youtube,
  },
  {
    platform: 'wechat',
    url: '#',
    icon: wechat,
  },
];
