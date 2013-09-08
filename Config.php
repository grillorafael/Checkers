<?php
/**
 * Created by NullPointer Tecnologia Ltda.
 * User: rafael
 * Date: 9/6/13 1:53 AM
 *
 */

class Config {
   public static function getWebSocketIp(){
      return self::getConfigs()->web_socket->ip;
   }

   public static function getWebSocketPort(){
      return self::getConfigs()->web_socket->port;
   }

   public static function getConfigs() {
      $config = json_decode(file_get_contents("project-config.json"));
      return $config->dev ? $config->development : $config->production;
   }
}