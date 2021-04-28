import { FEED_QUERY } from '@/gqlClient/queries.graphql';
import { useQuery } from '@apollo/client';

import Link from './Link';

export default function LinkList(){
  const { data } = useQuery(FEED_QUERY);

  return (
    <div>
      {data && (
        <>
          {data.feed.map((link) => (
            <Link key={link.id} link={link} />
          ))}
        </>
      )}
    </div>
  );
};
