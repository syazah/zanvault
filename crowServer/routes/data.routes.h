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
        auto reqBody = crow::json::load(req.body);
        if(!reqBody.has("table_name") || !reqBody.has("db_name") || !reqBody.has("id")){
            return crow::response("No Valid Info Provided");
        }
        string id = reqBody["id"].s();
        string table_name = reqBody["table_name"].s();
        string db_name = reqBody["db_name"].s();
        string user_directory_path = getUserDatabasePath(id);
        if(user_directory_path == ""){
            return crow::response("No Valid User Found");
        }
         if(!filesystem::exists(user_directory_path+"/"+db_name)){
            return crow::response(400, "Database not found");
        }
        if(!filesystem::exists(user_directory_path+"/"+db_name+"/"+table_name+"s")){
            return crow::response(400, "The Table with this name already exists");
        }
        if(!filesystem::exists(user_directory_path+"/"+db_name+"/"+table_name+"s"+"/"+"schema.json")){
            return crow::response(400, "No schema file linked with this table, Link a schema file first");
        }
        ifstream instream(user_directory_path+"/"+db_name+"/"+table_name+"s"+"/"+"schema.json");
        if(!instream){
            return crow::response(500, "Internal Server Error, Cannot find linked schema");
        }
        json jsonData;
        instream>>jsonData;
        instream.close();
        auto schemaString = jsonData.dump();
        auto schemaWvalue = crow::json::load(schemaString);
        crow::json::wvalue resBody;
        resBody["success"] = true;
        resBody["schema"] = schemaWvalue;
        return crow::response(200,resBody);
    });
}
