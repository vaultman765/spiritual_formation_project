import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import TooltipWrapper from '@/components/common/TooltipWrapper';
import type { ArcData } from '@/utils/types';
import ArcCard from '@/components/journey/ArcCard';
import { useJourney } from '@/context/journeyContext';

export default function CreateCustomJourneyPage() {
  const [availableArcs, setAvailableArcs] = useState<ArcData[]>([]);
  const [selectedArcs, setSelectedArcs] = useState<ArcData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { createJourney } = useJourney();
  const { journey } = useJourney();

  useEffect(() => {
    fetch('/api/arcs/')
      .then((res) => res.json())
      .then((data) => setAvailableArcs(data));
  }, []);

  const displayAvailableArcs = availableArcs.filter(
    (arc) =>
      !selectedArcs.some((selected) => selected.arc_id === arc.arc_id) &&
      (
        arc.arc_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        arc.card_tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
  );

  const handleSelectedReorder = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const reordered = [...selectedArcs];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setSelectedArcs(reordered);
  };

  const handleSave = async () => {
    if (!title || selectedArcs.length === 0) return;
    if (journey) {
      const confirmed = window.confirm("You already have a journey. Create a new one and overwrite?");
      if (!confirmed) return;
    }

    const arc_progress = selectedArcs.map((arc, index) => ({
      arcId: arc.arc_id,
      arcTitle: arc.arc_title,
      dayCount: arc.day_count,
      status: (index === 0 ? 'in_progress' : 'upcoming') as 'in_progress' | 'upcoming',
      currentDay: 1,
    }));

    await createJourney(title, arc_progress);
    navigate('/my-journey');
  };

  return (
    <main className="main-background text-white py-12 px-6">
      <h1 className="text-4xl font-display font-semibold text-center mb-2">
        Create a Custom Journey
      </h1>
      <p className="text-center text-lg text-[var(--text-muted)] mb-8">
        Select and reorder arcs to build a mental prayer journey tailored to your needs.
      </p>

      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Journey Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded text-black"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {/* Available Arcs */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Arcs</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Available Arcs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded text-black"
            />
          </div>
          <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto pr-2">
            {displayAvailableArcs.map((arc) => (
              <div
                key={arc.arc_id}
                onClick={() => setSelectedArcs([...selectedArcs, arc])}
                className="cursor-pointer"
              >
                <TooltipWrapper
                  content={
                    <>
                      <p className="font-bold mb-1">{arc.arc_title}</p>
                      <p className="italic text-sm mb-1 text-gray-300">{arc.primary_reading.join(', ')}</p>
                      <p className="text-sm text-white">{arc.arc_summary}</p>
                    </>
                  }
                >
                  <ArcCard arc={arc} />
                </TooltipWrapper>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Arcs with drag-to-reorder */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Selected Arcs (Drag to Reorder)</h2>
          <DragDropContext onDragEnd={handleSelectedReorder}>
            <Droppable droppableId="selected-arcs">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-4 min-h-[65vh] bg-purple-900/30 p-4 rounded"
                >
                  {selectedArcs.map((arc, index) => (
                    <Draggable draggableId={arc.arc_id} index={index} key={arc.arc_id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative"
                        >
                          {/* Remove button */}
                          <button
                            onClick={() =>
                              setSelectedArcs(
                                selectedArcs.filter((a) => a.arc_id !== arc.arc_id)
                              )
                            }
                            className="absolute top-1 right-1 text-sm text-red-400 hover:text-red-600 z-10"
                          >
                            ✕
                          </button>
                          <TooltipWrapper
                            content={
                              <>
                                <p className="font-bold mb-1">{arc.arc_title}</p>
                                <p className="italic text-sm mb-1 text-gray-300">{arc.primary_reading.join(', ')}</p>
                                <p className="text-sm text-white">{arc.arc_summary}</p>
                              </>
                            }
                          >
                            <ArcCard arc={arc} />
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

      <div className="text-center mt-10">
        <button
          onClick={handleSave}
          className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded font-bold text-black"
        >
          Save Journey
        </button>
      </div>
    </main>
  );
}
