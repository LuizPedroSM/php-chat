<?php

class homeController extends Controller {

    private $user;

    public function __construct() {
        $this->user = new Users();

        if (!$this->user->verifyLogin()) {            
            header("Location: ".BASE."login");
            exit;
        }
    }
    
    public function index(){
        $viewData = array(
            'name' => $this->user->getName(),
            'current_groups' => $this->user->getCurrentGroups()
        );

        $this->loadTemplate('home', $viewData);
    }
}