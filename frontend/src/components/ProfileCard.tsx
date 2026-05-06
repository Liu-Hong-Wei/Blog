import { useEffect, useState } from 'react';

import SocialIcon from './icons/SocialIcon';
import Selfie from '../assets/images/Me-in-the-Forbidden-Palace.png';
import { socialIcons } from '../constants/socialIcons';
import { isMobileDevice } from '../utils/isMobile';

function ProfileCardContent({
  className,
  profileSize,
}: {
  className?: string;
  profileSize?: string;
}) {
  const imgSize = profileSize ? profileSize : 'max-w-[160px]';

  return (
    <div className={className}>
      <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-bgsecondary/80 p-5 backdrop-blur-md util-transition md:p-6">
        {/* profile image */}
        <div className={`mx-auto my-3 aspect-square w-full ${imgSize} select-none md:my-4`}>
          <img
            src={Selfie}
            alt="me in the forbidden palace"
            className="h-full w-full rounded-full object-cover util-transition"
            loading="lazy"
            onContextMenu={e => e.preventDefault()}
            draggable="false"
          />
        </div>
        {/* social icons */}
        <div className="relative mb-3 flex w-full justify-center md:mb-4">
          <ul className="flex w-fit rounded-xl px-4 py-1.5 util-transition-colors md:px-6 md:py-2">
            {socialIcons.map(icon => (
              <li key={icon.platform}>
                <SocialIcon {...icon} />
              </li>
            ))}
          </ul>
        </div>
        {/* introduction */}
        <div className="w-full max-w-lg space-y-1.5 px-2 md:space-y-2 md:px-4">
          <p className="text-center text-sm leading-relaxed font-medium text-primary md:text-base">
            👋 Hi there! I&apos;m <span className="font-bold text-secondary">Liu Hongwei</span>
          </p>
          <p className="text-center text-sm leading-relaxed font-medium text-primary md:text-base">
            🎓 Currently studying at <span className="font-bold text-secondary">CUC</span>
          </p>
          <p className="text-center text-sm leading-relaxed font-medium text-primary md:text-base">
            📚 Passionate about <span className="font-bold text-secondary">learning</span>
          </p>
          <p className="text-center text-sm leading-relaxed font-medium text-primary md:text-base">
            💻 <span className="font-bold text-secondary">Self-taught</span> developer
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const percentX = (x - centerX) / centerX;
    const percentY = -((y - centerY) / centerY);
    card.style.setProperty('--rotate-y', `${percentX * 3}deg`);
    card.style.setProperty('--rotate-x', `${percentY * 3}deg`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) return;
    const card = e.currentTarget;
    card.style.setProperty('--rotate-y', '0deg');
    card.style.setProperty('--rotate-x', '0deg');
  };

  if (compact) {
    return (
      <div
        className={`m-2 flex w-full items-center justify-center util-transition-colors ${className}`}
      >
        <div
          className={`perspective-800 relative w-full max-w-xl ${!isMobile ? '[transform:perspective(800px)_rotateY(var(--rotate-y,0deg))_rotateX(var(--rotate-x,0deg))] cursor-pointer' : ''} transform--3d rounded-2xl util-transition ease-out`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative z-10 size-full [transform:translateZ(50px)]">
            <ProfileCardContent profileSize="max-w-[140px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`m-2 flex min-h-[calc(50vh-200px)] w-full items-center justify-center util-transition-colors ${className}`}
    >
      <div
        className={`perspective-800 relative w-full max-w-xl ${!isMobile ? '[transform:perspective(800px)_rotateY(var(--rotate-y,0deg))_rotateX(var(--rotate-x,0deg))] cursor-pointer' : ''} transform--3d rounded-2xl util-transition ease-out`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative z-10 size-full [transform:translateZ(50px)]">
          <ProfileCardContent />
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
