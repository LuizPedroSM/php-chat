 <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>Chat - Cadastrar</title>
     <link rel="stylesheet" href="<?php echo BASE; ?>assets/css/login.css">
 </head>
 <body>     
    <div class="container">
        <h4>Cadastro</h4> <hr>
        <?php if(!empty($msg)): ?>
            <div class="warning">
                <?php echo $msg; ?>
            </div>
        <?php endif; ?>
        <form method="post">  
            Usuário: <br>
            <input type="text" name="username" id="username"> <br> <br>
            Senha: <br>
            <input type="password" name="pass" id="pass"> <br> <br>

            <input type="submit" value="Cadastrar">
        </form>
    </div>
 </body>
 </html>
 