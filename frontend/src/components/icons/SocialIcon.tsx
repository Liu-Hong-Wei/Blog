import type { SocialIconProps } from "../../types/types";

function SocialIcon({ platform, url, icon }: SocialIconProps) {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="rounded-full bg-transparent flex items-center justify-center size-6 md:size-12 m-1">
        <img 
          src={icon}
          alt={`${platform} icon`}
          className="size-6 md:size-12"
        />
      </div>
    </a>
  );
}


export default SocialIcon;