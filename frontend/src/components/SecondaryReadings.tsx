import { Link } from "react-router-dom";
import type { Reading } from "@/utils/types";

interface SecondaryReadingsProps {
  readings: Reading[];
}

export function SecondaryReadings({ readings }: Readonly<SecondaryReadingsProps>) {
  return (
    <ul className="space-y-2">
      {readings.map((reading) => (
        <li key={reading.url ?? reading.title}>
          {reading.url ? (
            <Link to={reading.url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-main)] hover:underline">
              <span className="text-[var(--text-muted)]">
                {reading.title}
                {reading.reference && (
                  <>
                    {" "}
                    – <span className="italic">{reading.reference}</span>
                  </>
                )}
              </span>
            </Link>
          ) : (
            <span className="text-[var(--text-muted)]">
              {reading.title}
              {reading.reference && (
                <>
                  {" "}
                  – <span className="italic">{reading.reference}</span>
                </>
              )}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

interface PrimaryReadingProps {
  title: string;
  reference?: string;
  url?: string;
}

export function PrimaryReading({ title, reference, url }: PrimaryReadingProps) {
  return url ? (
    <Link to={url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-main)] hover:underline">
      <span className="text-lg font-semibold text-[var(--text-light)]">
        {title}
        {reference && (
          <>
            {" "}
            – <span className="italic">{reference}</span>
          </>
        )}
      </span>
    </Link>
  ) : (
    <span className="text-lg font-semibold text-[var(--text-light)]">
      {title}
      {reference && (
        <>
          {" "}
          – <span className="italic">{reference}</span>
        </>
      )}
    </span>
  );
}
