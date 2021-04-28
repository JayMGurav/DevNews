import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router'

import { CREATE_LINK_MUTATION } from '@/gqlClient/mutations.graphql';


export default function CreateLink(){
  const router = useRouter()
  const [formState, setFormState] = useState({
    description: '',
    url: ''
  });

  const [createLink] = useMutation(CREATE_LINK_MUTATION,{
    variables: {
      description: formState.description,
      url: formState.url
    },
    onCompleted: (data) => {
      console.log(data)
      router.push('/')
    }
  })


  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState((state) => ({
                ...state,
                description: e.target.value
              }))
            }
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={formState.url}
            onChange={(e) =>
              setFormState((state) => ({
                ...state,
                url: e.target.value
              }))
            }
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
