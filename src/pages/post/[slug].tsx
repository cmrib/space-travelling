import { GetStaticPaths, GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { RichText } from "prismic-dom";

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

  const postHtml = RichText.asHtml(post.data.content[0].body)

  return (
    <>
      <Header />
      <div>
        <img src={post.data.banner.url} alt="banner" />
        <h1>{post.data.title}</h1>
        <time>{post.first_publication_date}</time>
        <span>{post.data.author}</span>
      </div>

      <article>
        <h1>{post.data.content[0].heading}</h1>
        <div dangerouslySetInnerHTML={{ __html: postHtml }} />
      </article>
    </>
  )
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  // TODO

  return {
    paths: [],
    fallback: 'blocking'
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
    props: { post, response }
  }
};