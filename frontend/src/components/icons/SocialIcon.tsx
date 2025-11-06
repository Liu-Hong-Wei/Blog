import type { SocialIconProps } from "../../types/types";

function SocialIcon({ platform, url, lightIcon, darkIcon }: SocialIconProps) {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="rounded-full relative md:w-8 md:h-8 w-6 h-6 group">
        <img 
          src={lightIcon}
          alt={`${platform} light`}
          className="absolute inset-0 w-full h-full util-transition opacity-0 group-hover:opacity-100"
        />
        <img 
          src={darkIcon}
          alt={`${platform} dark`}
          className="absolute inset-0 w-full h-full util-transition opacity-100 group-hover:opacity-0"
        />
      </div>
    </a>
  );
}


export default SocialIcon;