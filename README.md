<ul><h2>Requirement install</h2>
<li>Install nodejs: <strong>> 20x</strong> (20.13.0 currently)</li>
<li>Database: <strong>mongodb</strong></li>
</ul>

<ul><h2>How to start server</h2>
<li>Install npm: <strong>npm install</strong></li>
<li>Run: <strong>npm start</strong></li>
<li>Run web local as: <strong>http://localhost:2009</strong></li>
</ul>

<ul><h2>Tech Stack</h2>
  <li>Nodejs use express</li>
  <li><strong>Cache:</strong> NodeCache & Redis</li>
  <li><strong>Authentication:</strong> encrypt data by using JWT, Crypto AES, RSA</li>
  <li>Keep session sign in by Token, HTTP Cookie.</li>
  <li>Encrypt data before send to APIs</li>
  <li>APIs request authentication by token, If the token provided does not match or is expired, the API will return a 401 Unauthorized error
  <li><strong>Database</strong>: The application's data will be stored in a mongodb database.</li>
</ul>

<ul><h2>API Process</h2>
<li>Implement APIs endpoints</li>
<li>Validate, register new user, when user register new account, password will be encrypt and save into mongodb's database</li>
<li>Get posts data with pagination and filter parameters.</li>
<li>Get comments data by post
<li>Filter and sort for posts as created_at, number of comments... </li>
<li>Insert post/comments to mongodb</li>
<li>Store application data in a mongodb database.</strong></li>
</ul>
