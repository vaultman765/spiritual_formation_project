import React from "react";
import { Link } from "react-router-dom";
import type { SecondaryReading } from "@/utils/types";

interface SecondaryReadingsProps {
  readings: SecondaryReading[];
}

export default function SecondaryReadings({ readings }: SecondaryReadingsProps) {
  return (
    <ul className="space-y-2">
      {readings.map((reading, idx) => (
        <li key={idx}>
          {reading.url ? (
            <Link
              to={reading.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-main)] hover:underline"
            >
              <span className="text-[var(--text-muted)]">
                {reading.title}
                {reading.reference && (
                  <> – <span className="italic">{reading.reference}</span></>
                )}
              </span>
            </Link>
          ) : (
            <span className="text-[var(--text-muted)]">
              {reading.title}
              {reading.reference && (
                <> – <span className="italic">{reading.reference}</span></>
              )}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}