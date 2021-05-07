import Twitter from 'twitter-v2'

export const getUserAuth = () => {
  const client = new Twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token_key,
    access_token_secret: process.env.access_token_secret
  })

  return client
}

export const getAppAuth = () => {
  const client = new Twitter({
    bearer_token: process.env.bearer_token
  })

  return client
}
