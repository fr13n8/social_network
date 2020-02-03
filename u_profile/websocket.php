<?php

session_start();
require_once 'u_messages.php';
require_once './vendor/autoload.php';
use Workerman\Worker;
use Workerman\Lib\Timer;

// Create a Websocket server
$ws_worker = new Worker("websocket://0.0.0.0:2346");

// 4 processes
$ws_worker->count = 4;

$ws_worker->onWorkerStart = function($ws_worker)
{
    echo "Worker starting...\n";
};

// Emitted when new connection come
$ws_worker->onConnect = function($connection)
{
    echo "new connection from ip " . $connection->getRemoteIp() . "\n";
 };

// Emitted when data received
$ws_worker->onMessage = function($connection, $data)
{
    // Send hello $data
    $data = json_decode($data);
    $data = (array) $data;
    if($data["action"] == "show_msgs"){
        // var_dump($data);
        $messages = new MessagesController($data);
        $connection->send($messages->callback);
        return false;
    }
    else if($data["action"] == "get_messages"){
        // 2.5 seconds
        // var_dump($data);
        $time_interval = 0.1; 
        $timer_id = Timer::add($time_interval, 
            function() use($connection, $data)
            {
                // echo "Timer run\n";
                $messages = new MessagesController($data);
                // var_dump($messages->callback);
                $connection->send($messages->callback);
            }
        );
    }
    else if($data["action"] == "snd_msg"){
        // var_dump($data);
        $messages = new MessagesController($data);
        return false;
    }
};

// Emitted when connection closed
$ws_worker->onClose = function($connection)
{
    echo "Connection closed\n";
};

// Run worker
Worker::runAll();
