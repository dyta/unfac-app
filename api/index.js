/*eslint-disable */
const app = require('express')();
const line_login = require("line-login")

const login = new line_login({
  channel_id: process.env.LINE_LOGIN_CHANNEL_ID,
  channel_secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
  callback_url: process.env.LINE_LOGIN_CALLBACK_URL,
  scope: "openid profile",
  prompt: "consent",
  bot_prompt: "normal"
});

app.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})


// Specify the path you want to start authorization.
app.use("/authorize", login.auth());

app.use("/authorized", login.callback(
  (req, res, next, token_response) => {
    let callback = {
      uid: token_response.id_token.sub,
      name: token_response.id_token.name,
      picture: token_response.id_token.picture
    }

    req.session.auth = callback
    res.redirect('/?rdr=success');

  },
  (req, res, next, error) => {
    // Failure callback
    res.redirect('/?error=cancel');
  }
));

app.post('/logout', (req, res) => {
  delete req.session.auth
  delete req.session.user
  res.json({
    logout: true
  })
})

export default {
  path: '/user',
  handler: app
}
