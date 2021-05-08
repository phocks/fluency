require('dotenv').config()
import chalk from 'chalk'
import { getAppAuth } from './lib/getTwitterClient'

console.log(chalk.redBright('Welcome to Twitter v2 API'))

let count = 0

const main = async () => {
  const client = getAppAuth()

  const { data } = await client.get('tweets', { ids: '1228393702244134912' })
  console.log(data)

  // const { data2 } = await client.post('tweets/search/stream/rules', {
  //   add: [{ value: 'cat has:images', tag: 'cats with images' }]
  // })
  // console.log(data2)

  async function listenForever(streamFactory, dataConsumer) {
    try {
      for await (const { data } of streamFactory()) {
        dataConsumer(data)
      }
      // The stream has been closed by Twitter. It is usually safe to reconnect.
      console.log('Stream disconnected healthily. Reconnecting.')
      listenForever(streamFactory, dataConsumer)
    } catch (error) {
      // An error occurred so we reconnect to the stream. Note that we should
      // probably have retry logic here to prevent reconnection after a number of
      // closely timed failures (may indicate a problem that is not downstream).
      console.warn('Stream disconnected with error. Retrying.', error)
      listenForever(streamFactory, dataConsumer)
    }
  }

  //api.twitter.com/2/tweets/sample/stream?tweet.fields=created_at&expansions=author_id&user.fields=created_at

  //curl -v https://api.twitter.com/2/tweets/search/stream/rules -H "Authorization: Bearer $BEARER_TOKEN"

  https: listenForever(
    () => client.stream('tweets/search/stream'),
    (data) => {
      console.log(data)
    }
  )
}

// Start main process
main()
