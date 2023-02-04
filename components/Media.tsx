import {createStyles} from '@mantine/core'
import {useViewportSize} from '@mantine/hooks'
import HlsPlayer from '~/components/HlsPlayer'
import {useRedditContext} from '~/components/RedditProvider'
import {Post} from '~/lib/types'

interface BlurProps {
  blurNSFW: boolean
}

const useStyles = createStyles((theme, {blurNSFW}: BlurProps) => ({
  blurred: {
    filter: 'blur(60px)'
  },

  media: {
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.dark[0]
  },

  richVideo: {
    filter: blurNSFW ? 'blur(60px)' : ''
  }
}))

/**
 * Card component.
 */
export default function Media(props: Post) {
  const {blurNSFW} = useRedditContext()
  const {classes, cx} = useStyles({blurNSFW})
  const {width} = useViewportSize()

  /**
   * Decide whether to lazy load an image or not.
   *
   * @returns string - 'lazy' or 'eager'
   */
  function maybeLazyLoad() {
    // For desktop, eager load the first 6 images.
    if (width > 768) {
      return props.index > 5 ? 'lazy' : 'eager'
    }

    // For mobile, eager load the first image.
    return props.index > 0 ? 'lazy' : 'eager'
  }

  switch (props?.post_hint) {
    case 'image':
      return (
        <img
          alt={props?.title}
          className={classes.media}
          data-hint="image"
          decoding="async"
          height={
            props?.over_18 && blurNSFW
              ? props?.images?.obfuscated?.height
              : props?.images?.cropped?.height
          }
          loading={maybeLazyLoad()}
          src={
            props?.over_18 && blurNSFW
              ? props?.images?.obfuscated?.url
              : props?.images?.cropped?.url
          }
          width={
            props?.over_18 && blurNSFW
              ? props?.images?.obfuscated?.width
              : props?.images?.cropped?.width
          }
        />
      )
    case 'hosted:video':
      return (
        <HlsPlayer
          className={classes.media}
          src={props?.media?.reddit_video?.hls_url}
          controls
          crossOrigin="anonymous"
          dataHint="hosted:video"
          height={props?.media?.reddit_video?.height}
          playsInline
          poster={
            props?.over_18 && blurNSFW
              ? props?.images?.obfuscated?.url
              : props?.images?.cropped?.url
          }
          preload="metadata"
          width={props?.media?.reddit_video?.width}
        >
          <source
            src={props?.media?.reddit_video?.fallback_url}
            type="video/mp4"
          />
        </HlsPlayer>
      )
    case 'rich:video':
      return props?.video_preview ? (
        <video
          className={cx(classes.media, classes.richVideo)}
          controls
          crossOrigin="anonymous"
          data-hint="rich:video"
          height={props?.video_preview?.height}
          muted
          playsInline
          preload="metadata"
          width={props?.video_preview?.width}
        >
          <source src={props?.video_preview?.fallback_url} type="video/mp4" />
        </video>
      ) : (
        <div
          style={{
            height: props?.secure_media_embed?.height,
            width: props?.secure_media_embed?.width
          }}
        >
          <iframe
            allow="fullscreen"
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            src={props?.secure_media_embed?.media_domain_url}
            style={{border: 'none', height: '100%', width: '100%'}}
            title="iframe"
          />
        </div>
      )
    case 'link':
      // Search for .gifv....
      if (props?.url.includes('gifv')) {
        return (
          <HlsPlayer
            className={cx(classes.media, {
              [classes.blurred]: props?.over_18 && blurNSFW
            })}
            controls
            dataHint="link"
            muted
            playsInline
            preload="metadata"
          >
            <source
              src={props?.url.replace('.gifv', '.mp4')}
              type="video/mp4"
            />
          </HlsPlayer>
        )
      } else {
        // No media? Return blank.
        return <></>
      }
    default:
      return <></>
  }
}
