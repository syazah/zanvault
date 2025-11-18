#pragma once
#include "crow.h"
#include "utils/queryBuilder.h"
#include "utils/getUserDatabasePath.h"
#include <nlohmann/json.hpp>

void setup_query_routes(crow::SimpleApp& app) {
    
    // Execute custom query
    CROW_ROUTE(app, "/api/v1/execute-query").methods("POST"_method)([](const crow::request& req) {
        auto jsonBody = crow::json::load(req.body);
        
        if (!jsonBody.has("id") || !jsonBody.has("db_name") || !jsonBody.has("query")) {
            return crow::response(400, "Missing required fields");
        }
        
        string id = jsonBody["id"].s();
        string dbName = jsonBody["db_name"].s();
        string userPath = getUserDatabasePath(id);
        
        if (userPath.empty()) {
            return crow::response(400, "User not found");
        }
        
        try {
            // Parse query JSON
            auto queryJson = jsonBody["query"];
            string baseTable = queryJson["table"].s();
            
            QueryBuilder qb(baseTable);
            
            // Add SELECT fields
            if (queryJson.has("select")) {
                for (const auto& field : queryJson["select"]) {
                    if (field.has("aggregate")) {
                        string aggType = field["aggregate"].s();
                        AggregateFunction func;
                        
                        if (aggType == "SUM") func = AggregateFunction::SUM;
                        else if (aggType == "AVG") func = AggregateFunction::AVG;
                        else if (aggType == "COUNT") func = AggregateFunction::COUNT;
                        else if (aggType == "MIN") func = AggregateFunction::MIN;
                        else if (aggType == "MAX") func = AggregateFunction::MAX;
                        
                        qb.selectAggregate(func, 
                                         field["table"].s(), 
                                         field["field"].s(), 
                                         field["alias"].s());
                    } else {
                        string alias;
                        if (field.has("alias")) {
                            alias = field["alias"].s();
                        } else {
                            alias = "";
                        }
                        qb.select(field["table"].s(), 
                                field["field"].s(), 
                                alias);
                    }
                }
            }
            
            // Add JOINs
            if (queryJson.has("joins")) {
                for (const auto& join : queryJson["joins"]) {
                    JoinType type = JoinType::INNER;
                    if (join.has("type")) {
                        string joinTypeStr = join["type"].s();
                        if (joinTypeStr == "LEFT") type = JoinType::LEFT;
                        else if (joinTypeStr == "RIGHT") type = JoinType::RIGHT;
                        else if (joinTypeStr == "FULL") type = JoinType::FULL;
                    }
                    
                    qb.join(join["leftTable"].s(), 
                           join["leftField"].s(),
                           join["rightTable"].s(), 
                           join["rightField"].s(),
                           type);
                }
            }
            
            // Add WHERE conditions
             if (queryJson.has("where")) {
                for (const auto& condition : queryJson["where"]) {
                    string logical;
                    if (condition.has("logical")) {
                        logical = condition["logical"].s();
                    } else {
                        logical = "AND";
                    }
                    qb.where(condition["field"].s(),
                            condition["operator"].s(),
                            condition["value"].s(),
                            logical);
                }
            }
            
            // Add GROUP BY
            if (queryJson.has("groupBy")) {
                for (const auto& field : queryJson["groupBy"]) {
                    qb.groupBy(field.s());
                }
            }
            
            // Add ORDER BY
            if (queryJson.has("orderBy")) {
                for (const auto& field : queryJson["orderBy"]) {
                    qb.orderBy(field.s());
                }
            }
            
            // Add LIMIT and OFFSET
            if (queryJson.has("limit")) {
                qb.setLimit(queryJson["limit"].i());
            }
            if (queryJson.has("offset")) {
                qb.setOffset(queryJson["offset"].i());
            }
            
            // Execute query
            json result = qb.execute(userPath, dbName);
            
            crow::json::wvalue resBody;
            resBody["success"] = true;
            resBody["data"] = result.dump();
            resBody["count"] = result.size();
            
            return crow::response(200, resBody);
            
        } catch (const exception& e) {
            crow::json::wvalue error;
            error["success"] = false;
            error["error"] = e.what();
            return crow::response(500, error);
        }
    });
    
    // Get table schema for query builder UI
    CROW_ROUTE(app, "/api/v1/get-table-schema").methods("POST"_method)([](const crow::request& req) {
        auto jsonBody = crow::json::load(req.body);
        
        if (!jsonBody.has("id") || !jsonBody.has("db_name") || !jsonBody.has("table_name")) {
            return crow::response(400, "Missing required fields");
        }
        
        string id = jsonBody["id"].s();
        string dbName = jsonBody["db_name"].s();
        string tableName = jsonBody["table_name"].s();
        string userPath = getUserDatabasePath(id);
        
        string schemaPath = userPath + "/" + dbName + "/" + tableName + "/schema.json";
        
        ifstream schemaFile(schemaPath);
        if (!schemaFile.is_open()) {
            return crow::response(404, "Schema not found");
        }
        
        json schema;
        schemaFile >> schema;
        
        crow::json::wvalue resBody;
        resBody["success"] = true;
        resBody["schema"] = schema.dump();
        
        return crow::response(200, resBody);
    });
}