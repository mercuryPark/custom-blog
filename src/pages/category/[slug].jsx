import { useRouter } from 'next/router'
import { getAllArticles } from '@/lib/getAllArticles'
import Head from 'next/head'
import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { formatDate } from '@/lib/formatDate'
import moment from 'moment'
import 'moment/locale/ko'

function Article({ article }) {
  return (
    <Card as="article">
      <Card.Image className="" src={article?.thumbnail} />
      <div>
        <Card.Title href={`/articles/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow as="time" dateTime={article.date} decorate>
          {moment(article.date).format('ll')}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>글 보기</Card.Cta>
      </div>
    </Card>
  )
}

export default function CategoryPage({ articles }) {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Articles - Spencer Sharp</title>
        <meta
          name="description"
          content="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
        />
      </Head>
      <SimpleLayout
        title="Writing on software design, company building, and the aerospace industry."
        intro="All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order."
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex  flex-col space-y-16">
            {articles.map(
              (article) =>
                router.query.slug == article.category && (
                  <Article key={article.slug} article={article} />
                )
            )}
          </div>
        </div>
      </SimpleLayout>
    </>
  )
}

export async function getStaticPaths() {
  // Fetch all articles to generate paths for dynamic routes
  const articles = await getAllArticles()
  // Generate paths for each article slug
  const paths = articles.map((article) => ({
    params: { slug: article?.category },
  }))

  // Return the paths object containing an array of all possible paths
  return { paths, fallback: false }
}

export async function getStaticProps() {
  return {
    props: {
      articles: (await getAllArticles()).map(({ component, ...meta }) => meta),
    },
  }
}
