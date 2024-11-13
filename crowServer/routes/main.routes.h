#pragma once
#include "crow.h"
#include "utils/getUserDatabasePath.h"
#include <fstream>
#include <filesystem>
#include <random>
#include "utils/randomIDGenerator.h"
#include <nlohmann/json.hpp>
using namespace std;

using json  = nlohmann::json;
void setup_routes(crow::SimpleApp &app){
// CREATING USER
    CROW_ROUTE(app, "/api/v1/create-user").methods("POST"_method)([](const crow::request &req){
        auto json_body = crow::json::load(req.body);
        if(!json_body){
            return crow::response(400, "No Body found");
        }
        if (!json_body.has("username") || !json_body.has("name") || !json_body.has("password")) {
            return crow::response(400, "Missing required fields");
        }
        string name = json_body["name"].s();
        string username = json_body["username"].s();
        string password = json_body["password"].s();
        if(filesystem::exists(username)){
            return crow::response(400, "User with this username already exists");
        }
        if(!filesystem::create_directory(username)){
            return crow::response(400, "Something went wrong while creating the user");
        }
        string filename = username+"credentials.json";
        ofstream outfile(username+"/"+filename);
        if (!outfile) {
            return crow::response(500, "Failed to create credentials file");
        }
        string id = generateRandomID(10);
        outfile << "{\n";
        outfile << "  \"id\": \"" << id << "\",\n";
        outfile << "  \"name\": \"" << name << "\",\n";
        outfile << "  \"username\": \"" << username << "\",\n";
        outfile << "  \"password\": \"" << password << "\"\n";
        outfile << "}\n";
        outfile.close();
        crow::json::wvalue resBody;
        resBody["success"] = true;
        resBody["id"] = id;
        return crow::response(200, resBody);
    });
// LOGIN USER
    CROW_ROUTE(app, "/api/v1/login-user").methods("POST"_method)([](const crow::request&req){
        auto json_body = crow::json::load(req.body);
        if(!json_body){
            return crow::response(400, "No Body found");
        }
        if (!json_body.has("username") || !json_body.has("password")) {
            return crow::response(400, "Missing required fields");
        }
        string username = json_body["username"].s();
        string password = json_body["password"].s();
        ifstream instream(username+"/"+username+"credentials.json");
        if(!instream){
            return crow::response(400,"User Not Found");
        }
        json jsonData;
        instream >> jsonData;
        if(username != jsonData["username"]){
            return crow::response(500, "User with this username not found");
        }
        if(password != jsonData["password"]){
            return crow::response(500, "Password is incorrect");
        }
        string id = jsonData["id"];
        instream.close();
        crow::json::wvalue resBody;
        resBody["success"] = true;
        resBody["id"] = id;
        return crow::response(200, id);
    });
// CREATING A DATABASE
    CROW_ROUTE(app, "/api/v1/create-database").methods("POST"_method)([](const crow::request&req){
        auto jsonBody = crow::json::load(req.body);
        if(!jsonBody.has("id") || !jsonBody.has("db_name")){
            return crow::response(200, "No Valid Credentials");
        }
        string id = jsonBody["id"].s();
        string db_name = jsonBody["db_name"].s();
        bool idExist = false;

        //CHECKING IF ID EXISTS
        string user_directory_path = getUserDatabasePath(id);
        if(user_directory_path == ""){
            return crow::response(400,"User Not Found");
        }
        if(filesystem::exists(user_directory_path+"/"+db_name)){
            return crow::response(400, "Database Already exists, give a database with new name");
        }
        if(!filesystem::create_directory(user_directory_path+"/"+db_name)){
            return crow::response(400, "Something went wrong while creating a database");
        }
        return crow::response(200, "Database Created");
    });
}
