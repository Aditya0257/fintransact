export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-300 p-4 m-3">
      <div className="text-xl w-[96%]  border-b pb-1  border-gray-300">
        {title}
      </div>
      {children}
    </div>
  );
}
