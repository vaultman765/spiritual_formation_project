import { CustomLinkCard, CardImage, CardTitle } from '@/components/cards/BaseCard';

interface MeditationCardProps {
  dayTitle: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
  link: string;
  tag: string;
}

export default function MeditationCard({
  dayTitle,
  subtitle,
  imageSrc,
  altText,
  link,
  tag,
}: MeditationCardProps) {
  return (
    <CustomLinkCard link={link}>
      <p className="text-xs uppercase text-[var(--text-subtle-heading)] mb-1">{subtitle}</p>
      <CardTitle title={dayTitle} />
      <CardImage imageSrc={imageSrc} altText={altText} />
      {tag && (
        <div className="flex justify-center gap-2">
          <span className="tag-pill-meditation-card">
            {tag}
          </span>
        </div>
      )}
    </CustomLinkCard>
  );
}