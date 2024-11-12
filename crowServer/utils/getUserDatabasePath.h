#pragma once
#include <fstream>
#include <filesystem>
#include <nlohmann/json.hpp>
using namespace std;

using json  = nlohmann::json;
string getUserDatabasePath(string id){
    for(const auto &entry : filesystem::directory_iterator(".")){
        if(entry.is_directory()){
            string username = entry.path().filename().string();
            string credentialsPath = entry.path().string()+"/"+username+"credentials.json";
            ifstream instream(credentialsPath);
            if(instream){
                json jsonData;
                instream>>jsonData;
                instream.close();
                if(jsonData.contains("id") && jsonData["id"] == id){
                     return entry.path().string();
                }
            }
        }
    }
    return "";
}
