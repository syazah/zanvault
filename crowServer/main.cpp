#include "crow.h"
#include "routes/main.routes.h"
#include "routes/db.routes.h"
#include "routes/query.routes.h"
#include "routes/data.routes.h"
#include <filesystem>
int main() {
    crow::SimpleApp app;
    setup_routes(app);
    setup_db_routes(app);
    setup_query_routes(app);
    setup_data_routes(app);
    app.port(8000).multithreaded().run();
}
