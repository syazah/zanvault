import React from 'react';

const SQLPreview = ({ query }) => {
  const generateSQL = () => {
    if (!query.table) {
      return 'SELECT * FROM table_name';
    }

    let sql = 'SELECT ';

    // SELECT clause
    if (query.select && query.select.length > 0) {
      sql += query.select
        .map((col) => {
          const expr = col.table && col.field ? `${col.table}.${col.field}` : (col.field || col.table || '');
          if (col.aggregate && expr) {
            return `${col.aggregate}(${expr})${col.alias ? ` AS ${col.alias}` : ''}`;
          }
          return `${expr}${col.alias ? ` AS ${col.alias}` : ''}`;
        })
        .join(', ');
    } else {
      sql += '*';
    }

    // FROM clause
    sql += `\nFROM ${query.table}`;

    // JOIN clauses (expecting leftTable/leftField/rightTable/rightField/type)
    if (query.joins && query.joins.length > 0) {
      query.joins.forEach((join) => {
        const left = join.leftTable && join.leftField ? `${join.leftTable}.${join.leftField}` : '';
        const right = join.rightTable && join.rightField ? `${join.rightTable}.${join.rightField}` : '';
        const targetTable = join.rightTable || join.leftTable || 'table';
        sql += `\n${join.type || 'INNER'} JOIN ${targetTable} ON ${left} = ${right}`;
      });
    }

    // WHERE clause (expecting field/operator/value/logical)
    if (query.where && query.where.length > 0) {
      sql += '\nWHERE ';
      sql += query.where
        .map((condition, index) => {
          const col = condition.field || condition.column || '';
          let clause = `${col} ${condition.operator} `;
          clause += condition.operator === 'IN' ? `(${condition.value})` : `'${condition.value}'`;
          return index > 0 ? ` ${condition.logical || 'AND'} ${clause}` : clause;
        })
        .join('');
    }

    // GROUP BY clause (array of strings)
    if (query.groupBy && query.groupBy.length > 0) {
      sql += '\nGROUP BY ' + query.groupBy.join(', ');
    }

    // ORDER BY clause (array of strings)
    if (query.orderBy && query.orderBy.length > 0) {
      sql += '\nORDER BY ' + query.orderBy.join(', ');
    }

    // LIMIT & OFFSET
    if (query.limit) {
      sql += `\nLIMIT ${query.limit}`;
    }
    if (query.offset) {
      sql += `\nOFFSET ${query.offset}`;
    }

    return sql;
  };

  const sql = generateSQL();

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          SQL Preview
        </h2>
      </div>

      <div className="p-4">
        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words bg-gray-950 p-4 rounded border border-gray-800">
          {sql}
        </pre>
      </div>

      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 flex justify-end">
        <button
          onClick={() => navigator.clipboard.writeText(sql)}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy SQL
        </button>
      </div>
    </div>
  );
};

export default SQLPreview;