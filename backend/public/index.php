<?php
declare(strict_types=1);

const MAX_BODY_BYTES = 1_048_576;
const STATE_COLLECTIONS = [
    'users', 'students', 'activities', 'adapted', 'sessions', 'screenings',
    'classRooms', 'plans', 'achievements', 'messages',
];
$transactionOpen = false;

function respond(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function database(): PDO
{
    $path = getenv('EDUCADAPTA_DB_PATH') ?: dirname(__DIR__) . '/storage/demo.sqlite';
    $directory = dirname($path);

    if (!is_dir($directory) && !mkdir($directory, 0770, true) && !is_dir($directory)) {
        throw new RuntimeException('Não foi possível preparar o diretório do SQLite.');
    }

    $pdo = new PDO('sqlite:' . $path, options: [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $pdo->exec('PRAGMA busy_timeout = 5000');
    $pdo->exec('CREATE TABLE IF NOT EXISTS demo_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        payload TEXT NOT NULL,
        revision INTEGER NOT NULL CHECK (revision > 0)
    )');

    return $pdo;
}

function readState(PDO $pdo): array
{
    $row = $pdo->query('SELECT payload, revision FROM demo_state WHERE id = 1')->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        return ['state' => null, 'revision' => 0];
    }

    return ['state' => json_decode($row['payload'], flags: JSON_THROW_ON_ERROR), 'revision' => (int) $row['revision']];
}

function validState(mixed $state): bool
{
    if (!$state instanceof stdClass) {
        return false;
    }

    foreach (STATE_COLLECTIONS as $collection) {
        if (!property_exists($state, $collection) || !is_array($state->{$collection}) || !array_is_list($state->{$collection})) {
            return false;
        }

        $ids = [];
        foreach ($state->{$collection} as $record) {
            if (!$record instanceof stdClass || !is_int($record->id ?? null) || $record->id < 1 || isset($ids[$record->id])) {
                return false;
            }
            $ids[$record->id] = true;
        }
    }

    $usersByRole = [];
    $userIds = [];
    $userRoles = [];
    foreach ($state->users as $user) {
        if (!is_string($user->name ?? null) || !in_array($user->role ?? null, ['teacher', 'student', 'psychologist', 'psychopedagogue', 'institution'], true) || (!in_array($user->role, ['student', 'teacher'], true) && isset($usersByRole[$user->role]))) {
            return false;
        }
        $usersByRole[$user->role] = true;
        $userIds[$user->id] = true;
        $userRoles[$user->id] = $user->role;
    }

    if (array_diff(['teacher', 'student', 'psychologist', 'psychopedagogue', 'institution'], array_keys($usersByRole)) || count($state->students) < 1) {
        return false;
    }

    $studentIds = [];
    foreach ($state->students as $student) {
        if (!is_object($student->user ?? null) || !is_string($student->user->name ?? null) || (!is_object($student->ai_profile ?? null) && ($student->ai_profile ?? null) !== null)) {
            return false;
        }
        $studentIds[$student->id] = true;
    }

    $activityIds = array_fill_keys(array_map(fn ($activity) => $activity->id, $state->activities), true);
    foreach ($state->activities as $activity) {
        if (!is_string($activity->title ?? null) || !is_string($activity->subject ?? null)) {
            return false;
        }
    }
    foreach ($state->adapted as $activity) {
        if (!is_int($activity->student_id ?? null) || !is_int($activity->activity_id ?? null) || !isset($studentIds[$activity->student_id], $activityIds[$activity->activity_id]) || !is_string($activity->adapted_content ?? null)) {
            return false;
        }
    }
    foreach ($state->sessions as $session) {
        if (!is_int($session->student_id ?? null) || !isset($studentIds[$session->student_id]) || !is_int($session->professional_id ?? null) || ($userRoles[$session->professional_id] ?? null) !== 'psychologist' || !is_string($session->scheduled_at ?? null) || !is_string($session->focus ?? null)) {
            return false;
        }
    }
    foreach ($state->screenings as $screening) {
        $score = $screening->score_geral ?? null;
        if (!is_int($screening->student_id ?? null) || !isset($studentIds[$screening->student_id]) || !is_int($screening->teacher_id ?? null) || ($userRoles[$screening->teacher_id] ?? null) !== 'teacher' || (!is_int($score) && !is_float($score)) || (is_float($score) && !is_finite($score)) || $score < 0 || $score > 100 || !is_string($screening->risk_level ?? null) || !is_string($screening->created_at ?? null)) {
            return false;
        }
    }
    foreach ($state->plans as $plan) {
        if (!is_int($plan->student_id ?? null) || !isset($studentIds[$plan->student_id]) || !is_string($plan->title ?? null) || !is_string($plan->goals ?? null)) {
            return false;
        }
    }
    foreach ($state->classRooms as $classRoom) {
        if (!is_string($classRoom->name ?? null)) {
            return false;
        }
    }
    foreach ($state->achievements as $achievement) {
        if (!is_string($achievement->title ?? null)) {
            return false;
        }
    }
    foreach ($state->messages as $message) {
        if (!is_int($message->sender_id ?? null) || !is_int($message->receiver_id ?? null) || !isset($userIds[$message->sender_id], $userIds[$message->receiver_id]) || !is_string($message->content ?? null)) {
            return false;
        }
    }

    return true;
}

try {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

    if ($path !== '/api/state') {
        respond(404, ['message' => 'Rota não encontrada.']);
    }

    $pdo = database();

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        respond(200, readState($pdo));
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        header('Allow: GET, PUT');
        respond(405, ['message' => 'Método não permitido.']);
    }

    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) {
        respond(413, ['message' => 'O estado excede o limite da demonstração.']);
    }

    $body = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);

    if ($body === false || strlen($body) > MAX_BODY_BYTES) {
        respond(413, ['message' => 'O estado excede o limite da demonstração.']);
    }

    try {
        $input = json_decode($body, flags: JSON_THROW_ON_ERROR);
    } catch (JsonException) {
        respond(400, ['message' => 'Envie um JSON válido.']);
    }

    if (!$input instanceof stdClass) {
        respond(422, ['message' => 'Estado ou revisão inválidos.']);
    }

    $state = $input->state ?? null;
    $revision = $input->revision ?? null;

    if (!validState($state) || !is_int($revision) || $revision < 0) {
        respond(422, ['message' => 'Estado ou revisão inválidos.']);
    }

    $payload = json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $pdo->exec('BEGIN IMMEDIATE');
    $transactionOpen = true;
    $current = readState($pdo);

    if ($current['revision'] !== $revision) {
        $pdo->exec('ROLLBACK');
        $transactionOpen = false;
        respond(409, ['message' => 'O estado mudou em outra sessão.', ...$current]);
    }

    $nextRevision = $revision + 1;

    if ($revision === 0) {
        $statement = $pdo->prepare('INSERT INTO demo_state (id, payload, revision) VALUES (1, :payload, :revision)');
    } else {
        $statement = $pdo->prepare('UPDATE demo_state SET payload = :payload, revision = :revision WHERE id = 1 AND revision = :previous_revision');
        $statement->bindValue(':previous_revision', $revision, PDO::PARAM_INT);
    }

    $statement->bindValue(':payload', $payload, PDO::PARAM_STR);
    $statement->bindValue(':revision', $nextRevision, PDO::PARAM_INT);
    $statement->execute();
    $pdo->exec('COMMIT');
    $transactionOpen = false;

    respond(200, ['state' => $state, 'revision' => $nextRevision]);
} catch (Throwable $exception) {
    if (isset($pdo) && $transactionOpen) {
        $pdo->exec('ROLLBACK');
    }

    error_log($exception->getMessage());
    respond(500, ['message' => 'Não foi possível salvar os dados da demonstração.']);
}
