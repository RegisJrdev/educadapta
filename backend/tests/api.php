<?php
declare(strict_types=1);

$temporary = sys_get_temp_dir() . '/educadapta-api-' . bin2hex(random_bytes(6));
mkdir($temporary, 0700, true);
$database = $temporary . '/state.sqlite';
$serverLog = $temporary . '/server.log';
$socket = stream_socket_server('tcp://127.0.0.1:0', $errorCode, $errorMessage);
if ($socket === false) {
    throw new RuntimeException($errorMessage, $errorCode);
}
$address = stream_socket_get_name($socket, false);
fclose($socket);
$port = (int) substr(strrchr($address, ':'), 1);
$environment = getenv();
$environment['EDUCADAPTA_DB_PATH'] = $database;
$server = proc_open(
    [PHP_BINARY, '-S', "127.0.0.1:$port", __DIR__ . '/../public/index.php'],
    [0 => ['file', '/dev/null', 'r'], 1 => ['file', $serverLog, 'a'], 2 => ['file', $serverLog, 'a']],
    $pipes,
    dirname(__DIR__),
    $environment,
);

if (!is_resource($server)) {
    throw new RuntimeException('Não foi possível iniciar o servidor PHP de teste.');
}

function request(string $baseUrl, string $method, mixed $payload = null): array
{
    $headers = "Content-Type: application/json\r\n";
    $context = stream_context_create(['http' => [
        'method' => $method,
        'header' => $headers,
        'content' => $payload === null ? '' : json_encode($payload, JSON_THROW_ON_ERROR),
        'ignore_errors' => true,
        'timeout' => 2,
    ]]);
    $response = @file_get_contents($baseUrl . '/api/state', false, $context);
    preg_match('/\s(\d{3})\s/', $http_response_header[0] ?? '', $match);

    return [(int) ($match[1] ?? 0), json_decode($response ?: '')];
}

function check(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

try {
    $baseUrl = "http://127.0.0.1:$port";
    for ($attempt = 0; $attempt < 50; $attempt++) {
        [$status] = request($baseUrl, 'GET');
        if ($status === 200) {
            break;
        }
        usleep(20_000);
    }

    [$status, $empty] = request($baseUrl, 'GET');
    check($status === 200 && $empty->state === null && $empty->revision === 0, 'GET vazio deve retornar revisão zero.');

    $state = (object) array_fill_keys(['users', 'students', 'activities', 'adapted', 'sessions', 'screenings', 'classRooms', 'plans', 'achievements', 'messages'], []);
    foreach (['teacher', 'student', 'psychologist', 'psychopedagogue', 'institution'] as $index => $role) {
        $state->users[] = (object) ['id' => $index + 1, 'name' => ucfirst($role), 'role' => $role];
    }
    $state->users[] = (object) ['id' => 6, 'name' => 'Outra professora', 'role' => 'teacher'];
    $state->students[] = (object) ['id' => 1, 'user' => (object) ['id' => 2, 'name' => 'Lucas'], 'ai_profile' => (object) []];

    $invalid = clone $state;
    $invalid->students = [];
    [$status] = request($baseUrl, 'PUT', (object) ['state' => $invalid, 'revision' => 0]);
    check($status === 422, 'O estado precisa manter os perfis e ao menos um aluno.');

    [$status, $saved] = request($baseUrl, 'PUT', (object) ['state' => $state, 'revision' => 0]);
    check($status === 200 && $saved->revision === 1 && count($saved->state->students) === 1, 'Primeiro PUT deve criar o estado: ' . $status . ' ' . json_encode($saved));

    [$status, $conflict] = request($baseUrl, 'PUT', (object) ['state' => $state, 'revision' => 0]);
    check($status === 409 && $conflict->revision === 1 && count($conflict->state->students) === 1, 'Revisão antiga deve preservar o estado atual.');

    $invalid = clone $state;
    $invalid->messages = [(object) ['id' => 1, 'sender_id' => 900, 'receiver_id' => 2, 'content' => 'Inválida']];
    [$status] = request($baseUrl, 'PUT', (object) ['state' => $invalid, 'revision' => 1]);
    check($status === 422, 'Relacionamentos inválidos devem ser rejeitados.');

    $invalid = clone $state;
    $invalid->screenings = [(object) ['id' => 1, 'student_id' => 1, 'teacher_id' => 2, 'score_geral' => 50, 'risk_level' => 'baixo', 'created_at' => date(DATE_ATOM)]];
    [$status] = request($baseUrl, 'PUT', (object) ['state' => $invalid, 'revision' => 1]);
    check($status === 422, 'Triagens devem apontar para um professor.');

    $invalid = clone $state;
    $invalid->sessions = [(object) ['id' => 1, 'student_id' => 1, 'professional_id' => 1, 'scheduled_at' => date(DATE_ATOM), 'focus' => 'Leitura']];
    [$status] = request($baseUrl, 'PUT', (object) ['state' => $invalid, 'revision' => 1]);
    check($status === 422, 'Sessões devem apontar para um psicólogo.');

    $invalid = clone $state;
    $invalid->screenings = [(object) ['id' => 1, 'student_id' => 1, 'teacher_id' => 1, 'score_geral' => '50', 'risk_level' => 'baixo', 'created_at' => date(DATE_ATOM)]];
    [$status] = request($baseUrl, 'PUT', (object) ['state' => $invalid, 'revision' => 1]);
    check($status === 422, 'Pontuações devem manter o tipo numérico JSON.');

    $invalid->screenings[0]->score_geral = 101;
    [$status] = request($baseUrl, 'PUT', (object) ['state' => $invalid, 'revision' => 1]);
    check($status === 422, 'Pontuações devem ficar entre zero e cem.');

    $resetState = clone $state;
    [$status, $reset] = request($baseUrl, 'PUT', (object) ['state' => $resetState, 'revision' => 1]);
    check($status === 200 && $reset->revision === 2, 'Reset global deve avançar a revisão.');

    fwrite(STDOUT, "API SQLite OK: leitura inicial, gravação, conflito CAS, validação e reset global.\n");
} finally {
    proc_terminate($server);
    proc_close($server);
    foreach (glob($temporary . '/*') as $file) {
        unlink($file);
    }
    rmdir($temporary);
}
