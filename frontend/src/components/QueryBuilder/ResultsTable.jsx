import React from 'react';

const ResultsTable = ({ data, count }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-400">No results to display</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Query Results
        </h2>
        <span className="text-sm text-green-400">
          {count} {count === 1 ? 'row' : 'rows'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-800/50 transition-colors">
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap"
                  >
                    {row[column] !== null && row[column] !== undefined
                      ? String(row[column])
                      : <span className="text-gray-600 italic">NULL</span>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {count > 10 && (
        <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            Showing {Math.min(count, data.length)} of {count} results
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;