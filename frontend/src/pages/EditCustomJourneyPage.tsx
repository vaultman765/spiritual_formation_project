// components/journey/CustomJourneyEditor.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { useJourney } from '@/context/journeyContext';
import TooltipWrapper from '@/components/common/TooltipWrapper';
import ArcCard from '@/components/journey/ArcCard';
import type { ArcData } from '@/utils/types';

export default function CustomJourneyEditor() {
  const { activeJourney, updateJourney, refreshJourneys } = useJourney();
  const [availableArcs, setAvailableArcs] = useState<ArcData[]>([]);
  const [selectedArcs, setSelectedArcs] = useState<ArcData[]>([]);
  const [title, setTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch arcs
  useEffect(() => {
    fetch('/api/arcs/')
      .then((res) => res.json())
      .then((data) => setAvailableArcs(data));
  }, []);

  // Prefill form with current journey data
  useEffect(() => {
    if (activeJourney) {
      setTitle(activeJourney.title);
      const selected = activeJourney.arc_progress
        .map((arc) => availableArcs.find((a) => a.arc_id === arc.arc_id))
        .filter(Boolean) as ArcData[];
      setSelectedArcs(selected);
    }
  }, [activeJourney, availableArcs]);

  const displayAvailableArcs = availableArcs.filter(
    (arc) =>
      !selectedArcs.some((sel) => sel.arc_id === arc.arc_id) &&
      (
        arc.arc_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arc.card_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
  );

  const handleReorder = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const reordered = [...selectedArcs];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setSelectedArcs(reordered);
  };

  const handleUpdate = async () => {
    if (!activeJourney || selectedArcs.length === 0) return;

    const confirmUpdate = window.confirm(
      'This will reset the progress of your journey. All current arc progress will be lost.\n\nDo you want to continue?'
    );

    if (!confirmUpdate) return;

    try {
      await updateJourney(activeJourney.id, title, selectedArcs.map((arc, index) => ({
        arc_id: arc.arc_id,
        arc_title: arc.arc_title,
        current_day: 1,
        status: index === 0 ? 'in_progress' : 'upcoming',
        order: index,
        day_count: arc.day_count,
      })));

      await refreshJourneys();  // refresh context
      navigate('/my-journey');
    } catch (err) {
      console.error('Failed to update journey:', err);
    }
  };

  return (
    <main className="main-background text-white py-4">
      <div className="text-center mb-6">
        <h1 className="text-5xl font-display font-semibold mb-2">Edit Custom Journey</h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Add, remove, or reorder arcs in your journey.
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Journey Title"
          className="input-style placeholder-white/70"
        />
      </div>

      <hr className="my-6 border-white/20" />

      <div className="grid grid-cols-2 max-w-7xl mx-auto gap-4">
        {/* Left: Available Arcs */}
        <div className="p-4 bg-[var(--bg-card)] border border-white/10 rounded-xl max-h-[65vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-3">Available Arcs</h2>
          <input
            type="text"
            placeholder="Search arcs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-style mb-4 w-full"
          />
          <div className="flex flex-col gap-2">
            {displayAvailableArcs.map((arc) => (
              <div key={arc.arc_id} onClick={() => setSelectedArcs([...selectedArcs, arc])}>
                <TooltipWrapper
                  content={
                    <>
                      <p className="font-bold mb-1">{arc.arc_title}</p>
                      <p className="italic text-sm mb-1 text-gray-300">{arc.primary_reading.join(', ')}</p>
                      <p className="text-sm text-white">{arc.arc_summary}</p>
                    </>
                  }
                >
                  <div className="transition hover:scale-[1.01] hover:ring-2 ring-yellow-400/40 rounded-xl">
                    <ArcCard arc={arc} />
                  </div>
                </TooltipWrapper>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Arcs */}
        <div className="p-4 bg-[var(--bg-card)] border border-white/10 rounded-xl max-h-[65vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-3">Selected Arcs</h2>
          <DragDropContext onDragEnd={handleReorder}>
            <Droppable droppableId="selected-arcs">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2">
                  {selectedArcs.map((arc, index) => (
                    <Draggable draggableId={arc.arc_id} index={index} key={arc.arc_id}>
                      {(provided) => (
                        <div
                          className="relative"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <button
                            onClick={() => setSelectedArcs(selectedArcs.filter((a) => a.arc_id !== arc.arc_id))}
                            className="absolute top-1 right-1 text-red-400 hover:text-red-600 z-10"
                          >
                            ✕
                          </button>
                          <TooltipWrapper content={
                            <>
                              <p className="font-bold mb-1">{arc.arc_title}</p>
                              <p className="italic text-sm mb-1 text-gray-300">{arc.primary_reading.join(', ')}</p>
                              <p className="text-sm text-white">{arc.arc_summary}</p>
                            </>
                          }>
                            <div className="transition hover:scale-[1.01] hover:ring-2 ring-yellow-400/40 rounded-xl">
                              <ArcCard arc={arc} />
                            </div>
                          </TooltipWrapper>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <div className="flex flex-row gap-6 justify-center mt-6">
        <div className="flex justify-center mb-4">
          <button
            onClick={handleUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 px-10 py-4 rounded-xl text-black font-bold shadow-md hover:shadow-lg transition"
          >
            Save Changes
          </button>
        </div>
        <div className="flex justify-center mb-4">
          <button
              onClick={() => navigate('/my-journey')}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-xl text-white font-semibold shadow hover:shadow-lg transition"
          >
              Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
