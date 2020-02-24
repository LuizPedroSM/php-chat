 <!DOCTYPE html>
 <html lang="en">

 <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <meta http-equiv="X-UA-Compatible" content="ie=edge">
     <title>Chat</title>
     <link rel="stylesheet" href="<?php echo BASE; ?>assets/css/style.css">
     <script src="<?php echo BASE; ?>assets/js/jquery.min.js"></script>
 </head>

 <body>
     <?php $this->loadViewInTemplate($viewName, $viewData); ?>

     <div class="modal_bg" style="display:none">
         <div class="modal_area">

         </div>
     </div>
     <script>
         let BASE = '<?php echo BASE; ?>';
         let group_list = <?php echo json_encode($viewData['current_groups']); ?>;
     </script>
     <script src="<?php echo BASE; ?>assets/js/chat.js"></script>
     <script src="<?php echo BASE; ?>assets/js/script.js"></script>
 </body>

 </html>