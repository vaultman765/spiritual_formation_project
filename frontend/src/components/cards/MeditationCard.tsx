import { CustomLinkCard, CardImage, CardTitle } from "@/components/cards/BaseCard";

interface MeditationCardProps {
  dayTitle: string;
  subtitle: string;
  imageSrc: string;
  altText: string;
  link: string;
  tag: string;
}

export default function MeditationCard({ dayTitle, subtitle, imageSrc, altText, link, tag }: MeditationCardProps) {
  return (
    <CustomLinkCard link={link}>
      <div className="flex flex-col h-full">
        <div>
          <p className="text-xs uppercase text-[var(--text-subtle-heading)] mb-1">{subtitle}</p>
          <CardTitle title={dayTitle} />
        </div>
        <div className="flex-grow flex justify-center items-center my-3">
          <CardImage
            imageSrc={imageSrc}
            altText={altText}
            divClassName="flex justify-center w-full"
            imgClassName="card-image max-h-[320px] object-contain"
          />
        </div>
        {tag && (
          <div className="pt-2 flex justify-center">
            <span className="tag-pill-meditation-card">{tag}</span>
          </div>
        )}
      </div>
    </CustomLinkCard>
  );
}
