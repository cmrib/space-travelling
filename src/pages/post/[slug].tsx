import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from "prismic-dom";
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'

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

  function readingCalc() {
    const bodyText = RichText.asText(post.data.content[0].body)
    const allText = post.data.content[0].heading + ' ' + bodyText
    return Math.ceil(allText.match(/\S+/g).length / 200)
  }

  const postHtml = RichText.asHtml(post.data.content[0].body)
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

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  // TODO

  return {
    paths: [
      { params: { slug: 'a-complete-guide-to-useeffect' } },
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
    revalidate: 60 * 30 // 0 minutes
  }
};