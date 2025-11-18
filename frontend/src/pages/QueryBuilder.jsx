import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryBuilder } from '../context/QueryBuilderContext';
import SelectBuilder from '../components/QueryBuilder/SelectBuilder';
import JoinBuilder from '../components/QueryBuilder/JoinBuilder';
import WhereBuilder from '../components/QueryBuilder/WhereBuilder';
import GroupByBuilder from '../components/QueryBuilder/GroupBuilder';
import SQLPreview from '../components/QueryBuilder/SQLPreview';
import ResultsTable from '../components/QueryBuilder/ResultsTable';

const QueryBuilder = () => {
  const navigate = useNavigate();
  const { id, dbname } = useParams();
  const { query, executeQuery, resetQuery, loadAvailableTables } = useQueryBuilder();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = sessionStorage.getItem('id');
    const userId = id || sessionId;

    if (!userId || !dbname) {
      navigate('/login');
      return;
    }
    sessionStorage.setItem('id', userId);
    sessionStorage.setItem('db_name', dbname);

    loadAvailableTables({ id: userId, db_name: dbname });
  }, [navigate, loadAvailableTables, id, dbname]);

  const handleExecute = async () => {
    if (!query.table) {
      setError('Please select a base table');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await executeQuery();
      if (data.success) {
        setResults(JSON.parse(data.data));
      } else {
        setError(data.error || 'Query execution failed');
      }
    } catch (err) {
      setError('Failed to execute query: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetQuery();
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/user/${id}?dbname=${dbname}`)}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Query Builder</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Reset Query
            </button>
            <button
              onClick={handleExecute}
              disabled={loading || !query.table}
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Executing...
                </span>
              ) : (
                'Execute Query'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SelectBuilder />
            <JoinBuilder />
            <WhereBuilder />
            <GroupByBuilder />
          </div>

          <div className="space-y-6">
            <SQLPreview query={query} />
            {results && (
              <ResultsTable data={results} count={results.length} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder;