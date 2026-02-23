
        <div class="log">
            <h1> Connexion</h1>
            <hr>
            <br><br>
            <form action="#" method="POST" id="loginform">
                <div class="form-group">
                    <input type="email" id="email" size="30" placeholder="Adresse email" required />
                    <div id="emailError" class="error-message"></div>
                </div>

                <div class="form-group">
                    <input type="password" id="password" name="password" placeholder="Mot de passe" required />
                    <div id="passwordError" class="error-message"></div>
                </div>

                <input type="submit" value="Se connecter" />
                <div id="globalError" class="error-message" style="text-align: center;"></div>
            </form>


        </div>



<style>
    :root {
        --login-bg: #f0f2f5;
        --card-bg: #ffffff;
        --input-bg: #f9f9f9;
        --input-border: #ccc;
        --input-focus: #007bff;
        --btn-bg: #007bff;
        --btn-bg-hover: #0056b3;
        --btn-text: #ffffff;
        --text-color: #333;
        --link-color: #007bff;
        --link-hover: #0056b3;
    }

    .error-message {
        font-size: 13px;
        color: red;
        margin-top: 5px;
        margin-bottom: 10px;
        text-align: left;
    }

    input.error {
        border-color: red;
    }


    body {
        background-color: var(--login-bg);
        font-family: "Segoe UI", sans-serif;
        color: var(--text-color);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0;
    }

    .log {
        background-color: var(--card-bg);
        padding: 40px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        text-align: center;
        box-sizing: border-box;
    }


    .log h1 {
        font-size: 28px;
        margin-bottom: 20px;
        color: darkblue;
    }

    hr {
        width: 100%;
        border: 0;
        height: 1px;
        background-color: #ddd;
        margin: 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin-bottom: 18px;
    }


    input[type="email"],
    input[type="password"] {
        width: 100%;
        padding: 12px 16px;
        margin-bottom: 12px;
        border-radius: 8px;
        border: 1px solid var(--input-border);
        background-color: var(--input-bg);
        font-size: 15px;
        box-sizing: border-box;
    }

    input[type="email"]:focus,
    input[type="password"]:focus {
        outline: none;
        border-color: var(--input-focus);
    }

    input[type="submit"] {
        margin-top: 10px;
        padding: 12px;
        font-size: 16px;
        background-color: var(--btn-bg);
        color: var(--btn-text);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
        width: 100%;
    }

    input[type="submit"]:hover {
        background-color: var(--btn-bg-hover);
    }

    .lost {
        margin-top: 15px;
        font-size: 14px;
    }

    .lost a {
        color: var(--link-color);
        text-decoration: none;
        font-weight: bold;
    }

    .lost a:hover {
        color: var(--link-hover);
        text-decoration: underline;
    }

    @media (max-width: 480px) {
        .log {
            padding: 25px;
            margin: 20px;
        }
    }
</style>

