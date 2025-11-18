cmake_minimum_required(VERSION 3.20)
project(CrowApi LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT DEFINED CMAKE_TOOLCHAIN_FILE)
    set(CMAKE_TOOLCHAIN_FILE "${CMAKE_SOURCE_DIR}/vcpkg/scripts/buildsystems/vcpkg.cmake"
        CACHE STRING "VCPKG toolchain file")
endif()

find_package(Crow CONFIG REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)

add_executable(crow_api
    main.cpp
)

target_link_libraries(crow_api PRIVATE
    Crow::Crow
    asio::asio
    nlohmann_json::nlohmann_json
)

target_include_directories(crow_api PRIVATE
    ${CMAKE_SOURCE_DIR}
    ${CMAKE_SOURCE_DIR}/routes
    ${CMAKE_SOURCE_DIR}/utils
)
