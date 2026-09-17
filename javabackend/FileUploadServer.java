import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FileUploadServer {
    private static final int MAX_FILE_SIZE = 10 * 1024 * 1024;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/api/upload", FileUploadServer::handleUpload);
        server.setExecutor(null);
        server.start();
        System.out.println("File upload server listening on http://localhost:8080");
        System.out.println("Files are stored in " + Paths.get("uploads").toAbsolutePath());
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
        if (requestBody.length > MAX_FILE_SIZE + 1024 * 1024) {
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
        if (fileBytes.length > MAX_FILE_SIZE) {
            sendJson(exchange, 413, "{\"error\":\"The PDF must be 10 MB or smaller.\"}");
            return;
        }

        Path uploadDirectory = Paths.get("uploads").toAbsolutePath().normalize();
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
}