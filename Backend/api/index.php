<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function respondJson(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function pathSegments(): array
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));

    if ($scriptDir !== '/' && $scriptDir !== '.') {
        $path = preg_replace('#^' . preg_quote($scriptDir, '#') . '#', '', (string)$path);
    }

    $path = trim((string)$path, '/');
    $segments = $path === '' ? [] : explode('/', $path);

    // Support both rewritten and non-rewritten paths on XAMPP deployments.
    if (count($segments) >= 2 && $segments[0] === 'sansys-backend' && $segments[1] === 'api') {
        $segments = array_slice($segments, 2);
    }

    if (count($segments) >= 1 && $segments[0] === 'api') {
        $segments = array_slice($segments, 1);
    }

    if (count($segments) >= 1 && $segments[0] === 'index.php') {
        $segments = array_slice($segments, 1);
    }

    return $segments;
}

function isoTimestamp(string $value): string
{
    $date = new DateTime($value, new DateTimeZone('Asia/Manila'));
    $date->setTimezone(new DateTimeZone('UTC'));
    return $date->format('Y-m-d\\TH:i:s\\Z');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$segments = pathSegments();

try {
    $pdo = getPdo();

    // POST /api/sensor
    if ($method === 'POST' && $segments === ['sensor']) {
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw ?: '{}', true);

        if (!is_array($payload)) {
            respondJson(400, ['error' => 'Invalid JSON payload']);
        }

        $sensorId = trim((string)($payload['sensor_id'] ?? ''));
        $location = trim((string)($payload['location'] ?? ''));
        $temperature = $payload['temperature'] ?? null;
        $humidity = $payload['humidity'] ?? null;
        $ldrRaw = $payload['ldr_raw'] ?? null;
        $daytime = isset($payload['daytime']) ? (int)!!$payload['daytime'] : 0;

        if ($sensorId === '' || $location === '' || !is_numeric($temperature) || !is_numeric($humidity) || !is_numeric($ldrRaw)) {
            respondJson(400, [
                'error' => 'Missing or invalid fields',
                'required' => ['sensor_id', 'location', 'temperature', 'humidity', 'ldr_raw']
            ]);
        }

        $temperature = (float)$temperature;
        $humidity = (float)$humidity;
        $ldrRaw = (int)$ldrRaw;

        $now = (new DateTime('now', new DateTimeZone('Asia/Manila')))->format('Y-m-d H:i:s');

        $upsertSensor = $pdo->prepare(
            'INSERT INTO sensors (id, location, last_temperature, last_humidity, last_ldr_raw, last_daytime, last_updated)
             VALUES (:id, :location, :temperature, :humidity, :ldr_raw, :daytime, :last_updated)
             ON DUPLICATE KEY UPDATE
                location = VALUES(location),
                last_temperature = VALUES(last_temperature),
                last_humidity = VALUES(last_humidity),
                last_ldr_raw = VALUES(last_ldr_raw),
                last_daytime = VALUES(last_daytime),
                last_updated = VALUES(last_updated)'
        );
        $upsertSensor->execute([
            ':id' => $sensorId,
            ':location' => $location,
            ':temperature' => $temperature,
            ':humidity' => $humidity,
            ':ldr_raw' => $ldrRaw,
            ':daytime' => $daytime,
            ':last_updated' => $now,
        ]);

        $insertReading = $pdo->prepare(
            'INSERT INTO sensor_readings (sensor_id, location, temperature, humidity, ldr_raw, daytime, created_at)
             VALUES (:sensor_id, :location, :temperature, :humidity, :ldr_raw, :daytime, :created_at)'
        );
        $insertReading->execute([
            ':sensor_id' => $sensorId,
            ':location' => $location,
            ':temperature' => $temperature,
            ':humidity' => $humidity,
            ':ldr_raw' => $ldrRaw,
            ':daytime' => $daytime,
            ':created_at' => $now,
        ]);

        respondJson(201, ['message' => 'Sensor reading stored', 'sensor_id' => $sensorId]);
    }

    // GET /api/sensors
    if ($method === 'GET' && $segments === ['sensors']) {
        $stmt = $pdo->query(
            'SELECT s.id, s.location, s.last_temperature, s.last_humidity, s.last_updated,
                    COALESCE(r.logs_count, 0) AS logs_count
             FROM sensors s
             LEFT JOIN (
                SELECT sensor_id, COUNT(*) AS logs_count
                FROM sensor_readings
                GROUP BY sensor_id
             ) r ON r.sensor_id = s.id
             ORDER BY s.id ASC'
        );
        $rows = $stmt->fetchAll();

        $response = array_map(static function (array $row): array {
            $updated = (string)$row['last_updated'];
            $updatedUtc = isoTimestamp($updated);

            $isActive = (time() - strtotime($updated)) <= 60;

            return [
                'id' => (string)$row['id'],
                'location' => (string)$row['location'],
                'temperature' => (float)$row['last_temperature'],
                'humidity' => (float)$row['last_humidity'],
                'lastUpdated' => $updatedUtc,
                'timestamp' => $updatedUtc,
                'status' => $isActive ? 'Active' : 'Inactive',
                'logs' => (int)$row['logs_count'],
            ];
        }, $rows);

        respondJson(200, $response);
    }

    // GET /api/sensor/{id}
    if ($method === 'GET' && count($segments) === 2 && $segments[0] === 'sensor') {
        $sensorId = $segments[1];

        $stmt = $pdo->prepare(
            'SELECT id, location, last_temperature, last_humidity, last_updated
             FROM sensors WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $sensorId]);
        $row = $stmt->fetch();

        if (!$row) {
            respondJson(404, ['error' => 'Sensor not found', 'message' => $sensorId . ' does not exist']);
        }

        $updated = (string)$row['last_updated'];
        $updatedUtc = isoTimestamp($updated);
        $isActive = (time() - strtotime($updated)) <= 60;

        respondJson(200, [
            'id' => (string)$row['id'],
            'location' => (string)$row['location'],
            'temperature' => (float)$row['last_temperature'],
            'humidity' => (float)$row['last_humidity'],
            'lastUpdated' => $updatedUtc,
            'timestamp' => $updatedUtc,
            'status' => $isActive ? 'Active' : 'Inactive',
        ]);
    }

    // GET /api/sensor/{id}/history
    if ($method === 'GET' && count($segments) === 3 && $segments[0] === 'sensor' && $segments[2] === 'history') {
        $sensorId = $segments[1];
        $limit = isset($_GET['limit']) && is_numeric($_GET['limit']) ? (int)$_GET['limit'] : 1000;
        $limit = max(1, min(5000, $limit));

        $stmt = $pdo->prepare(
            'SELECT created_at, temperature, humidity
             FROM sensor_readings
             WHERE sensor_id = :sensor_id
             ORDER BY created_at DESC
             LIMIT ' . $limit
        );
        $stmt->execute([':sensor_id' => $sensorId]);
        $rows = $stmt->fetchAll();

        if (count($rows) === 0) {
            respondJson(404, ['error' => 'No data available', 'message' => 'No historical data found for ' . $sensorId]);
        }

        $response = array_map(static function (array $row): array {
            return [
                'timestamp' => isoTimestamp((string)$row['created_at']),
                'temperature' => (float)$row['temperature'],
                'humidity' => (float)$row['humidity'],
            ];
        }, $rows);

        respondJson(200, $response);
    }

    // GET /api/sensor/{id}/stats
    if ($method === 'GET' && count($segments) === 3 && $segments[0] === 'sensor' && $segments[2] === 'stats') {
        $sensorId = $segments[1];

        $latestStmt = $pdo->prepare(
            'SELECT location, last_temperature, last_humidity, last_updated
             FROM sensors
             WHERE id = :id LIMIT 1'
        );
        $latestStmt->execute([':id' => $sensorId]);
        $latest = $latestStmt->fetch();

        if (!$latest) {
            respondJson(404, ['error' => 'Sensor not found', 'message' => $sensorId . ' does not exist']);
        }

        $statsStmt = $pdo->prepare(
            'SELECT
                MIN(temperature) AS temp_min,
                MAX(temperature) AS temp_max,
                AVG(temperature) AS temp_avg,
                MIN(humidity) AS hum_min,
                MAX(humidity) AS hum_max,
                AVG(humidity) AS hum_avg,
                COUNT(*) AS points
             FROM sensor_readings
             WHERE sensor_id = :sensor_id
               AND created_at >= (NOW() - INTERVAL 24 HOUR)'
        );
        $statsStmt->execute([':sensor_id' => $sensorId]);
        $stats = $statsStmt->fetch();

        respondJson(200, [
            'sensorId' => $sensorId,
            'period' => '24h',
            'temperature' => [
                'min' => isset($stats['temp_min']) ? (float)$stats['temp_min'] : (float)$latest['last_temperature'],
                'max' => isset($stats['temp_max']) ? (float)$stats['temp_max'] : (float)$latest['last_temperature'],
                'avg' => isset($stats['temp_avg']) ? (float)$stats['temp_avg'] : (float)$latest['last_temperature'],
                'current' => (float)$latest['last_temperature'],
            ],
            'humidity' => [
                'min' => isset($stats['hum_min']) ? (float)$stats['hum_min'] : (float)$latest['last_humidity'],
                'max' => isset($stats['hum_max']) ? (float)$stats['hum_max'] : (float)$latest['last_humidity'],
                'avg' => isset($stats['hum_avg']) ? (float)$stats['hum_avg'] : (float)$latest['last_humidity'],
                'current' => (float)$latest['last_humidity'],
            ],
            'status' => ((time() - strtotime((string)$latest['last_updated'])) <= 60) ? 'Active' : 'Inactive',
            'dataPoints' => (int)($stats['points'] ?? 0),
        ]);
    }

    respondJson(404, ['error' => 'Endpoint not found']);
} catch (PDOException $e) {
    respondJson(500, ['error' => 'Database error', 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    respondJson(500, ['error' => 'Server error', 'message' => $e->getMessage()]);
}
