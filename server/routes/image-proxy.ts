import { Buffer } from 'node:buffer'
import { defineEventHandler, getQuery, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    // Set status code and return an error object for Nuxt to handle
    event.node.res.statusCode = 400
    return { error: 'Image URL is required' }
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    if (!response.ok) {
      event.node.res.statusCode = response.status
      return { error: 'Failed to fetch image' }
    }

    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    setHeader(event, 'Content-Type', contentType)

    // Convert blob to buffer to send it as response
    const buffer = Buffer.from(await blob.arrayBuffer())
    return buffer
  }
  catch (error: any) {
    console.error('Image proxy error:', error)
    event.node.res.statusCode = 500
    return { error: 'Internal Server Error', details: error.message }
  }
})
