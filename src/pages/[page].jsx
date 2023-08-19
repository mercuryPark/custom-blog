import { useRouter } from 'next/router'

import Head from 'next/head'
import { useState } from 'react'

import { Card } from '@/components/Card'
import { Container } from '@/components/Container'

import { formatDate } from '@/lib/formatDate'
import { generateRssFeed } from '@/lib/generateRssFeed'
import { getAllArticles } from '@/lib/getAllArticles'
import Pagination from '@/components/Pagination'
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/20/solid'
import _ from 'lodash'
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

const PostPage = ({ articles }) => {
  const router = useRouter()
  const currentPage = router.query.page
  const post = [...articles]
  // per_page 를 알아야하고
  // 현재 페이지를 알아야함
  const perPage = 4
  const totalPage = Math.ceil(articles?.length / perPage)
  const totalPages = Array.from({ length: totalPage }, (_, index) => index + 1)

  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const posts = post.slice(startIndex, endIndex)

  return (
    <>
      <Head>
        <title>
          Spencer Sharp - Software designer, founder, and amateur astronaut
        </title>
        <meta
          name="description"
          content="I’m Spencer, a software designer and entrepreneur based in New York City. I’m the founder and CEO of Planetaria, where we develop technologies that empower regular people to explore space on their own terms."
        />
      </Head>

      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none ">
          <div className="flex flex-col gap-16">
            {posts.map((article) => (
              <Article key={article.slug} article={article} />
            ))}
          </div>
          <Pagination
            articles={articles}
            perPage={perPage}
            totalPages={totalPages}
          />
        </div>
      </Container>
    </>
  )
}

export default PostPage

export async function getStaticPaths() {
  // Fetch all articles to generate paths for dynamic routes
  const articles = await getAllArticles()
  const perPage = 4
  const totalPage = Math.ceil(articles?.length / perPage)
  const totalPages = Array.from({ length: totalPage }, (_, index) => index + 1)

  // Generate paths for each article slug
  const paths = totalPages.map((page) => ({
    params: { page: page.toString() },
  }))

  // Return the paths object containing an array of all possible paths
  return { paths, fallback: false }
}

export async function getStaticProps() {
  if (process.env.NODE_ENV === 'production') {
    await generateRssFeed()
  }

  return {
    props: {
      articles: (await getAllArticles())
        .slice(0, 4)
        .map(({ component, ...meta }) => meta),
    },
  }
}
