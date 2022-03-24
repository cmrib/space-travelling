import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from "prismic-dom";
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router'
import Prismic from '@prismicio/client'

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {

  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={commonStyles.container}>
        <Header />
        <h1>Carregando...</h1>
      </div>
    )
  }

  function readingCalc() {
    const bodyText = RichText.asText(post.data.content[0].body);
    const allText = post.data.content[0].heading + ' ' + bodyText;
    const wordsArray = allText.match(/\S+/g);
    const readingTime = Math.ceil(wordsArray.length / 200);
    return readingTime
  }

  const postHtml = RichText.asHtml(post.data.content[0].body);
  const readingTime = readingCalc();

  return (
    <div className={commonStyles.container}>
      <Header />
      <div className={styles.info}>
        <img src={post.data.banner.url} alt="banner" />
        <h1>{post.data.title}</h1>
        <span><FiCalendar /> {post.first_publication_date}</span>
        <span><FiUser /> {post.data.author}</span>
        <span><FiClock /> {readingTime} min</span>
      </div>

      <article>
        <h3>{post.data.content[0].heading}</h3>
        <div dangerouslySetInnerHTML={{ __html: postHtml }} />
      </article>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 100,
    }
  );
  // TODO

  const firstPostSlug = posts.results[0].uid;

  return {
    paths: [
      { params: { slug: firstPostSlug } },
    ],
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async context => {

  const slug = context.params.slug
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});
  // TODO
  const post = {
    first_publication_date: format(new Date(response.first_publication_date), 'dd MMM yyyy', {
      locale: ptBR
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url
      },
      author: response.data.author,
      content: response.data.content
    }
  }

  return {
    props: { post },
    revalidate: 60 * 30 // 30 minutes
  }
};