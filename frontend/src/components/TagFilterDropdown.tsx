import SimpleListboxDropdown from '@/components/SimpleListboxDropdown';

interface TagFilterDropdownProps {
  options: string[];
  selected: string;
  onChange: (val: string) => void;
}

export default function TagFilterDropdown({
  options,
  selected,
  onChange
}: TagFilterDropdownProps) {
  return (
    <SimpleListboxDropdown
      options={options}
      selected={selected}
      onChange={onChange}
      placeholder="Filter by Tag"
    />
  );
}
