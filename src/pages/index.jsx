import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Button } from '@/components/Button'
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
  console.log(article)
  return (
    <Card as="article">
      <Card.Image className="" src={article?.thumbnail} />
      <div className="grow">
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

export default function Home({ articles }) {
  // pagination
  const post = [...articles]
  const perPage = 4
  const posts = post.slice(0, perPage)
  const totalPage = Math.ceil(articles?.length / perPage)
  const totalPages = Array.from({ length: totalPage }, (_, index) => index + 1)

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
      {/* <Container className="mt-9 ">
        <div className="w-full">
          <h1 className="GmarketSansMedium mb-2 flex justify-between  text-lg font-bold tracking-tight text-zinc-600 dark:text-zinc-300">
            <p className="w-full">{`"The only person you are destined to become is the person you decide to be." `}</p>
          </h1>

          <h1 className="GmarketSansMedium  flex justify-between border-t-2 border-gray-200 pt-2 text-xl font-bold tracking-tight text-zinc-400 dark:text-zinc-600">
            <p className="w-full">{`"당신이 될 운명인 유일한 사람은 당신이 되기로 결심한 사람입니다."`}</p>
          </h1>
        </div>
      </Container> */}
      <Container className="mt-4 md:mt-8">
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
