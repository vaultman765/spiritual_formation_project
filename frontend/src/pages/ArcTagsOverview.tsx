import React, { useEffect, useState } from 'react';

interface Tag {
  name: string;
  category: string;
}

interface ArcTagGroup {
  arc_id: string;
  arc_title: string;
  tags: Tag[];
}

const ArcTagsOverview: React.FC = () => {
  const [arcTags, setArcTags] = useState<ArcTagGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('api/arcs-with-tags/')
      .then(res => res.json())
      .then(data => {
        setArcTags(data as ArcTagGroup[]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch arc tags:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Arc Tags Overview</h1>
      {arcTags.map((arc) => (
        <div key={arc.arc_id} style={{ marginBottom: '2rem' }}>
          <h2>{arc.arc_title}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {arc.tags.map((tag) => (
              <span
                key={tag.name}
                style={{
                  backgroundColor: '#eee',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.9rem',
                }}
              >
                {tag.name} ({tag.category})
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArcTagsOverview;
