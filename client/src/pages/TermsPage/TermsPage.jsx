import { Container } from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import terms from '../../content/terms.md?raw'

const TermsPage = () => {
  return (
    <Container
      size='100vw'
      m={{ base: 10, xs: 20, sm: 40 }}
      p={0}
      dir='ltr' // Set text direction to always be left-to-right because markdown content is in English
    >
      <ReactMarkdown>{terms}</ReactMarkdown>
    </Container>
  )
}

export default TermsPage
