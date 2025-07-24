import { CustomLinkCard, CustomOnClickCard, CardImage, CardTitle } from '@/components/cards/BaseCard';
import { formatTagLabel } from '@/utils/tagDisplay';
import type { ArcData } from "@/utils/types";

interface ArcCardProps {
  arc: ArcData;
  onClick?: () => void;
}

interface ArcTagProps {
  cardTags: string[];
  divClassName?: string;
  spanClassName?: string;
}

interface ArcProgressSingleItem {
  arc_id: string;
  arc_title: string;
  day_count: number;
  current_day?: number;
  status: 'completed' | 'in_progress' | 'upcoming' | 'skipped';
}

export function ArcCardTags({
  cardTags,
  divClassName = 'tag-div-arc-card',
  spanClassName = 'tag-pill-arc-card'
}: ArcTagProps) {
  return (
    <div className={divClassName}>
      {cardTags.map((tag) => (
        <span
          key={tag}
          className={spanClassName}
        >
          {formatTagLabel(tag)}
        </span>
      ))}
    </div>
  );
}

export function DetailArcCard({ arc }: ArcCardProps) {
  return (
    <CustomLinkCard
      key={arc.arc_id}
      link={`/arcs/${arc.arc_id}`}
    >
      <CardTitle title={arc.arc_title} />
      <CardImage
        imageSrc={`/images/arc_whole/${arc.arc_id}.jpg`}
        altText={arc.arc_title}
        divClassName="!mb-0 card-image-container"
        imgClassName="h-70 card-image"
      />
      <div className="text-sm text-[var(--text-subtle-heading)]">
        {arc.day_count}-day arc
      </div>
      <ArcCardTags cardTags={arc.card_tags} />
    </CustomLinkCard>
  );
}

export function CustomJourneyArcCard({
  arc,
  onClick
}: ArcCardProps) {
  return (
    <CustomOnClickCard
      onClick={onClick ?? (() => {})}
      className="cursor-pointer rounded-lg bg-purple-800 hover:bg-purple-700 border border-yellow-400/70 p-4 shadow transition-colors transition-transform duration-150 hover:scale-[1.02]"
    >
      <CardTitle title={arc.arc_title} />
      <p className="text-sm text-violet-300 italic mb-2">{arc.day_count}-day arc</p>
      <ArcCardTags cardTags={arc.card_tags} divClassName="!justify-start tag-div-arc-card" />
    </CustomOnClickCard>
  );
}

export function JourneyArcCard({
  arc_id,
  arc_title,
  day_count,
  current_day,
  status
}: ArcProgressSingleItem) {
  let cardStyle = '';
  let statusLabel = '';

  switch (status) {
    case 'completed':
      cardStyle = 'bg-green-800/20 border-green-400';
      statusLabel = `✅ Completed (${day_count} days)`;
      break;
    case 'in_progress':
      cardStyle = 'bg-yellow-800/20 border-yellow-400';
      statusLabel = `🔄 In progress - Day ${current_day} of ${day_count}`;
      break;
    case 'upcoming':
      cardStyle = 'bg-blue-800/20 border-blue-400';
      statusLabel = `🔜 Upcoming (${day_count} days)`;
      break;
    case 'skipped':
      cardStyle = 'bg-red-800/20 border-red-400 text-red-100 italic';
      statusLabel = `⏭️ Skipped`;
      break;
  }

  return (
    <CustomLinkCard
      key={arc_id}
      link={`/arcs/${arc_id}`}
      className='!no-underline'
    >
      <div className={`rounded p-4 shadow border ${cardStyle}`}>
        <CardTitle title={arc_title} className="!text-base card-title" />
        <div className="text-sm text-[var(--text-muted)]">{statusLabel}</div>
      </div>
    </CustomLinkCard>
  );
}