import classes from '@/components/Results.module.css'
import {AspectRatio, Card, Flex, Skeleton} from '@mantine/core'

export default function LoadingCard() {
  return (
    <Card className={classes.card}>
        <Skeleton animate={false} height="100%" width="100%" />
      <Card.Section p="md">
        <Flex justify="center" align="center">
          <Skeleton animate={false} height={24} width="80%" />
        </Flex>
      </Card.Section>
    </Card>
  )
}
