package com.smartcanteen.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

public class EnvUtil {
    private static final Map<String, String> envMap = new HashMap<>();

    static {
        // 1. Try to load from classpath (.env placed in resources or source directory)
        try (InputStream is = EnvUtil.class.getClassLoader().getResourceAsStream(".env")) {
            if (is != null) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
                    loadFromReader(reader);
                }
            }
        } catch (Exception e) {
            // Ignore, try other locations
        }

        // 2. Try to load from current working directory or parent directories (useful for development)
        if (envMap.isEmpty()) {
            File currentDir = new File(".").getAbsoluteFile();
            while (currentDir != null) {
                File envFile = new File(currentDir, ".env");
                if (envFile.exists() && envFile.isFile()) {
                    try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                        loadFromReader(reader);
                        break;
                    } catch (Exception e) {
                        // Ignore
                    }
                }
                currentDir = currentDir.getParentFile();
            }
        }

        // 3. Fallback: try catalina.base (Tomcat directory)
        if (envMap.isEmpty()) {
            String catalinaBase = System.getProperty("catalina.base");
            if (catalinaBase != null) {
                File envFile = new File(catalinaBase, ".env");
                if (envFile.exists() && envFile.isFile()) {
                    try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                        loadFromReader(reader);
                    } catch (Exception e) {
                        // Ignore
                    }
                }
            }
        }
    }

    private static void loadFromReader(BufferedReader reader) throws Exception {
        String line;
        while ((line = reader.readLine()) != null) {
            line = line.trim();
            if (line.isEmpty() || line.startsWith("#")) {
                continue;
            }
            int eqIdx = line.indexOf('=');
            if (eqIdx > 0) {
                String key = line.substring(0, eqIdx).trim();
                String value = line.substring(eqIdx + 1).trim();
                // Strip quotes if any
                if (value.startsWith("\"") && value.endsWith("\"") && value.length() >= 2) {
                    value = value.substring(1, value.length() - 1);
                } else if (value.startsWith("'") && value.endsWith("'") && value.length() >= 2) {
                    value = value.substring(1, value.length() - 1);
                }
                envMap.put(key, value);
            }
        }
    }

    public static String get(String key) {
        // System environment variables take priority (standard on cloud hosts)
        String value = System.getenv(key);
        if (value != null) {
            return value;
        }
        // Fallback to parsed .env file properties
        return envMap.get(key);
    }

    public static String get(String key, String defaultValue) {
        String val = get(key);
        return val != null ? val : defaultValue;
    }
}
