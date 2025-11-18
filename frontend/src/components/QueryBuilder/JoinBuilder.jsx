import React, { useState, useEffect } from 'react';
import { useQueryBuilder } from '../../context/QueryBuilderContext';

const JoinBuilder = () => {
  const {
    query,
    addJoin,
    removeJoin,
    availableTables,
    tableSchemas,
    loadTableSchema
  } = useQueryBuilder();

  const [leftTable, setLeftTable] = useState('');
  const [leftField, setLeftField] = useState('');
  const [rightTable, setRightTable] = useState('');
  const [rightField, setRightField] = useState('');
  const [joinType, setJoinType] = useState('INNER');

  useEffect(() => {
    if (leftTable && !tableSchemas[leftTable]) {
      loadTableSchema(leftTable);
    }
  }, [leftTable, tableSchemas, loadTableSchema]);

  useEffect(() => {
    if (rightTable && !tableSchemas[rightTable]) {
      loadTableSchema(rightTable);
    }
  }, [rightTable, tableSchemas, loadTableSchema]);

  const handleAddJoin = () => {
    if (!leftTable || !leftField || !rightTable || !rightField) return;

    addJoin({
      leftTable,
      leftField,
      rightTable,
      rightField,
      type: joinType
    });

    // Reset form
    setLeftTable('');
    setLeftField('');
    setRightTable('');
    setRightField('');
    setJoinType('INNER');
  };

  const leftSchema = leftTable ? tableSchemas[leftTable] : null;
  const rightSchema = rightTable ? tableSchemas[rightTable] : null;

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        JOIN Tables
      </h3>

      <div className="space-y-3">
        {/* Join Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Join Type
          </label>
          <select
            value={joinType}
            onChange={(e) => setJoinType(e.target.value)}
            className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
          >
            <option value="INNER">INNER JOIN</option>
            <option value="LEFT">LEFT JOIN</option>
            <option value="RIGHT">RIGHT JOIN</option>
            <option value="FULL">FULL JOIN</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Left Table */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Left Table
            </label>
            <select
              value={leftTable}
              onChange={(e) => {
                setLeftTable(e.target.value);
                setLeftField('');
              }}
              className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
            >
              <option value="">Select</option>
              {availableTables.map(table => (
                <option key={table} value={table}>{table}</option>
              ))}
            </select>
          </div>

          {/* Right Table */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Right Table
            </label>
            <select
              value={rightTable}
              onChange={(e) => {
                setRightTable(e.target.value);
                setRightField('');
              }}
              className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
            >
              <option value="">Select</option>
              {availableTables.map(table => (
                <option key={table} value={table}>{table}</option>
              ))}
            </select>
          </div>

          {/* Left Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Left Field
            </label>
            <select
              value={leftField}
              onChange={(e) => setLeftField(e.target.value)}
              disabled={!leftTable}
              className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">Select</option>
              {leftSchema && Object.keys(leftSchema).map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          {/* Right Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Right Field
            </label>
            <select
              value={rightField}
              onChange={(e) => setRightField(e.target.value)}
              disabled={!rightTable}
              className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none disabled:opacity-50"
            >
              <option value="">Select</option>
              {rightSchema && Object.keys(rightSchema).map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAddJoin}
          disabled={!leftTable || !leftField || !rightTable || !rightField}
          className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Add Join
        </button>
      </div>

      {/* Joins List */}
      {query.joins.length > 0 && (
        <div className="mt-5 space-y-2">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Active Joins:</h4>
          {query.joins.map((join, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#0a0a0a] p-3 rounded-lg border border-gray-800 group hover:border-gray-700 transition-colors"
            >
              <span className="text-white font-mono text-sm">
                <span className="text-purple-400">{join.type}</span>
                {' '}
                <span className="text-blue-400">{join.leftTable}</span>
                <span className="text-gray-400">.</span>
                <span className="text-green-400">{join.leftField}</span>
                <span className="text-gray-400"> = </span>
                <span className="text-blue-400">{join.rightTable}</span>
                <span className="text-gray-400">.</span>
                <span className="text-green-400">{join.rightField}</span>
              </span>
              <button
                onClick={() => removeJoin(idx)}
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

export default JoinBuilder;