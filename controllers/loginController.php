<?php
class loginController extends Controller {

    public function index(){
        $viewData = array();

        if (!empty($_GET['error'])) {
            if ($_GET['error'] == '1') {
                $viewData['msg'] = 'Usuário e/ou senha inválidos';
            }
        }
        $this->loadView('login', $viewData);
    }

    public function signin()
    {
        if (!empty($_POST['username'])) {
            $username = strtolower($_POST['username']);
            $pass = $_POST['pass'];

            $users = new Users();

            if ($users->validateUser($username,$pass)) {                
                exit(header("Location: ".BASE));                
            } else {
                header("Location: ".BASE."login?error=1");
                exit;
            }                
        } else {
            header("Location: ".BASE."login");
            exit;
        }
    }

    public function signup()
    {
        $viewData = array(
            'msg' => ''
        );

        if (!empty($_POST['username'])) {
            $username = strtolower($_POST['username']);
            $pass = $_POST['pass'];
            
            $users = new Users();

            if ($users->validateUsername($username)) {
                
                if (!$users->userExists($username)) {
                    $users->registerUser($username,$pass);
                    header("Location: ".BASE."login");
                } else {
                    $viewData['msg'] = 'Usuário já existe.';
                }            
            } else {
                
                $viewData['msg'] = 'Usuário não é válido (digite apenas letras e números).';
            }
        }

        $this->loadView('signup', $viewData);
    }

    public function logout()
    {
        $users = new Users();
        $users->clearLoginHash();

        header("Location: ".BASE.'login');
    }
}