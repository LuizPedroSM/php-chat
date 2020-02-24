 <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>Chat - Login</title>
     <link rel="stylesheet" href="<?php echo BASE; ?>assets/css/login.css">
 </head>
 <body>     
    <div class="container">
        <h4>Login</h4> <hr>

        <?php if(!empty($msg)): ?>
            <div class="warning">
                <?php echo $msg; ?>
            </div>
        <?php endif; ?>

        <form action="<?php echo BASE; ?>login/signin" method="post">  
            Usuário: <br>
            <input type="text" name="username" id="username"> <br> <br>
            Senha: <br>
            <input type="password" name="pass" id="pass"> <br> <br>

            <input type="submit" value="Entrar">

        </form>
        <br>
        <a href="<?php echo BASE; ?>login/signup">Cadastre-se</a>
    </div>
 </body>
 </html>
 