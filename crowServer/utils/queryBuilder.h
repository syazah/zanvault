#ifndef QUERY_BUILDER_H
#define QUERY_BUILDER_H
#include "queryParser.h"
#include <algorithm>
#include <fstream>
#include <filesystem>
#include <numeric>
#include <string>
#include <vector>
#include <map>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace std;

QueryBuilder& QueryBuilder::select(const string& table, const string& field, const string& alias) {
    QueryField qf;
    qf.tableName = table;
    qf.fieldName = field;
    qf.alias = alias.empty() ? field : alias;
    selectFields.push_back(qf);
    return *this;
}

QueryBuilder& QueryBuilder::selectAggregate(AggregateFunction func, const string& table, 
                                           const string& field, const string& alias) {
    QueryField qf;
    qf.tableName = table;
    qf.fieldName = field;
    qf.alias = alias;
    qf.aggregateFunc = new AggregateFunction(func);
    selectFields.push_back(qf);
    return *this;
}

QueryBuilder& QueryBuilder::join(const string& leftTable, const string& leftField,
                                const string& rightTable, const string& rightField,
                                JoinType type) {
    JoinCondition jc;
    jc.leftTable = leftTable;
    jc.leftField = leftField;
    jc.rightTable = rightTable;
    jc.rightField = rightField;
    jc.joinType = type;
    joins.push_back(jc);
    return *this;
}

QueryBuilder& QueryBuilder::where(const string& field, const string& op, 
                                 const string& value, const string& logical) {
    FilterCondition fc;
    fc.field = field;
    fc.operatorType = op;
    fc.value = value;
    fc.logicalOperator = logical;
    filters.push_back(fc);
    return *this;
}

json QueryBuilder::execute(const string& userPath, const string& dbName) {
    // 1. Load all required tables
    map<string, json> tables;
    tables[baseTable] = loadTableData(userPath + "/" + dbName + "/" + baseTable);
    
    for (const auto& join : joins) {
        if (tables.find(join.rightTable) == tables.end()) {
            tables[join.rightTable] = loadTableData(userPath + "/" + dbName + "/" + join.rightTable);
        }
    }
    
    // 2. Apply joins
    json joinedData = applyJoins(tables);
    
    // 3. Apply filters
    json filteredData = applyFilters(joinedData);
    
    // 4. Apply grouping
    json groupedData = groupByFields.empty() ? filteredData : applyGrouping(filteredData);
    
    // 5. Apply aggregations
    json aggregatedData = applyAggregations(groupedData);
    
    // 6. Apply ordering
    json orderedData = applyOrdering(aggregatedData);
    
    // 7. Apply pagination
    json finalData = applyPagination(orderedData);
    
    return finalData;
}

json QueryBuilder::loadTableData(const string& tablePath) {
    json result = json::array();
    
    if (!filesystem::exists(tablePath)) {
        return result;
    }
    
    for (const auto& entry : filesystem::directory_iterator(tablePath)) {
        if (entry.path().extension() == ".json") {
            ifstream file(entry.path());
            if (file.is_open()) {
                json rowData;
                file >> rowData;
                result.push_back(rowData);
            }
        }
    }
    
    return result;
}

json QueryBuilder::applyJoins(const map<string, json>& tables) {
    if (joins.empty()) {
        return tables.at(baseTable);
    }
    
    json result = json::array();
    json leftData = tables.at(baseTable);
    
    for (const auto& join : joins) {
        json rightData = tables.at(join.rightTable);
        json newResult = json::array();
        
        for (const auto& leftRow : leftData) {
            for (const auto& rightRow : rightData) {
                // Check if join condition matches
                if (leftRow[join.leftField] == rightRow[join.rightField]) {
                    json mergedRow = leftRow;
                    // Prefix right table fields to avoid conflicts
                    for (auto& [key, value] : rightRow.items()) {
                        mergedRow[join.rightTable + "." + key] = value;
                    }
                    newResult.push_back(mergedRow);
                }
            }
            
            // Handle LEFT JOIN - include unmatched left rows
            if (join.joinType == JoinType::LEFT && newResult.empty()) {
                json mergedRow = leftRow;
                newResult.push_back(mergedRow);
            }
        }
        
        leftData = newResult;
    }
    
    return leftData;
}

