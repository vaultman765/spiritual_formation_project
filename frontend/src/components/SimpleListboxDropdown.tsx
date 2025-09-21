import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";

interface SimpleListboxDropdownProps {
  readonly options: readonly string[];
  readonly selected: string;
  readonly onChange: (val: string) => void;
  readonly placeholder?: string;
  readonly labelFormatter?: (val: string) => string;
}

export default function SimpleListboxDropdown({
  options = [],
  selected,
  onChange,
  placeholder = "Select an option",
  labelFormatter = (val) => val,
}: SimpleListboxDropdownProps) {
  if (!Array.isArray(options)) {
    console.error("Dropdown options must be an array. Received:", options);
    return null;
  }

  return (
    <Listbox value={selected} onChange={onChange}>
      <div className="relative w-full md:w-1/3">
        <ListboxButton className="w-full cursor-pointer px-4 py-2 rounded bg-white/10 border border-white/20 text-white text-left focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400">
          {labelFormatter(selected) || placeholder}
        </ListboxButton>

        <ListboxOptions className="absolute mt-1 w-full rounded bg-white shadow-lg ring-1 ring-black/5 z-10 max-h-60 overflow-auto">
          {options.map((opt) => (
            <ListboxOption
              key={opt}
              value={opt}
              className={({ selected }) =>
                `cursor-pointer select-none px-4 py-2 text-sm text-black ${selected ? "bg-yellow-100 font-semibold" : ""}`
              }
            >
              {({ selected }) => (
                <span className="flex justify-between items-center">
                  {labelFormatter(opt)}
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
