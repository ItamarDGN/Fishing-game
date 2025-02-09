#ifndef SERVER_H
#define SERVER_H

#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <boost/beast/websocket.hpp>
#include <string>
#include <set>
#include <memory>

namespace beast = boost::beast;
namespace websocket = beast::websocket;
namespace asio = boost::asio;
using tcp = asio::ip::tcp;

class Server {
private:
    asio::io_context ioc;
    tcp::acceptor acceptor;
    std::set<std::shared_ptr<websocket::stream<tcp::socket>>> clients;

    void accept_connections();
    void handle_websocket(tcp::socket socket);
    void listen_for_messages(std::shared_ptr<websocket::stream<tcp::socket>> ws);

public:
    explicit Server(int port);
    void start();
};

#endif
