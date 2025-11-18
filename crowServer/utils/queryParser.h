#pragma once
#include <string>
#include <vector>
#include <map>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace std;

enum class AggregateFunction {
    SUM,
    AVG,
    COUNT,
    MIN,
    MAX
};

enum class JoinType {
    INNER,
    LEFT,
    RIGHT,
    FULL
};

struct QueryField {
    string tableName;
    string fieldName;
    string alias;
    AggregateFunction* aggregateFunc = nullptr;
};

struct JoinCondition {
    string leftTable;
    string leftField;
    string rightTable;
    string rightField;
    JoinType joinType;
};

struct FilterCondition {
    string field;
    string operatorType; // =, !=, >, <, >=, <=, LIKE, IN
    string value;
    string logicalOperator; // AND, OR
};

class QueryBuilder {
private:
    string baseTable;
    vector<QueryField> selectFields;
    vector<JoinCondition> joins;
    vector<FilterCondition> filters;
    vector<string> groupByFields;
    vector<string> orderByFields;
    int limit = -1;
    int offset = 0;

public:
    QueryBuilder(const string& table) : baseTable(table) {}
    
    // Builder methods
    QueryBuilder& select(const string& table, const string& field, const string& alias = "");
    QueryBuilder& selectAggregate(AggregateFunction func, const string& table, const string& field, const string& alias);
    QueryBuilder& join(const string& leftTable, const string& leftField, 
                      const string& rightTable, const string& rightField, 
                      JoinType type = JoinType::INNER);
    QueryBuilder& where(const string& field, const string& op, const string& value, const string& logical = "AND");
    QueryBuilder& groupBy(const string& field);
    QueryBuilder& orderBy(const string& field);
    QueryBuilder& setLimit(int l);
    QueryBuilder& setOffset(int o);
    
    // Execution methods
    json execute(const string& userPath, const string& dbName);
    string toSQL(); // For debugging
    
private:
    json loadTableData(const string& tablePath);
    json applyJoins(const map<string, json>& tables);
    json applyFilters(const json& data);
    json applyAggregations(const json& data);
    json applyGrouping(const json& data);
    json applyOrdering(const json& data);
    json applyPagination(const json& data);
};