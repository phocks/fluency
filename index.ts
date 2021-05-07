require('dotenv').config()
import chalk from 'chalk'
import { getAppAuth } from './lib/getTwitterClient'

console.log(chalk.redBright('Welcome to Twitter v2 API'))

const main = async () => {
  const client = getAppAuth()

  const { data } = await client.get('tweets', { ids: '1228393702244134912' })
  console.log(data)

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

  listenForever(
    () => client.stream('tweets/search/stream'),
    (data) => console.log(data)
  )
}

// Start main process
main()
