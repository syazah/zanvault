#pragma once
#include "crow.h"
#include <fstream>
#include <filesystem>
#include <nlohmann/json.hpp>
using namespace std;

using json  = nlohmann::json;
void setup_db_routes(crow::SimpleApp &app){
//CREATING TABLE
    CROW_ROUTE(app, "/api/v1/database/create-table").methods("POST"_method)([](const crow::request &req){

    });
}
