export function Select({
  options,
  onSelectParent,
}: {
  options: { id: number; key: string; value: string }[];
  onSelectParent: (value: string) => void;
}) {
  return (
    <select
      onChange={(e) => {
        onSelectParent(e.target.value);
      }}
      className="mt-2 mx-2 w-[95%] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  "
    >
      {/* <option selected>Choose a provider bank</option> */}

      {options.map(function (op) {
        return (
          <option key={op.id} value={op.key}>
            {op.value}
          </option>
        );
      })}
    </select>
  );
}
