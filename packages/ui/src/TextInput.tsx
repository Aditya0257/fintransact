export const TextInput = ({
  label,
  placeholder,
  value,
  onChangeParent,
}: {
  label: string;
  placeholder: string;
  value: any;
  onChangeParent: (value: any) => void;
}) => {
  return (
    <div className="my-3">
      <label
        htmlFor={label}
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        {label}
      </label>
      <input
        onChange={(e) => {
          onChangeParent(e.target.value);
        }}
        value={value}
        type="text"
        id={label}
        className="mx-2 w-[95%]  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        placeholder={placeholder}
      />
    </div>
  );
};
