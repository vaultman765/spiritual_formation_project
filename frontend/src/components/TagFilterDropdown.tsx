import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { formatTagLabel } from '@/utils/tagDisplay';

interface TagFilterDropdownProps {
  selectedTag: string;
  onChange: (value: string) => void;
  allTags: string[];
}

export default function TagFilterDropdown({
  selectedTag,
  onChange,
  allTags
}: TagFilterDropdownProps) {

  return (
    <Listbox value={selectedTag} onChange={onChange}>
      <div className="relative w-full md:w-1/3">
        <ListboxButton className="w-full cursor-pointer px-4 py-2 rounded bg-white/10 border border-white/20 text-white text-left focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400">
          {selectedTag || 'All Tags'}
        </ListboxButton>

        <ListboxOptions className="absolute mt-1 w-full rounded bg-white shadow-lg ring-1 ring-black/5 z-10 max-h-60 overflow-auto">
          {allTags.map((tag, idx) => (
            <ListboxOption
              key={idx}
              value={tag === 'All Tags' ? '' : tag}
              className={({ selected }) =>
                  `cursor-pointer select-none px-4 py-2 text-sm text-black ${
                  selected ? 'bg-yellow-100 font-semibold' : ''
                  }`
              }
              >
              {({ selected }) => (
                  <span className="flex justify-between items-center">
                  {formatTagLabel(tag)}
                  {selected && <CheckIcon className="h-4 w-4 text-yellow-500" />}
                  </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
