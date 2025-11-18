import React, { useState } from 'react';
import { useQueryBuilder } from '../../context/QueryBuilderContext';

const GroupByBuilder = () => {
  const { query, addGroupBy, removeGroupBy, addOrderBy, removeOrderBy, setLimit, setOffset } = useQueryBuilder();
  const [groupField, setGroupField] = useState('');
  const [orderField, setOrderField] = useState('');

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Additional Options
      </h3>

      <div className="space-y-4">
        {/* GROUP BY */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GROUP BY Field
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={groupField}
              onChange={(e) => setGroupField(e.target.value)}
              placeholder="e.g., category"
              className="flex-1 p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500"
            />
            <button
              onClick={() => {
                if (groupField) {
                  addGroupBy(groupField);
                  setGroupField('');
                }
              }}
              disabled={!groupField}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>
          {query.groupBy.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {query.groupBy.map((field, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#0a0a0a] text-white rounded-full text-sm border border-gray-800"
                >
                  {field}
                  <button
                    onClick={() => removeGroupBy(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ORDER BY */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            ORDER BY Field
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={orderField}
              onChange={(e) => setOrderField(e.target.value)}
              placeholder="e.g., created_at DESC"
              className="flex-1 p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500"
            />
            <button
              onClick={() => {
                if (orderField) {
                  addOrderBy(orderField);
                  setOrderField('');
                }
              }}
              disabled={!orderField}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>
          {query.orderBy.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {query.orderBy.map((field, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#0a0a0a] text-white rounded-full text-sm border border-gray-800"
                >
                  {field}
                  <button
                    onClick={() => removeOrderBy(idx)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* LIMIT & OFFSET */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              LIMIT
            </label>
            <input
              type="number"
              min="1"
              value={query.limit || ''}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="No limit"
              className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OFFSET
            </label>
            <input
              type="number"
              min="0"
              value={query.offset || ''}
              onChange={(e) => setOffset(e.target.value)}
              placeholder="0"
              className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupByBuilder;