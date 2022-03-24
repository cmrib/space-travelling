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

  const totalWords = post.data.content.reduce((total, contentItem) => {

    total += contentItem.heading.split(' ').length;
    const words = contentItem.body.map(item => item.text.split(' ').length);
    words.map(word => (total += word));
    return total;
  }, 0);
  const readingTime = Math.ceil(totalWords / 200);



  return (
    <div className={commonStyles.container}>
      <Header />
      <div className={styles.info}>
        <img src={post.data.banner.url} alt="banner" />
        <h1>{post.data.title}</h1>
        <span><FiCalendar /> {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
          locale: ptBR
        })}</span>
        <span><FiUser /> {post.data.author}</span>
        <span><FiClock /> {readingTime} min</span>
      </div>

      {post.data.content.map(content => {
        return (
          <article key={content.heading}>
            <h2>{content.heading}</h2>
            <div
              className={styles.postContent}
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(content.body),
              }}
            />
          </article>
        );
      })}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at('document.type', 'posts'),
  ]);

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {

  const slug = context.params.slug
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});
  // TODO
  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      author: response.data.author,
      banner: {
        url: response.data.banner.url,
      },
      content: response.data.content.map(post => {
        return {
          heading: post.heading,
          body: [...post.body],
        };
      }),
    },
  };

  return {
    props: { post },
    revalidate: 60 * 30 // 30 minutes
  }
};