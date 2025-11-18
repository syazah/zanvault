import React, { useState, useEffect } from 'react';
import { useQueryBuilder } from '../../context/QueryBuilderContext';

const SelectBuilder = () => {
  const {
    query,
    addSelectField,
    removeSelectField,
    setBaseTable,
    availableTables,
    tableSchemas,
    loadTableSchema
  } = useQueryBuilder();

  const [selectedTable, setSelectedTable] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [aggregate, setAggregate] = useState('');
  const [alias, setAlias] = useState('');

  const currentSchema = selectedTable ? tableSchemas[selectedTable] : null;

  useEffect(() => {
    if (selectedTable && !tableSchemas[selectedTable]) {
      loadTableSchema(selectedTable);
    }
  }, [selectedTable, tableSchemas, loadTableSchema]);

  const handleAddField = () => {
    if (!selectedTable || !selectedField) return;

    const field = {
      table: selectedTable,
      field: selectedField,
      alias: alias || undefined,
      aggregate: aggregate || undefined
    };

    addSelectField(field);

    // Set base table if not set
    if (!query.table) {
      setBaseTable(selectedTable);
    }

    // Reset form
    setSelectedField('');
    setAggregate('');
    setAlias('');
  };

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        SELECT Fields
      </h3>

      <div className="space-y-3">
        {/* Table Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Table
          </label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
          >
            <option value="">Select Table</option>
            {availableTables.map(table => (
              <option key={table} value={table}>{table}</option>
            ))}
          </select>
        </div>

        {/* Field Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Field
          </label>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            disabled={!selectedTable}
            className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none disabled:opacity-50"
          >
            <option value="">Select Field</option>
            {currentSchema && Object.keys(currentSchema).map(field => (
              <option key={field} value={field}>
                {field} ({currentSchema[field]})
              </option>
            ))}
          </select>
        </div>

        {/* Aggregate Function */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Aggregate Function (Optional)
          </label>
          <select
            value={aggregate}
            onChange={(e) => setAggregate(e.target.value)}
            className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
          >
            <option value="">None</option>
            <option value="SUM">SUM</option>
            <option value="AVG">AVG</option>
            <option value="COUNT">COUNT</option>
            <option value="MIN">MIN</option>
            <option value="MAX">MAX</option>
          </select>
        </div>

        {/* Alias */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alias (Optional)
          </label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="e.g., total_amount"
            className="w-full p-2.5 bg-[#0a0a0a] text-white rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none placeholder-gray-500"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddField}
          disabled={!selectedTable || !selectedField}
          className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Add Field
        </button>
      </div>

      {/* Selected Fields List */}
      {query.select.length > 0 && (
        <div className="mt-5 space-y-2">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Selected Fields:</h4>
          {query.select.map((field, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#0a0a0a] p-3 rounded-lg border border-gray-800 group hover:border-gray-700 transition-colors"
            >
              <span className="text-white font-mono text-sm">
                {field.aggregate && <span className="text-purple-400">{field.aggregate}(</span>}
                <span className="text-blue-400">{field.table}</span>
                <span className="text-gray-400">.</span>
                <span className="text-green-400">{field.field}</span>
                {field.aggregate && <span className="text-purple-400">)</span>}
                {field.alias && (
                  <>
                    <span className="text-gray-400"> AS </span>
                    <span className="text-yellow-400">{field.alias}</span>
                  </>
                )}
              </span>
              <button
                onClick={() => removeSelectField(idx)}
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

export default SelectBuilder;