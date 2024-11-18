cmake_minimum_required(VERSION 3.10)
project(CrowApi)

set(CMAKE_CXX_STANDARD 17)

# Specify the path to the vcpkg toolchain file
set(VCPKG_ROOT "C:/Users/Hp/vcpkg")
list(APPEND CMAKE_TOOLCHAIN_FILE "${VCPKG_ROOT}/scripts/buildsystems/vcpkg.cmake")

# Include directories for Crow and Asio
include_directories("C:/Users/Hp/vcpkg/installed/x64-windows/include")

# Add your executable
add_executable(crow_api main.cpp)
add_compile_options(/FS)


# As both Crow and Asio are header-only, no linking required
