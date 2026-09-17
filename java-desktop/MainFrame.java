import javax.swing.*;
import java.awt.*;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.InetSocketAddress;
import java.net.URI;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
            server.createContext("/api/upload", MainFrame::handleUpload);
            server.setExecutor(null);
            server.start();
            System.out.println("Java HTTP listener running on http://localhost:8080");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void handleUpload(HttpExchange exchange) throws IOException {
        addCorsHeaders(exchange);

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendJson(exchange, 405, "{\"error\":\"Only POST is supported.\"}");
            return;
        }

        String contentType = exchange.getRequestHeaders().getFirst("Content-Type");
        Matcher boundaryMatcher = Pattern.compile("boundary=([^;]+)").matcher(contentType == null ? "" : contentType);
        if (!boundaryMatcher.find()) {
            sendJson(exchange, 400, "{\"error\":\"A multipart file upload is required.\"}");
            return;
        }

        byte[] requestBody = exchange.getRequestBody().readAllBytes();
        if (requestBody.length > 11 * 1024 * 1024) {
            sendJson(exchange, 413, "{\"error\":\"The upload is larger than 10 MB.\"}");
            return;
        }

        String boundary = "--" + boundaryMatcher.group(1).replace("\"", "");
        String body = new String(requestBody, StandardCharsets.ISO_8859_1);
        Matcher fileMatcher = Pattern.compile(
                "Content-Disposition: form-data;[^\\r\\n]*name=\"file\"; filename=\"([^\"]+)\"\\r\\n(?:[^\\r\\n]*\\r\\n)*\\r\\n",
                Pattern.CASE_INSENSITIVE).matcher(body);
        if (!fileMatcher.find()) {
            sendJson(exchange, 400, "{\"error\":\"No PDF file was provided.\"}");
            return;
        }

        String fileName = Paths.get(fileMatcher.group(1)).getFileName().toString();
        if (!fileName.toLowerCase().endsWith(".pdf")) {
            sendJson(exchange, 400, "{\"error\":\"Only PDF documents can be uploaded.\"}");
            return;
        }

        int fileStart = fileMatcher.end();
        int fileEnd = body.indexOf("\r\n" + boundary, fileStart);
        if (fileEnd < fileStart) {
            sendJson(exchange, 400, "{\"error\":\"The uploaded file is invalid.\"}");
            return;
        }

        byte[] fileBytes = new byte[fileEnd - fileStart];
        System.arraycopy(requestBody, fileStart, fileBytes, 0, fileBytes.length);
        if (fileBytes.length > 10 * 1024 * 1024) {
            sendJson(exchange, 413, "{\"error\":\"The PDF must be 10 MB or smaller.\"}");
            return;
        }

        Path uploadDirectory = Paths.get("..", "javabackend", "uploads").toAbsolutePath().normalize();
        Files.createDirectories(uploadDirectory);
        Path destination = uploadDirectory.resolve(System.currentTimeMillis() + "-" + fileName);
        Files.write(destination, fileBytes);
        sendJson(exchange, 200, "{\"status\":\"success\",\"fileName\":\"" + jsonEscape(fileName) + "\"}");
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendJson(HttpExchange exchange, int statusCode, String body) throws IOException {
        byte[] response = body.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, response.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(response);
        }
    }

    private static String jsonEscape(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
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