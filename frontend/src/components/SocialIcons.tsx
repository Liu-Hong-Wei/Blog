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

interface SocialIconProps {
  platform: string;
  url: string;
  lightIcon: string;
  darkIcon: string;
}

function SocialIcon({ platform, url, lightIcon, darkIcon }: SocialIconProps) {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="rounded-full relative w-8 h-8 group">
        <img 
          src={lightIcon}
          alt={`${platform} light`}
          className="absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
        />
        <img 
          src={darkIcon}
          alt={`${platform} dark`}
          className="absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0"
        />
      </div>
    </a>
  );
}

function SocialIcons() {
  const socialIcons = [
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

  return (
    <div className="flex justify-center mb-4 relative" >  
      <ul className="flex space-x-4 border-y-2 border-gray-200 py-2 px-4 w-fit">
        {socialIcons.map((icon) => (
          <li key={icon.platform}>
            <SocialIcon {...icon} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SocialIcons;