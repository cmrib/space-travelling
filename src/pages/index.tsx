import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import { FiUser, FiCalendar } from 'react-icons/fi'

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home() {


  return (
    <>

      <div className={styles.container}>

        <img src="./logo.png" alt="logo" />
        <div>
          <h3>Como utilizar Hooks</h3>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <span> <FiCalendar /> 21 Mar 2021</span>
          <span> <FiUser /> Cicero Ribeiro</span>
        </div>

        <br />

        <div>
          <h3>Como utilizar Hooks</h3>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <span> <FiCalendar /> 21 Mar 2021</span>
          <span> <FiUser /> Cicero Ribeiro</span>
        </div>

        <br />

        <div>
          <h3>Como utilizar Hooks</h3>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <span> <FiCalendar /> 21 Mar 2021</span>
          <span> <FiUser /> Cicero Ribeiro</span>
        </div>

        <br />

        <div>
          <h3>Como utilizar Hooks</h3>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <span> <FiCalendar /> 21 Mar 2021</span>
          <span> <FiUser /> Cicero Ribeiro</span>
        </div>

        <button className={styles.loadButton}>
          Carregar mais posts
        </button>

      </div>
    </>
  )

}

export const getStaticProps = async () => {
  // const prismic = getPrismicClient();
  // const postsResponse = await prismic.query(TODO);

  // TODO

  const data = {
    name: 'Cicero',
    age: 27
  }

  return {
    props: { data }
  }
};
