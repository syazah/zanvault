import React, { useState } from 'react';
import { useQueryBuilder } from '../../context/QueryBuilderContext';

const WhereBuilder = () => {
  const { query, addWhereCondition, removeWhereCondition } = useQueryBuilder();
  const [field, setField] = useState('');
  const [operator, setOperator] = useState('=');
  const [value, setValue] = useState('');
  const [logical, setLogical] = useState('AND');

  const handleAddCondition = () => {
    if (!field || !value) return;

    addWhereCondition({
      field,
      operator,
      value,
      logical: query.where.length > 0 ? logical : undefined
    });

    setField('');
    setValue('');
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        WHERE Conditions
      </h3>

      <div className="space-y-3">
        {query.where.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Logical Operator
            </label>
            <select
              value={logical}
              onChange={(e) => setLogical(e.target.value)}
              className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Field
          </label>
          <input
            type="text"
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="e.g., table.column"
            className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Operator
          </label>
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
          >
            <option value="=">=</option>
            <option value="!=">!=</option>
            <option value=">">{'>'}</option>
            <option value="<">{'<'}</option>
            <option value=">=">{'>='}</option>
            <option value="<=">{'<='}</option>
            <option value="LIKE">LIKE</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Value
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500"
          />
        </div>

        <button
          onClick={handleAddCondition}
          disabled={!field || !value}
          className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Add Condition
        </button>
      </div>

      {query.where.length > 0 && (
        <div className="mt-5 space-y-2">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Conditions:</h4>
          {query.where.map((condition, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#0a0a0a] p-3 rounded-lg border border-gray-800 group hover:border-gray-700 transition-colors"
            >
              <span className="text-white font-mono text-sm">
                {idx > 0 && (
                  <span className="text-purple-400">{condition.logical} </span>
                )}
                <span className="text-blue-400">{condition.field}</span>
                {' '}
                <span className="text-gray-400">{condition.operator}</span>
                {' '}
                <span className="text-green-400">'{condition.value}'</span>
              </span>
              <button
                onClick={() => removeWhereCondition(idx)}
                className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhereBuilder;