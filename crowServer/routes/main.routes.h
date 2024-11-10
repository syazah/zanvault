#pragma once
#include "crow.h"
#include <fstream>
#include <filesystem>
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
        outfile << "{\n";
        outfile << "  \"name\": \"" << name << "\",\n";
        outfile << "  \"username\": \"" << username << "\",\n";
        outfile << "  \"password\": \"" << password << "\"\n";
        outfile << "}\n";
        outfile.close();

        return crow::response(200, "User Created Successfully");
    });
// LOGIN USER
    CROW_ROUTE(app, "/api/v1/login-user").methods("POST"_method)([](const crow::request&req){
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
    });
// CREATING A DATABASE
    CROW_ROUTE(app, "/api/v1/create-database").methods("POST"_method)([](const crow::request &req){
        auto json_body = crow::json::load(req.body);
        if(!json_body){
            return crow::response(400, "No Body found");
        }
        if (!json_body.has("db_name") || !json_body.has("username") || !json_body.has("password")) {
            return crow::response(400, "Missing required fields");
        }


        string db_name = json_body["db_name"].s();
        string username = json_body["username"].s();
        string password = json_body["password"].s();

        if(find(username.begin(), username.end(), ' ') != username.end()){
            return crow::response(500, "Username cannot contain spaces");
        }
        ifstream instream(username+"/"+username+"credentials.json");
        if (!instream) {
            return crow::response(400, "Cannot read credentials");
        }
        json jsonData;
        instream >> jsonData;
        if(username != jsonData["username"]){
            return crow::response(500, "User with this username not found");
        }
        if(password != jsonData["password"]){
            return crow::response(500, "Password is incorrect");
        }
        string foldername = username+'/'+db_name;
        if (filesystem::exists(foldername)) {
            return crow::response(409, "Database with name '" + db_name + "' already exists for user '" + username + "'");
        }
        if (!filesystem::create_directory(foldername)) {
            return crow::response(500, "Failed to create database directory");
        }
        return crow::response(200, "Database Created Successfully");
    });
}
