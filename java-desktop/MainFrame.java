import javax.swing.*;
import java.awt.*;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.URI;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

public class MainFrame {
    private static JLabel statusLabel;

    public static void main(String[] args) {
        // Start lightweight local HTTP server on port 8080 to receive API calls from React
        startLocalServer();

        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Cora Desktop App");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(500, 250);
            frame.setLocationRelativeTo(null);
            frame.setLayout(new BorderLayout(10, 10));

            JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 20));
            JButton scanButton = new JButton("Open Scanning");
            JButton searchButton = new JButton("Open Patient Search");

            scanButton.addActionListener(e -> openWebModule("http://localhost:5173/?module=scanning"));
            searchButton.addActionListener(e -> openWebModule("http://localhost:5173/?module=patient-search&patientId=PT-9842"));

            buttonPanel.add(scanButton);
            buttonPanel.add(searchButton);

            statusLabel = new JLabel("Status: Waiting for actions...", SwingConstants.CENTER);
            statusLabel.setFont(new Font("SansSerif", Font.PLAIN, 12));

            frame.add(buttonPanel, BorderLayout.CENTER);
            frame.add(statusLabel, BorderLayout.SOUTH);
            frame.setVisible(true);
        });
    }

    private static void startLocalServer() {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
            server.createContext("/api/notify", new HttpHandler() {
                @Override
                public void handle(HttpExchange exchange) {
                    try {
                        // Handle CORS preflight request from browser
                        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
                        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

                        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                            exchange.sendResponseHeaders(204, -1);
                            return;
                        }

                        // Read request body
                        InputStream is = exchange.getRequestBody();
                        String body = new String(is.readAllBytes());

                        // Update Java UI status on main thread
                        SwingUtilities.invokeLater(() -> {
                            statusLabel.setText("Status Received from React: " + body);
                        });

                        String response = "{\"status\":\"success\"}";
                        exchange.sendResponseHeaders(200, response.length());
                        OutputStream os = exchange.getResponseBody();
                        os.write(response.getBytes());
                        os.close();
                    } catch (Exception ex) {
                        ex.printStackTrace();
                    }
                }
            });
            server.setExecutor(null);
            server.start();
            System.out.println("Java HTTP listener running on http://localhost:8080");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void openWebModule(String url) {
        try {
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                Desktop.getDesktop().browse(new URI(url));
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}