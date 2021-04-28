import NextLink from "next/link";

export default function Header(){
  const Auth_Token = process.env.Auth_Token;
  const authToken = localStorage.getItem(Auth_Token);
  return(
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Hacker News</div>
        <NextLink href="/" className="ml1 no-underline black">
          new
        </NextLink>
        <div className="ml1">|</div>
        <NextLink href="/top" className="ml1 no-underline black">
          top
        </NextLink>
        <div className="ml1">|</div>
        <NextLink
          href="/search"
          className="ml1 no-underline black"
        >
          search
        </NextLink>
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <NextLink
              href="/create"
              className="ml1 no-underline black"
            >
              submit
            </NextLink>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              localStorage.removeItem(Auth_Token);
              history.push(`/`);
            }}
          >
            logout
          </div>
        ) : (
          <NextLink
            href="/login"
            className="ml1 no-underline black"
          >
            login
          </NextLink>
        )}
      </div>
    </div>
  )
}