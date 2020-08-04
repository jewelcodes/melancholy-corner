<?php

$object->up = "false";
$object->playback = json_decode(file_get_contents("status"));

$icestats_path .= "http://localhost:8001/status-json.xsl";
//$icestats_path .= $_SERVER['SERVER_NAME'];
//$icestats_path .= ":8000/status-json.xsl";

$icestats = json_decode(file_get_contents($icestats_path));
$object->icestats = $icestats->icestats;

echo(json_encode($object));

?>

