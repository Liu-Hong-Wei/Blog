import type { SocialIconProps } from '../../types/types';

function SocialIcon({ platform, url, icon }: SocialIconProps) {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="m-0.5 flex size-5 items-center justify-center rounded-full bg-transparent md:size-6">
        <img src={icon} alt={`${platform} icon`} className="size-5 md:size-6" />
      </div>
    </a>
  );
}

export default SocialIcon;
