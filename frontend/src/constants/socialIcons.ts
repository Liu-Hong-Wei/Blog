import github_icon from "../assets/images/icons/github_icon.svg";
import light_douban_icon from "../assets/images/icons/light_douban_icon.svg";
import light_linkedin_icon from "../assets/images/icons/light_linkedin_icon.svg";
import light_twitter_icon from "../assets/images/icons/light_twitter_icon.svg";
import light_youtube_icon from "../assets/images/icons/light_youtube_icon.svg";
import light_wechat_icon from "../assets/images/icons/light_wechat_icon.svg";
import light_instagram_icon from "../assets/images/icons/light_instagram_icon.svg";
import light_telegram_icon from "../assets/images/icons/light_telegram_icon.svg";
import dark_douban_icon from "../assets/images/icons/dark_douban_icon.svg";
import dark_linkedin_icon from "../assets/images/icons/dark_linkedin_icon.svg";
import dark_twitter_icon from "../assets/images/icons/dark_twitter_icon.svg";
import dark_youtube_icon from "../assets/images/icons/dark_youtube_icon.svg";
import dark_wechat_icon from "../assets/images/icons/dark_wechat_icon.svg";
import dark_instagram_icon from "../assets/images/icons/dark_instagram_icon.svg";
import dark_telegram_icon from "../assets/images/icons/dark_telegram_icon.svg";
import { SocialIconProps } from "../types/types";

export const socialIcons: SocialIconProps[] = [
    {
      platform: 'douban',
      url: 'https://douban.com/',
      lightIcon: light_douban_icon,
      darkIcon: dark_douban_icon,
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/',
      lightIcon: light_instagram_icon,
      darkIcon: dark_instagram_icon,
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/',
      lightIcon: light_linkedin_icon,
      darkIcon: dark_linkedin_icon,
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/',
      lightIcon: light_twitter_icon,
      darkIcon: dark_twitter_icon,
    },
    {
      platform: 'github',
      url: 'https://github.com/',
      lightIcon: github_icon,
      darkIcon: github_icon,
    },
    {
      platform: 'telegram',
      url: 'https://telegram.org/',
      lightIcon: light_telegram_icon,
      darkIcon: dark_telegram_icon,
    },
    {
      platform: 'youtube',
      url: 'https://youtube.com/',
      lightIcon: light_youtube_icon,
      darkIcon: dark_youtube_icon,
    },
    {
      platform: 'wechat',
      url: '#',
      lightIcon: light_wechat_icon,
      darkIcon: dark_wechat_icon,
    },
];