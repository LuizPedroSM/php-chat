<?php
class Core {
    public function run(){

        $url ='/';
        if(isset($_GET['url'])){
            $url.=$_GET['url'];
        }

        $url = $this->checkRoutes($url);
        //print_r($url);
        $params = array();

        if(!empty($url) && $url !='/'){
            $url = explode('/',$url);
            array_shift($url);//remove o 1º registro do array
            $currentController = $url[0].'Controller';
            array_shift($url);

            if ( isset($url[0]) && !empty($url[0]) ) {
                $currentAction = $url[0];
                array_shift($url);
            } else {
                $currentAction = 'index';
            }           

            if(count($url)>0){
                $params = $url;
            }

        }else{
            $currentController = 'homeController';
            $currentAction = 'index';
        }
        if(file_exists('controllers/'.$currentController.'.php') ){
            $c = new $currentController();
        } else {
            $c = new paginaController();
            $currentAction = 'index';
            $pNome = explode("Controller", $currentController);
            $pNome = $pNome[0];
            $params = array($pNome);
        }

        
        call_user_func_array(array($c, $currentAction), $params);
        
    }

    public function checkRoutes($url){
        global $routes;

        foreach ($routes as $pt => $newurl) {
            //identifica os argumentos e substitui por regex
            $pattern = preg_replace('(\{[a-z0-9]{1,}\})','([a-z0-9-]{1,})', $pt);
        
            //faz o match da URL
            if(preg_match('#^('.$pattern.')*$#i', $url, $matches)=== 1){
                array_shift($matches);
                array_shift($matches);
                //pega todos os argumentos para associar
                $itens = array();
                if(preg_match_all('(\{[a-z0-9]{1,}\})',$pt, $m)){
                    $itens = preg_replace('(\{|\})','',$m[0]);
                }
                // Faz a associação
                $arg = array();
                foreach($matches as $key=> $match){
                    $arg[$itens[$key]] = $match;
                }
                //monta a nova url
                foreach ($arg as $argkey => $argvalue) {
                    $newurl =str_replace(':'.$argkey, $argvalue, $newurl);
                }
                $url = $newurl;
                break;
            }
        }

        return $url;
        
    }
}