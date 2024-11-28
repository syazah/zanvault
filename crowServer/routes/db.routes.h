#pragma once
#include "crow.h"
#include "utils/getUserDatabasePath.h"
#include <fstream>
#include <filesystem>
#include <nlohmann/json.hpp>
using namespace std;

using json  = nlohmann::json;
void setup_db_routes(crow::SimpleApp &app){
//CREATING TABLE
    CROW_ROUTE(app, "/api/v1/database/create-table").methods("POST"_method)([](const crow::request &req){
        auto jsonBody = crow::json::load(req.body);
        if(!jsonBody.has("id") || !jsonBody.has("table_name") || !jsonBody.has("db_name")){
            return crow::response("No Valid Info Provided");
        }
        string id = jsonBody["id"].s();
        string tableName = jsonBody["table_name"].s();
        string db_name = jsonBody["db_name"].s();
        string user_directory_path =getUserDatabasePath(id);
        if(user_directory_path == ""){
            return crow::response(400, "No user found with this id");
        }

        if(!filesystem::exists(user_directory_path+"/"+db_name)){
            return crow::response(400, "Database not found");
        }
        if(filesystem::exists(user_directory_path+"/"+db_name+"/"+tableName+"s")){
            return crow::response(400, "The Table with this name already exists");
        }
        if(!filesystem::create_directory(user_directory_path+"/"+db_name+"/"+tableName+"s")){
            return crow::response(400, "Table Can't be created something went wrong");
        }
        return crow::response(200, "Table Created Successfully");
    });
//ADDING SCHEMA FILE
    CROW_ROUTE(app, "/api/v1/database/create-schema").methods("POST"_method)([](const crow::request &req){
        auto jsonBody = crow::json::load(req.body);
        if(!jsonBody.has("id")||!jsonBody.has("table_name") || !jsonBody.has("db_name") || !jsonBody.has("schema")){
            return crow::response(400, "No valid information provided");
        }
        string id = jsonBody["id"].s();
        string table_name = jsonBody["table_name"].s();
        string db_name = jsonBody["db_name"].s();
        auto schema = jsonBody["schema"];
        string user_directory_path = getUserDatabasePath(id);
        if(user_directory_path == ""){
            return crow::response(400, "No user found");
        }
        if(!filesystem::exists(user_directory_path+"/"+db_name)){
             return crow::response(400, "Your Database File Does not exists");
        }
        if(!filesystem::exists(user_directory_path+"/"+db_name+"/"+table_name)){
             return crow::response(400, "Your Table Does not exists");
        }
        if(filesystem::exists(user_directory_path+"/"+db_name+"/"+table_name+"/"+"schema.json")){
            return crow::response(400, "A schema file already exists for this table, can't create a new one, try editing the file");
        }
        string schemaFilePath = user_directory_path+"/"+db_name+"/"+table_name+"/schema.json";
        ofstream outstream(schemaFilePath);
        if(!outstream){
            return crow::response(500, "Schema File Cannot be created try again later");
        }
        outstream << schema;
        outstream.close();
        return crow::response(200, "Your schema file is created");
    });
//ADDING XCHEMA 
}
