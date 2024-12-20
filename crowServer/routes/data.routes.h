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
                    string primaryKey = schemaJson["primary"];
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
}
