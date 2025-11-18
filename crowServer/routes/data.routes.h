#pragma once
#include "crow.h"
#include "utils/getUserDatabasePath.h"
#include <fstream>
#include <filesystem>
#include <nlohmann/json.hpp>
using namespace std;

using json  = nlohmann::json;
void setup_data_routes(crow::SimpleApp &app){
//ADDING DATA
    CROW_ROUTE(app, "/api/v1/data/add-data").methods("POST"_method)([](const crow::request &req){
        try{
            auto reqBody = crow::json::load(req.body);
            if(!reqBody.has("table_name") || !reqBody.has("db_name") || !reqBody.has("id") || !reqBody.has("data")){
                return crow::response("No Valid Info Provided");
            }
            string id = reqBody["id"].s();
            string table_name = reqBody["table_name"].s();
            string db_name = reqBody["db_name"].s();
            auto data = reqBody["data"];
            if(!data){
                return crow::response(400, "Data not calculated");
            }
            string user_directory_path = getUserDatabasePath(id);
            if(user_directory_path == ""){
                return crow::response("No Valid User Found");
            }
            if(!filesystem::exists(user_directory_path+"/"+db_name)){
                return crow::response(400, "Database not found");
            }
            if(!filesystem::exists(user_directory_path+"/"+db_name+"/"+table_name)){
                return crow::response(400, "The Table Does Not Exists");
            }
            if(!filesystem::exists(user_directory_path+"/"+db_name+"/"+table_name+"/"+"schema.json")){
                return crow::response(400, "No schema file linked with this table, Link a schema file first");
            }
            ifstream instream(user_directory_path+"/"+db_name+"/"+table_name+"/"+"schema.json");
            if(!instream){
                return crow::response(500, "Internal Server Error, Cannot find linked schema");
            }
            json schemaJson;
            instream>>schemaJson;
            instream.close();
            string primary;
            for(auto &[key, expected] :schemaJson.items()){
                if(!data.has(key)){
                    return crow::response(400, "Data is missing required fields"+key);
                }
                auto value = data[key];
                if(key == "primary"){
                    cout<<"Reached Primary"<<endl;
                    string primaryKey = schemaJson["primary"];
                    cout<<primaryKey<<endl;
                    primary = data[primaryKey].s();
                    continue;
                }
                if (expected == "int") {
                    try {
                        int val = value.d(); // Attempts to get as number
                    } catch (...) {
                        return crow::response(400, "Type mismatch for field: " + key + " (expected int)");
                    }}
                else if (expected == "string") {
                    try {
                        string val = value.s(); // Attempts to get as string
                    } catch (...) {
                        return crow::response(400, "Type mismatch for field: " + key + " (expected string)");
                    }
                }
                else if (expected == "boolean") {
                    try {
                        bool val = value.b(); // Attempts to get as boolean
                    } catch (...) {
                        return crow::response(400, "Type mismatch for field: " + key + " (expected boolean)");
                    }
                }
            }
            cout<<"PASSED"<<endl;
            if(filesystem::exists(user_directory_path+"/"+db_name+"/"+table_name+"/"+primary+".json")){
                return crow::response(400, "A user already exists for this can't create a new one, try editing the file");
            }
            string dataFilePath = user_directory_path+"/"+db_name+"/"+table_name+"/"+primary+".json";
            ofstream outstream(dataFilePath);
            if(!outstream){
                return crow::response(500, "Schema File Cannot be created try again later");
            }
            outstream << data;
            outstream.close();
            crow::json::wvalue resBody;
            resBody["success"] = true;
            resBody["message"] = "Data Added Successfully To "+table_name;
            return crow::response(200,resBody);
        }catch (const std::exception& e) {
            return crow::response(500, "Unexpected server error: " + string(e.what()));
        }
    });

    // UPDATE DATA (PUT full replace, PATCH partial)
    CROW_ROUTE(app, "/api/v1/data/update-data").methods("PUT"_method, "PATCH"_method)([](const crow::request &req){
        try{
            // Parse with nlohmann::json for robust manipulation
            json body = json::parse(req.body, nullptr, false);
            if(body.is_discarded()){
                return crow::response(400, "Invalid JSON body");
            }
            if(!body.contains("table_name") || !body.contains("db_name") || !body.contains("id") || (!body.contains("data") && !body.contains("items"))){
                return crow::response(400, "No Valid Info Provided");
            }
            string id = body["id"].get<string>();
            string table_name = body["table_name"].get<string>();
            string db_name = body["db_name"].get<string>();
            string user_directory_path = getUserDatabasePath(id);
            if(user_directory_path == ""){
                return crow::response(400, "No Valid User Found");
            }
            string tablepath = user_directory_path+"/"+db_name+"/"+table_name;
            if(!filesystem::exists(user_directory_path+"/"+db_name)){
                return crow::response(400, "Database not found");
            }
            if(!filesystem::exists(tablepath)){
                return crow::response(400, "The Table Does Not Exists");
            }
            string schemaPath = tablepath+"/schema.json";
            if(!filesystem::exists(schemaPath)){
                return crow::response(400, "No schema file linked with this table, Link a schema file first");
            }
            json schemaJson;
            {
                ifstream s(schemaPath);
                if(!s){
                    return crow::response(500, "Internal Server Error, Cannot find linked schema");
                }
                s >> schemaJson;
            }

            auto validate_field = [&](const string &key, const json &val)->std::optional<string>{
                if(!schemaJson.contains(key)) return std::nullopt; // unknown fields allowed
                if(key == "primary") return std::nullopt; // meta
                auto expected = schemaJson[key].get<string>();
                if(expected == "int"){
                    if(!(val.is_number_integer())) return string("Type mismatch for field: ")+key+" (expected int)";
                } else if(expected == "string"){
                    if(!val.is_string()) return string("Type mismatch for field: ")+key+" (expected string)";
                } else if(expected == "boolean"){
                    if(!val.is_boolean()) return string("Type mismatch for field: ")+key+" (expected boolean)";
                }
                return std::nullopt;
            };

            string primaryKeyName = schemaJson.contains("primary") ? schemaJson["primary"].get<string>() : string("");
            if(primaryKeyName == ""){
                return crow::response(500, "Schema missing primary key definition");
            }

            bool isPut = req.method == crow::HTTPMethod::Put;

            // Single update path: data + primary_value
            if(body.contains("data")){
                json data = body["data"];
                if(!data.is_object()) return crow::response(400, "'data' must be an object");

                // Determine current target primary value
                string currentPrimary = body.contains("primary_value") ? body["primary_value"].get<string>() : (data.contains(primaryKeyName) ? data[primaryKeyName].get<string>() : string(""));
                if(currentPrimary == ""){
                    return crow::response(400, (isPut ? "PUT requires primary_value or data[primary]" : "PATCH requires primary_value or data[primary]"));
                }
                string recordPath = tablepath+"/"+currentPrimary+".json";

                if(isPut){
                    // Ensure all required fields exist and types match
                    for(auto &it : schemaJson.items()){
                        const string &key = it.key();
                        if(key == "primary") continue;
                        if(!data.contains(key)){
                            return crow::response(400, "Data is missing required fields"+key);
                        }
                        if(auto err = validate_field(key, data[key])){
                            return crow::response(400, *err);
                        }
                    }
                } else {
                    // For PATCH only validate provided fields
                    for(auto &it : data.items()){
                        const string &key = it.key();
                        if(key == "primary") continue;
                        if(auto err = validate_field(key, it.value())){
                            return crow::response(400, *err);
                        }
                    }
                }

                // Load existing (for PATCH or to check existence)
                json existing;
                if(filesystem::exists(recordPath)){
                    ifstream in(recordPath);
                    if(!in) return crow::response(500, "Failed to open existing record");
                    in >> existing;
                } else {
                    if(!isPut){
                        return crow::response(404, "Record not found for PATCH");
                    }
                    // For PUT, if not exists, we treat as create? We'll enforce existence for clarity.
                    return crow::response(404, "Record not found for PUT");
                }

                // Compute new primary value (may be same or changed)
                string newPrimary = currentPrimary;
                if(data.contains(primaryKeyName)){
                    newPrimary = data[primaryKeyName].get<string>();
                }

                json updated = existing;
                if(isPut){
                    updated = data; // replace entire document
                } else {
                    for(auto &it : data.items()){
                        updated[it.key()] = it.value();
                    }
                }

                string newPath = tablepath+"/"+newPrimary+".json";
                if(newPrimary != currentPrimary){
                    if(filesystem::exists(newPath)){
                        return crow::response(409, "A record with the new primary already exists");
                    }
                    // rename file path after write succeeds
                }

                // Write to temp then move (simple atomic-ish behaviour)
                string tmpPath = recordPath + ".tmp";
                {
                    ofstream out(tmpPath);
                    if(!out) return crow::response(500, "Failed to write temp record file");
                    out << updated.dump();
                }
                // If primary changed, move files accordingly
                if(newPrimary != currentPrimary){
                    filesystem::rename(tmpPath, newPath);
                    if(filesystem::exists(recordPath)) filesystem::remove(recordPath);
                } else {
                    filesystem::rename(tmpPath, recordPath);
                }

                crow::json::wvalue res;
                res["success"] = true;
                res["message"] = (isPut ? "Record replaced successfully" : "Record updated successfully");
                res["primary_value"] = newPrimary;
                return crow::response(200, res);
            }

            // Bulk update path: items array
            if(!body.contains("items") || !body["items"].is_array()){
                return crow::response(400, "For bulk update, provide 'items' as an array");
            }

            json results = json::array();
            for(auto &item : body["items"]){
                json result;
                try{
                    if(!item.contains("data")){
                        result = {{"success", false}, {"error", "Missing data"}};
                        results.push_back(result);
                        continue;
                    }
                    json data = item["data"];
                    string currentPrimary = item.contains("primary_value") ? item["primary_value"].get<string>() : (data.contains(primaryKeyName) ? data[primaryKeyName].get<string>() : string(""));
                    if(currentPrimary == ""){
                        result = {{"success", false}, {"error", "Missing primary_value"}};
                        results.push_back(result);
                        continue;
                    }
                    string recordPath = tablepath+"/"+currentPrimary+".json";
                    if(!filesystem::exists(recordPath)){
                        result = {{"success", false}, {"error", "Record not found"}, {"primary_value", currentPrimary}};
                        results.push_back(result);
                        continue;
                    }
                    // Validate provided fields only (PATCH semantics for bulk)
                    bool typeError = false;
                    string typeErrMsg;
                    for(auto &it : data.items()){
                        const string &key = it.key();
                        if(key == "primary") continue;
                        if(auto err = validate_field(key, it.value())){
                            typeError = true; typeErrMsg = *err; break;
                        }
                    }
                    if(typeError){
                        result = {{"success", false}, {"error", typeErrMsg}, {"primary_value", currentPrimary}};
                        results.push_back(result);
                        continue;
                    }
                    json existing;
                    {
                        ifstream in(recordPath);
                        if(!in){
                            result = {{"success", false}, {"error", "Failed opening record"}, {"primary_value", currentPrimary}};
                            results.push_back(result);
                            continue;
                        }
                        in >> existing;
                    }
                    string newPrimary = currentPrimary;
                    if(data.contains(primaryKeyName)) newPrimary = data[primaryKeyName].get<string>();
                    json updated = existing;
                    for(auto &it : data.items()){
                        updated[it.key()] = it.value();
                    }
                    string newPath = tablepath+"/"+newPrimary+".json";
                    if(newPrimary != currentPrimary && filesystem::exists(newPath)){
                        result = {{"success", false}, {"error", "Primary collision"}, {"primary_value", currentPrimary}};
                        results.push_back(result);
                        continue;
                    }
                    string tmpPath = recordPath + ".tmp";
                    {
                        ofstream out(tmpPath);
                        if(!out){
                            result = {{"success", false}, {"error", "Failed writing temp"}, {"primary_value", currentPrimary}};
                            results.push_back(result);
                            continue;
                        }
                        out << updated.dump();
                    }
                    if(newPrimary != currentPrimary){
                        filesystem::rename(tmpPath, newPath);
                        if(filesystem::exists(recordPath)) filesystem::remove(recordPath);
                    } else {
                        filesystem::rename(tmpPath, recordPath);
                    }
                    result = {{"success", true}, {"primary_value", newPrimary}};
                }catch(const std::exception &e){
                    result = {{"success", false}, {"error", string("Exception: ")+e.what()}};
                }
                results.push_back(result);
            }

            crow::json::wvalue res;
            res["success"] = true;
            res["results"] = crow::json::load(results.dump());
            return crow::response(200, res);
        }catch(const std::exception &e){
            return crow::response(500, "Unexpected server error: " + string(e.what()));
        }
    });
//!GET DATA
//GET ALL DATA
    //GET SCHEMA
    CROW_ROUTE(app, "/api/v1/data").methods("GET"_method)([](const crow::request &req){
        auto queryparams = req.url_params;
        string id = queryparams.get("id");
        string db_name = queryparams.get("db_name");
        string table_name = queryparams.get("table_name");
        string userpath = getUserDatabasePath(id);
        if(userpath == ""){
            return crow::response(400, "user path not found");
        }
        string tablepath = userpath+"/"+db_name+"/"+table_name;
        vector<string> dataArray;
        for(const auto &entry : filesystem::directory_iterator(tablepath)){
            if(entry.path().filename().string() == "schema.json"){
                continue;
            }
            string currentPath = tablepath+"/"+entry.path().filename().string();
            json newData;
            ifstream instream(currentPath);
            if(!instream){
                return crow::response(400, "Something went wrong while fetching the file path");
            }
            instream>>newData;
            instream.close();
            string newDataString = newData.dump();
            dataArray.push_back(newDataString);
        }
        crow::json::wvalue jsonData;
        jsonData["success"] = true;
        jsonData["data"] = dataArray;
        return crow::response(200,jsonData);
    });

    // DELETE single record
    CROW_ROUTE(app, "/api/v1/data/delete-data").methods("DELETE"_method)([](const crow::request &req){
        try{
            json body = json::parse(req.body, nullptr, false);
            if(body.is_discarded()){
                return crow::response(400, "Invalid JSON body");
            }
            if(!body.contains("table_name") || !body.contains("db_name") || !body.contains("id") || !body.contains("primary_value")){
                return crow::response(400, "Missing required fields: id, db_name, table_name, primary_value");
            }
            string id = body["id"].get<string>();
            string table_name = body["table_name"].get<string>();
            string db_name = body["db_name"].get<string>();
            string primary_value = body["primary_value"].get<string>();

            string userpath = getUserDatabasePath(id);
            if(userpath == "") return crow::response(400, "No Valid User Found");
            string tablepath = userpath+"/"+db_name+"/"+table_name;
            if(!filesystem::exists(tablepath)) return crow::response(400, "The Table Does Not Exists");

            string recordPath = tablepath+"/"+primary_value+".json";
            if(!filesystem::exists(recordPath)) return crow::response(404, "Record not found");
            if(!filesystem::remove(recordPath)) return crow::response(500, "Failed to delete record");

            crow::json::wvalue res;
            res["success"] = true;
            res["message"] = "Record deleted successfully";
            res["primary_value"] = primary_value;
            return crow::response(200, res);
        }catch(const std::exception &e){
            return crow::response(500, "Unexpected server error: " + string(e.what()));
        }
    });

    // DELETE bulk records
    CROW_ROUTE(app, "/api/v1/data/bulk-delete").methods("DELETE"_method)([](const crow::request &req){
        try{
            json body = json::parse(req.body, nullptr, false);
            if(body.is_discarded()){
                return crow::response(400, "Invalid JSON body");
            }
            if(!body.contains("table_name") || !body.contains("db_name") || !body.contains("id") || !body.contains("primary_values")){
                return crow::response(400, "Missing required fields: id, db_name, table_name, primary_values");
            }
            string id = body["id"].get<string>();
            string table_name = body["table_name"].get<string>();
            string db_name = body["db_name"].get<string>();
            if(!body["primary_values"].is_array()) return crow::response(400, "primary_values must be an array");

            string userpath = getUserDatabasePath(id);
            if(userpath == "") return crow::response(400, "No Valid User Found");
            string tablepath = userpath+"/"+db_name+"/"+table_name;
            if(!filesystem::exists(tablepath)) return crow::response(400, "The Table Does Not Exists");

            json results = json::array();
            int deleted = 0;
            for(auto &pv : body["primary_values"]){
                json r;
                try{
                    string primary_value = pv.get<string>();
                    string recordPath = tablepath+"/"+primary_value+".json";
                    if(!filesystem::exists(recordPath)){
                        r = {{"success", false}, {"primary_value", primary_value}, {"error", "Record not found"}};
                    } else if(!filesystem::remove(recordPath)){
                        r = {{"success", false}, {"primary_value", primary_value}, {"error", "Failed to delete"}};
                    } else {
                        r = {{"success", true}, {"primary_value", primary_value}};
                        deleted++;
                    }
                }catch(const std::exception &e){
                    r = {{"success", false}, {"error", string("Exception: ")+e.what()}};
                }
                results.push_back(r);
            }

            crow::json::wvalue res;
            res["success"] = true;
            res["deleted"] = deleted;
            res["results"] = crow::json::load(results.dump());
            return crow::response(200, res);
        }catch(const std::exception &e){
            return crow::response(500, "Unexpected server error: " + string(e.what()));
        }
    });
}
