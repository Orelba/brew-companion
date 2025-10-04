import { Container } from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import privacy from '../../content/privacy.md?raw'

const PrivacyPage = () => {
  return (
    <Container
      size='100vw'
      m={{ base: 10, xs: 20, sm: 40 }}
      p={0}
      dir='ltr' // Set text direction to always be left-to-right because markdown content is in English
    >
      <ReactMarkdown>{privacy}</ReactMarkdown>
    </Container>
  )
}

export default PrivacyPage
