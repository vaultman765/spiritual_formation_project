import { CustomLinkCard, CardImage, CardTitle } from "@/components/cards/BaseCard";
import MeditationJsonLd from "@/components/seo/MeditationJsonLd";

interface MeditationCardProps {
  readonly dayTitle: string;
  readonly subtitle: string;
  readonly imageSrc: string;
  readonly altText: string;
  readonly link: string;
  readonly tag: string;
}

export default function MeditationCard({ dayTitle, subtitle, imageSrc, altText, link, tag }: MeditationCardProps) {
  return (
    <CustomLinkCard link={link}>
      <MeditationJsonLd dayTitle={dayTitle} subtitle={subtitle} imageSrc={imageSrc} altText={altText} link={link} tag={tag} />
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
            imgClassName="card-image aspect-[4/3] w-full h-auto"
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
