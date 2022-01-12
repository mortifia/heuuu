import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import internal from 'stream'
import Footer from '../components/footer'
import Header from '../components/header'
import styles from '../styles/Home.module.css'

function Home({
  booksConnection,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  //console.log(booksConnection)
  const items = [
    '/a.jpg',
    '/a.png',
    '/b.jpg',
    '/c.jpg',
    '/d.jpg',
    '/e.jpg',
    '/f.jpg',
    '/g.jpg',
    '/h.jpg',
    '/i.jpg',
    '/j.jpg',
    '/k.jpg',
    '/l.jpg',
    '/m.jpg',
    '/o.jpg',
    '/p.jpg',
    '/q.jpg',
    '/r.jpg',
    '/s.jpg',
    '/t.jpg',
  ]
  items.sort(() => Math.random() - 0.5)
  return (
    <>
      <Head>
        <title>Heuuu</title>
        <meta name="description" content="Heuuu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Header />
        <div className={styles.list}>
          {booksConnection.books.map(book => (
            <Card key={book.id} title={book.title} cover={items[book.id - 1]} />
          ))}
        </div>
        <Footer />
      </body>
    </>
  )
}

function Card({ title, cover }: { title: string; cover: string }) {
  console.log(cover)
  return (
    <div className={styles.card2}>
      <Image
        className={styles.image}
        src={cover}
        alt="heuuu"
        layout="fill"
        objectFit="cover"
      ></Image>
      <h1>{title}</h1>
    </div>
  )
}

// test to get data
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

type BooksConnection = {
  _pageInfo?: { page?: number; allPage?: number; scale?: number }
  books: [{ id: number; title: string; author?: string }]
}

export const getStaticProps = async () => {
  ///////
  // const res = await fetch('https://.../posts')
  // const books: Books[] = await res.json()
  //////

  const client = new ApolloClient({
    uri: 'http://127.0.0.1:4000/',
    cache: new InMemoryCache(),
  })

  const { data } = await client.query({
    query: gql`
      query {
        books {
          _pageInfo {
            page
            allPage
            scale
          }
          books {
            id
            title
          }
        }
      }
    `,
  })
  return {
    props: {
      booksConnection: data.books as BooksConnection,
    },
  }
}

export default Home
