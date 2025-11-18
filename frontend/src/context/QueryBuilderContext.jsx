import React, { createContext, useContext, useState } from 'react';

const QueryBuilderContext = createContext(undefined);

export const QueryBuilderProvider = ({ children }) => {
  const [query, setQuery] = useState({
    table: '',
    select: [],
    joins: [],
    where: [],
    groupBy: [],
    orderBy: [],
    limit: null,
    offset: 0
  });

  const [availableTables, setAvailableTables] = useState([]);
  const [tableSchemas, setTableSchemas] = useState({});

  const setBaseTable = (table) => {
    setQuery(prev => ({ ...prev, table }));
  };

  const addSelectField = (field) => {
    setQuery(prev => ({ ...prev, select: [...prev.select, field] }));
  };

  const removeSelectField = (index) => {
    setQuery(prev => ({
      ...prev,
      select: prev.select.filter((_, i) => i !== index)
    }));
  };

  const addJoin = (join) => {
    setQuery(prev => ({ ...prev, joins: [...prev.joins, join] }));
  };

  const removeJoin = (index) => {
    setQuery(prev => ({
      ...prev,
      joins: prev.joins.filter((_, i) => i !== index)
    }));
  };

  const addWhereCondition = (condition) => {
    setQuery(prev => ({ ...prev, where: [...prev.where, condition] }));
  };

  const removeWhereCondition = (index) => {
    setQuery(prev => ({
      ...prev,
      where: prev.where.filter((_, i) => i !== index)
    }));
  };

  const addGroupBy = (field) => {
    setQuery(prev => ({ ...prev, groupBy: [...prev.groupBy, field] }));
  };

  const removeGroupBy = (index) => {
    setQuery(prev => ({
      ...prev,
      groupBy: prev.groupBy.filter((_, i) => i !== index)
    }));
  };

  const addOrderBy = (field) => {
    setQuery(prev => ({ ...prev, orderBy: [...prev.orderBy, field] }));
  };

  const removeOrderBy = (index) => {
    setQuery(prev => ({
      ...prev,
      orderBy: prev.orderBy.filter((_, i) => i !== index)
    }));
  };

  const setLimit = (limit) => {
    setQuery(prev => ({ ...prev, limit: limit ? parseInt(limit) : null }));
  };

  const setOffset = (offset) => {
    setQuery(prev => ({ ...prev, offset: parseInt(offset) || 0 }));
  };

  const resetQuery = () => {
    setQuery({
      table: '',
      select: [],
      joins: [],
      where: [],
      groupBy: [],
      orderBy: [],
      limit: null,
      offset: 0
    });
  };

  const loadAvailableTables = async ({ id, db_name }) => {
    try {
      const response = await fetch(`/api/v1/database/tables?id=${encodeURIComponent(id)}&&db_name=${encodeURIComponent(db_name)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        setAvailableTables(data.tables);
      }
    } catch (error) {
      console.error('Failed to load tables:', error);
    }
  };

  const loadTableSchema = async (tableName) => {
    try {
      const id = sessionStorage.getItem('id');
      const db_name = sessionStorage.getItem('db_name');

      const response = await fetch(`/api/v1/database/schema?id=${encodeURIComponent(id)}&&db_name=${encodeURIComponent(db_name)}&&table_name=${encodeURIComponent(tableName)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (data.success) {
        const schema = JSON.parse(data.schema);
        setTableSchemas(prev => ({ ...prev, [tableName]: schema }));
        return schema;
      }
    } catch (error) {
      console.error('Failed to load schema:', error);
    }
  };

  const executeQuery = async () => {
    const id = sessionStorage.getItem('id');
    const db_name = sessionStorage.getItem('db_name');

    const response = await fetch('/api/v1/execute-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, db_name, query })
    });

    return await response.json();
  };

  return (
    <QueryBuilderContext.Provider
      value={{
        query,
        setBaseTable,
        addSelectField,
        removeSelectField,
        addJoin,
        removeJoin,
        addWhereCondition,
        removeWhereCondition,
        addGroupBy,
        removeGroupBy,
        addOrderBy,
        removeOrderBy,
        setLimit,
        setOffset,
        resetQuery,
        executeQuery,
        availableTables,
        tableSchemas,
        loadAvailableTables,
        loadTableSchema
      }}
    >
      {children}
    </QueryBuilderContext.Provider>
  );
};

export const useQueryBuilder = () => {
  const context = useContext(QueryBuilderContext);
  if (!context) {
    throw new Error('useQueryBuilder must be used within QueryBuilderProvider');
  }
  return context;
};