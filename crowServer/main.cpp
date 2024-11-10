#include "crow.h"
#include "routes/main.routes.h"
#include <filesystem>
int main() {
    crow::SimpleApp app;
    setup_routes(app);
    app.port(8000).multithreaded().run();
}
