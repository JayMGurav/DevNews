import Head from 'next/head';
import { IS_LOGGED_IN_QUERY } from '@/gqlClient/queries.graphql';
import { initializeApollo } from '@/hooks/useApollo';


export default function PostNews(){
  return(
    <div>
      <Head>
        <title>Devnews | post news</title>
      </Head>
      <h1>News</h1>
    </div>
  );
}


export async function getServerSideProps(context) {
  const client = initializeApollo()
  if(client){
    const { data } = await client.query({
      query: IS_LOGGED_IN_QUERY,
      context: {
        headers: {
          ...context.req.headers
        },
      },
    });
  
    if(!data?.isLoggedIn){
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      }
    }
  }

  return {
    props: {
     isLoggedIn: true
    },
  };
}