json QueryBuilder::applyFilters(const json& data) {
    if (filters.empty()) {
        return data;
    }
    
    json result = json::array();
    
    for (const auto& row : data) {
        bool matches = true;
        
        for (size_t i = 0; i < filters.size(); ++i) {
            const auto& filter = filters[i];
            bool conditionMet = false;
            
            if (row.contains(filter.field)) {
                string rowValue = row[filter.field].dump();
                string filterValue = filter.value;
                
                if (filter.operatorType == "=") {
                    conditionMet = (rowValue == filterValue);
                } else if (filter.operatorType == "!=") {
                    conditionMet = (rowValue != filterValue);
                } else if (filter.operatorType == ">") {
                    conditionMet = (stod(rowValue) > stod(filterValue));
                } else if (filter.operatorType == "<") {
                    conditionMet = (stod(rowValue) < stod(filterValue));
                } else if (filter.operatorType == ">=") {
                    conditionMet = (stod(rowValue) >= stod(filterValue));
                } else if (filter.operatorType == "<=") {
                    conditionMet = (stod(rowValue) <= stod(filterValue));
                } else if (filter.operatorType == "LIKE") {
                    conditionMet = (rowValue.find(filterValue) != string::npos);
                }
            }
            
            // Apply logical operators
            if (i > 0) {
                if (filters[i-1].logicalOperator == "AND") {
                    matches = matches && conditionMet;
                } else if (filters[i-1].logicalOperator == "OR") {
                    matches = matches || conditionMet;
                }
            } else {
                matches = conditionMet;
            }
        }
        
        if (matches) {
            result.push_back(row);
        }
    }
    
    return result;
}

json QueryBuilder::applyAggregations(const json& data) {
    json result = json::array();
    
    // If no aggregate functions, return data as is
    bool hasAggregates = false;
    for (const auto& field : selectFields) {
        if (field.aggregateFunc != nullptr) {
            hasAggregates = true;
            break;
        }
    }
    
    if (!hasAggregates) {
        return data;
    }
    
    // Perform aggregations
    json aggregatedRow;
    
    for (const auto& field : selectFields) {
        if (field.aggregateFunc == nullptr) {
            // Non-aggregate field - take first value
            if (!data.empty() && data[0].contains(field.fieldName)) {
                aggregatedRow[field.alias] = data[0][field.fieldName];
            }
        } else {
            // Aggregate field
            vector<double> values;
            for (const auto& row : data) {
                if (row.contains(field.fieldName)) {
                    values.push_back(stod(row[field.fieldName].dump()));
                }
            }
            
            double result = 0.0;
            switch (*field.aggregateFunc) {
                case AggregateFunction::SUM:
                    result = accumulate(values.begin(), values.end(), 0.0);
                    break;
                case AggregateFunction::AVG:
                    result = accumulate(values.begin(), values.end(), 0.0) / values.size();
                    break;
                case AggregateFunction::COUNT:
                    result = values.size();
                    break;
                case AggregateFunction::MIN:
                    result = *min_element(values.begin(), values.end());
                    break;
                case AggregateFunction::MAX:
                    result = *max_element(values.begin(), values.end());
                    break;
            }
            
            aggregatedRow[field.alias] = result;
        }
    }
    
    result.push_back(aggregatedRow);
    return result;
}

json QueryBuilder::applyPagination(const json& data) {
    if (limit == -1) {
        return data;
    }
    
    json result = json::array();
    size_t start = offset;
    size_t end = min(start + limit, data.size());
    
    for (size_t i = start; i < end; ++i) {
        result.push_back(data[i]);
    }
    
    return result;
}

QueryBuilder& QueryBuilder::groupBy(const string& field) {
    groupByFields.push_back(field);
    return *this;
}

QueryBuilder& QueryBuilder::orderBy(const string& field) {
    orderByFields.push_back(field);
    return *this;
}

QueryBuilder& QueryBuilder::setLimit(int l) {
    limit = l;
    return *this;
}

QueryBuilder& QueryBuilder::setOffset(int o) {
    offset = o;
    return *this;
}

json QueryBuilder::applyGrouping(const json& data) {
    if (groupByFields.empty()) {
        return data;
    }
    
    map<string, json> groups;
    
    for (const auto& row : data) {
        string groupKey;
        for (const auto& field : groupByFields) {
            groupKey += row[field].dump() + "|";
        }
        
        if (groups.find(groupKey) == groups.end()) {
            groups[groupKey] = json::array();
        }
        groups[groupKey].push_back(row);
    }
    
    json result = json::array();
    for (const auto& [key, group] : groups) {
        result.push_back(group);
    }
    
    return result;
}

json QueryBuilder::applyOrdering(const json& data) {
    if (orderByFields.empty()) {
        return data;
    }
    
    json result = data;
    
    std::sort(result.begin(), result.end(), [this](const json& a, const json& b) {
        for (const auto& field : orderByFields) {
            if (a[field] != b[field]) {
                return a[field] < b[field];
            }
        }
        return false;
    });
    
    return result;
}

#endif 