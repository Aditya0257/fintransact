export function PaginationControls({
    currentPage,
    totalPages,
    onPageChange
  }: {
    currentPage: number,
    totalPages: number,
    onPageChange: (value: number) => void
  }) {
  
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(i + 1);
    }
  
    return (
      <div className="flex justify-center px-4 pt-4 pb-6">
        <nav aria-label="Page navigation">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <button
                disabled={currentPage === 1}
                onClick={() => { onPageChange(currentPage - 1) }}
                className={`flex items-center justify-center px-3 h-8 ms-0 border border-e-0 border-gray-300 rounded-s-lg leading-tight text-gray-500 ${currentPage === 1 ? ' cursor-not-allowed transform-none transition-none' : 'hover:bg-gray-100 hover:text-gray-700'}`}
              >
                Previous
              </button>
            </li>
            {pages.map((page) => {
              return (<li key={page}>
                <button
                  onClick={() => { onPageChange(page) }}
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700  "
                >
                  {page}
                </button>
              </li>);
            })}
  
            <li>
              <button
                disabled={currentPage === totalPages}
                onClick={() => { onPageChange(currentPage + 1) }}
                className={`flex items-center justify-center px-3 h-8 ms-0 border border-e-0 border-gray-300 rounded-e-lg leading-tight text-gray-500 ${currentPage === totalPages ? 'cursor-not-allowed transform-none transition-none' : 'hover:bg-gray-100 hover:text-gray-700'}`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }