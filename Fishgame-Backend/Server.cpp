#include "Server.h"
#include <iostream>
#include <memory>
#include <thread>

Server::Server(int port) : ioc(), acceptor(ioc, tcp::endpoint(tcp::v4(), port)) {}

void Server::start() {
    std::cout << "🚀 WebSocket Server running on port " << acceptor.local_endpoint().port() << std::endl;
    accept_connections();
    ioc.run();
}

void Server::accept_connections() {
    acceptor.async_accept([this](beast::error_code ec, tcp::socket socket) {
        if (!ec) {
            std::cout << "🔗 New connection attempt received" << std::endl;
            handle_websocket(std::move(socket));
        }
        else {
            std::cerr << "❌ Accept failed: " << ec.message() << std::endl;
        }
        accept_connections();
        });
}

void Server::handle_websocket(tcp::socket socket) {
    auto ws = std::make_shared<websocket::stream<tcp::socket>>(std::move(socket));

    ws->async_accept([this, ws](beast::error_code ec) {
        if (ec) {
            std::cerr << "❌ WebSocket handshake failed: " << ec.message() << std::endl;
            return;
        }

        std::cout << "🟢 WebSocket connection established!" << std::endl;
        listen_for_messages(ws);
        });
}

void Server::listen_for_messages(std::shared_ptr<websocket::stream<tcp::socket>> ws) {
    auto buffer = std::make_shared<beast::flat_buffer>();

    ws->async_read(*buffer, [this, ws, buffer](beast::error_code ec, std::size_t bytes_transferred) {
        if (ec) {
            std::cerr << "❌ WebSocket read error: " << ec.message() << std::endl;
            return;
        }

        std::string message = beast::buffers_to_string(buffer->data());
        std::cout << "📩 Received: " << message << std::endl;

        ws->async_write(asio::buffer("Message received"), [this, ws](beast::error_code ec, std::size_t) {
            if (ec) {
                std::cerr << "❌ WebSocket write error: " << ec.message() << std::endl;
            }
            listen_for_messages(ws);
            });
        });
}
