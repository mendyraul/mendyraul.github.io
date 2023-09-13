<!DOCTYPE html>
<html lang="en">
    <head>
        <title>My Blog</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=yes" />
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <!-- Topicon-->
        <link rel="icon" type="image/x-icon" href="/mendyraul.github.io/assets/img/IMG7_914.JPG"/>
        <!-- Core theme CSS (includes Bootstrap)-->
        <link rel="stylesheet" href="/mendyraul.github.io//styles/layout.css" type="text/css" />
        <!-- Bootstrap core JS-->
        <script type="text/javascript" src="/mendyraul.github.io/scripts/jquery.min.js"></script>
        <script type="text/javascript" src="/mendyraul.github.io/scripts/jquery.slidepanel.setup.js"></script>
    </head>
    <body id="top">
        <div class="wrapper col1">
            <div class="accordion">
                <div id="socialise">
                <ul>
                    <!-- <li><a href="#"><img src="styles/layout/images/linkedin.gif" alt="" /><span>Linked In</span></a></li>
                    <li><a href="#"><img src="styles/layout/images/skype.gif" alt="" /><span>Skype</span></a></li>
                    <li><a href="#"><img src="styles/layout/images/facebook.gif" alt="" /><span>Facebook</span></a></li>
                    <li><a href="#"><img src="styles/layout/images/rss.gif" alt="" /><span>FeedBurner</span></a></li>
                    <li class="last"><a href="#"><img src="styles/layout/images/twitter.gif" alt="" /><span>Twitter</span></a></li> -->
                </ul>
                <br class="clear" />
                </div>
            </div>
        </div>
        <!-- ################################# NAVIGATION SECTION ########################################### -->
        <div class="wrapper col2">
            <div id="header">
                <p class="toggler"><a id="slideit" href="#socialise">Click Here to Socialize!</a><a id="closeit" style="display:none;" href="#socialise">Close Panel</a></p>
                <div id="logo">
                    <p>Raul Mendy</p>
                </div>
                <div id="topnav">
                <ul>
                <ul>
                    <li><a href="/mendyraul.github.io/index.php">Homepage</a></li>
                    <li><a href="/mendyraul.github.io/pages/projects.html">Projects </a></li>
                    <li class="active"><a href="/mendyraul.github.io/pages/blog.php">Blog </a></li>
                    <li><a href="/mendyraul.github.io/pages/about-me.html">About Me</a></li>
                    <li><a href="pages/style-demo.html">Style Demo</a></li>
                    <li class="last"><a href="pages/full-width.html">Full Width</a></li>
                </ul>
                </div>
                <br class="clear" />
            </div>
        </div>
        <!-- ####################################################################################################### -->
        <main>
            <?php
            $currentDate = date('m-d-Y');
            // Connect to your database and retrieve blog posts here
            // You'll need a database connection and a query to fetch the blog posts
            // Loop through the fetched data to display each blog post
            
            // Example placeholder blog post
            $blogPost = [
                'title' => 'Sample Blog Post Title',
                'content' => 'This is the content of the blog post. ',
                'author' => 'Raul Mendy',
            ];
            
            // Loop through your actual blog posts and display them
            // Replace the following code with a loop through your database results
            ?>

            <article>
                <h2><?php echo $blogPost['title']; ?></h2>
                <p>By <?php echo $blogPost['author']; ?> on <?php echo $currentDate; ?></p>
                <p><?php echo $blogPost['content']; ?></p>
            </article>

            <?php
            // End of the loop
            ?>
            <!-- Comment Section -->
            <section id="comments">
                <h2>Comments</h2>
                <!-- Display existing comments here -->
                <!-- 
                $dbHost = 'your_database_host';
                $dbUser = 'your_database_user';
                $dbPass = 'your_database_password';
                $dbName = 'your_database_name';

                $conn = mysqli_connect($dbHost, $dbUser, $dbPass, $dbName);

                // Check the connection
                if (!$conn) {
                    die("Connection failed: " . mysqli_connect_error());
                }

                // Query to retrieve comments from the database 
                $sql = "SELECT * FROM comments";
                $result = mysqli_query($conn, $sql);

                // Check if there are any comments
                if (mysqli_num_rows($result) > 0) {
                    // Loop through the comments and display them
                    while ($row = mysqli_fetch_assoc($result)) {
                        $commentId = $row['comment_id'];
                        $name = $row['name'];
                        $commentText = $row['comment_text'];
                        $timestamp = $row['timestamp'];

                        // Display each comment as needed 
                        echo "<div class='comment'>";
                        echo "<p><strong>{$name}</strong> - {$timestamp}</p>";
                        echo "<p>{$commentText}</p>";
                        echo "</div>";
                    }
                } else {
                    echo "No comments yet.";
                }

                // Close the database connection
                mysqli_close($conn); -->

                <!-- submit new comments -->
                <form method="post" action="process_comment.php">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                    <label for="comment">Comment:</label>
                    <textarea id="comment" name="comment" rows="4" required></textarea>
                    <input type="hidden" id="currentDate" name="currentDate">
                    <button type="submit">Submit Comment</button>
                </form>
            </section>
        </main>

        <!-- ####################################################################################################### -->
        <div class="wrapper col5">
            <div id="footer">
                <div class="box contactdetails">
                <h2>My Contact Details </h2>
                <ul>
                    <li>Fort Lauderdale, FL</li>
                    <li>Tel: (954)-294-4244</li>
                    <li><a href="mailto:rmendy2019@fau.edu"> Email:</a> rmendy2019@fau.edu</li>
                    <li class="last"><a href="/mendyraul.github.io/assests/Raul Mendy Resume.pdf">Resume</a></li>
                </ul>
                </div>
                </div>
                <br class="clear" />
            </div>
        </div>
        <!-- ####################################################################################################### -->
        <div class="wrapper col6">
            <div id="copyright">
                <p class="fl_left">Copyright &copy; 2014 - All Rights Reserved - <a href="#">Domain Name</a></p>
                <p class="fl_right">Template by <a target="_blank" href="http://www.os-templates.com/" title="Free Website Templates">OS Templates</a></p>
                <br class="clear" />
            </div>
        </div>
    </body>
</html>
