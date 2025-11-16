import SocialIcon from './icons/SocialIcon';
import Selfie from '../assets/images/Me-in-the-Forbidden-Palace.png';
import { socialIcons } from '../constants/socialIcons';

function ProfileCardContent({
  className,
  profileSize,
}: {
  className?: string;
  profileSize?: string;
}) {
  const imgSize = profileSize ? profileSize : 'max-w-[240px]';

  return (
    <div className={className}>
      <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-bgsecondary/90 p-8 backdrop-blur-md util-transition">
        {/* profile image */}
        <div className={`mx-auto my-6 aspect-square w-full ${imgSize} select-none`}>
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
        <div className="relative mb-6 flex w-full justify-center">
          <ul className="flex w-fit rounded-xl px-8 py-3 util-transition-colors">
            {socialIcons.map(icon => (
              <li key={icon.platform}>
                <SocialIcon {...icon} />
              </li>
            ))}
          </ul>
        </div>
        {/* introduction */}
        <div className="w-full max-w-lg space-y-2.5 px-4">
          <p className="text-center text-lg leading-relaxed font-medium text-primary">
            👋 Hi there! I&apos;m <span className="font-bold text-secondary">Liu Hongwei</span>
          </p>
          <p className="text-center text-lg leading-relaxed font-medium text-primary">
            🎓 Currently studying at <span className="font-bold text-secondary">CUC</span>
          </p>
          <p className="text-center text-lg leading-relaxed font-medium text-primary">
            📚 Passionate about <span className="font-bold text-secondary">learning</span>
          </p>
          <p className="text-center text-lg leading-relaxed font-medium text-primary">
            💻 <span className="font-bold text-secondary">Self-taught</span> developer
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ className }: { className?: string; profileSize?: string }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
    const card = e.currentTarget;
    card.style.setProperty('--rotate-y', '0deg');
    card.style.setProperty('--rotate-x', '0deg');
  };

  return (
    <div
      className={`m-2 flex min-h-[calc(50vh-200px)] w-full items-center justify-center util-transition-colors ${className}`}
    >
      <div
        className="perspective-800 relative w-full max-w-xl [transform:perspective(800px)_rotateY(var(--rotate-y,0deg))_rotateX(var(--rotate-x,0deg))] cursor-pointer rounded-2xl util-transition ease-out transform--3d"
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
