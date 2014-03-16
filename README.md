# Instagram API

> Javascript API for dealing with Instagram

## Quick Use

### User

| method |                     description                     |
| ------ | --------------------------------------------------- |
| info   | gets the basic user info                            |
| feed   | get the feed of the authenticated                   |
| media  | media of a user (both video and images)             |
| liked  | what the authenticated user liked in terms of media |
| search | searches for a user by name                         |

`api.user.[METHOD]`.


## Testing

Testing is easy. **Just run** `npm test` and, hopefully, everything will go ok.

The testing process is quite interesting as we use [jQuery](http://jquery.com/) in the API application (we intend to use this on the browser without having to worry with compatibility and etc) with a bunch of `$.ajax`. Check at `/tests` what is going on an then you may not need to read the docs (supposing that we did some great tests with an awesome coverage ʘ‿ʘ).

## Authentication Flow

Here it's presented the authentication flow that is described on the website. The purpose of putting this here is just to facilitate.

Há dois tipos de flow de autenticação se tratando de oAuth2. O primeiro, dependente de um servidor, o segundo, independente (qualquer aplicação puramente clientside pode tomar proveito) - implicita.

### Normal

-   Redireciona usuário para url de autorização, onde será feito o pedido de login.

`https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=code`

-   O usuário então é redirecionado para o url apresentado no momento do registro da aplicação anexado um código que identifica o tipo de resposta.

`http://your-redirect-uri?code=CODE`

-   Em caso de erro, o usuário é redirecionado para o url passado anexado códigos de erro.

`http://your-redirect-uri?error=access_denied&error_reason=user_denied&error_description=The+user+denied+your+request`

-   Caso tudo ocorra bem, precisamos então receber o `access_token` para o usuário. Base realizar uma ação de *post* para o endpoint de obtenção de *accessToken* com o código recebido na etapa anterior somado a alguns parâmetros.

```bash
$ curl \-F 'client_id=CLIENT-ID' \
    -F 'client_secret=CLIENT-SECRET' \
    -F 'grant_type=authorization_code' \
    -F 'redirect_uri=YOUR-REDIRECT-URI' \
    -F 'code=CODE' \https://api.instagram.com/oauth/access_token
```

que então retornará algo similar, caso haja sucesso na operação:

```json
{
    "access_token": "fb2e77d.47a0479900504cb3ab4a1f626d174d2d",
    "user": {
        "id": "1574083",
        "username": "snoopdogg",
        "full_name": "Snoop Dogg",
        "profile_picture": "http://distillery.s3.amazonaws.com/profiles/profile_1574083_75sq_1295469061.jpg"
    }
}
```

### Implicit

Há apenas dois passos a serem implementados nesta parte.

-   Direcionamento do usuário para o url de autenticação

`https://instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token`

-   Redirecionamento para aplicação.

`http://your-redirect-uri#access_token=ACCESS-TOKEN`

Note que há o uso de hashbang (`#`) e não query params (`?param=value&...`) como no primeiro caso.


|      tipo     |                       descricao                       |
| ------------- | ----------------------------------------------------- |
| basic         | ler e acessar todos os dados relacionados ao usuario. |
|               | Scopo padrão                                          |
| comments      | Criar ou deleter comentários de acordo com as         |
|               | intencoes do usuario                                  |
| relationships | seguir/deixar de seguir usuários                      |
| likes         | dar like/unlike em itens                              |


## Limitations

Instagram limits the user requests up to 5000/hr per
client_id/access_token overall. Otherwise, f*cking 503.
