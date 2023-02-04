import config from '~/lib/config'
import {FetchPostsProps} from '~/lib/types'

/**
 * Global fetcher function for useSWR.
 */
export async function fetcher(url: RequestInfo, init?: RequestInit) {
  const response = await fetch(url, init)

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetches posts from internal Reddit API.
 */
export async function fetchPosts({
  limit,
  lastPost,
  sort,
  subReddit
}: FetchPostsProps) {
  const after = lastPost ? lastPost : ''
  const number = limit ? limit : config.redditApi.limit
  const sortBy = sort ? sort : config.redditApi.sort
  const sub = subReddit ? subReddit : config.redditApi.subReddit

  try {
    // Try and fetch posts.
    const response = await fetch(
      `/api/reddit?sub=${sub}&sort=${sortBy}&limit=${number}&after=${after}`,
      {
        cache: 'default'
      }
    )

    // Bad response? Bail...
    if (response.status != 200) {
      return {
        error: `${response.statusText}`
      }
    }

    // Return posts.
    return await response.json()
  } catch (error) {
    // Issue? Leave a message and bail.
    console.error(error)
    return {
      error: `${error}`
    }
  }
}
