import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { FiUser, FiCalendar } from 'react-icons/fi'
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Prismic from '@prismicio/client'
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  return (
    <>
      <div className={commonStyles.container}>

        <img src="./logo.png" alt="logo" className={styles.logo} />

        <div className={styles.postsContainer}>
          {postsPagination.results.map(post =>

            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a className={styles.post} >
                <h3> {post.data.title} </h3>
                <p> {post.data.subtitle}</p>
                <span><FiCalendar /> {post.first_publication_date}</span>
                <span><FiUser />  {post.data.author}</span>
              </a>
            </Link>
          )}

        </div>

        {postsPagination.next_page !== null ? (<button className={styles.loadButton}>Carregar mais posts</button>) : null}

      </div>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(

    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 100,
    }
  );

  // TODO  

  const postsData = postsResponse.results.map(post => {
    const formattedDate = format(new Date(post.first_publication_date), 'dd MMM yyyy', {
      locale: ptBR
    })
    return {
      ...post,
      first_publication_date: formattedDate
    }
  })

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsData
  }

  return {
    props: { postsPagination }
  }
};
