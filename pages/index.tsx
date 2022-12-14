import type { NextPage } from "next";
import Head from "next/head";
import fs from "fs";
import path from "path";
import Link from "next/link";
import matter from "gray-matter";

export async function getStaticProps() {
  // Read the pages/posts dir
  let files = fs.readdirSync(path.join("posts"));

  // Get only the mdx files
  files = files.filter((file) => file.split(".")[1] === "mdx");

  // Read each file and extract front matter
  const posts = await Promise.all(
    files.map((file) => {
      const mdWithData = fs.readFileSync(path.join("posts", file), "utf-8");

      const { data: frontMatter } = matter(mdWithData);

      return {
        frontMatter,
        slug: file.split(".")[0],
      };
    })
  );

  // Return all the posts frontMatter and slug as props
  return {
    props: {
      posts,
    },
  };
}

const Home: NextPage<{ posts: any[] }> = ({ posts = [] }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container w-[80%] md:w-[60%] mx-auto">
        <h1 className="text-blue-700 text-3xl font-bold my-12">My Blog 📙</h1>
        <div className="posts md:grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <div>{post.frontMatter.title}</div>
              </a>
            </Link>
          ))}
        </div>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
