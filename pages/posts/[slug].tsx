// pages/posts/[slug.js]
import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
  NextPage,
} from "next";

export const getStaticPaths: GetStaticPaths = () => {
  // Read the files inside the pages/posts dir
  const files = fs.readdirSync(path.join("posts"));

  // Generate path for each file
  const paths = files.map((file) => {
    return {
      params: {
        slug: file.replace(".mdx", ""),
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ slug: string }>): Promise<
  GetStaticPropsResult<{
    frontMatter: any;
    slug?: any;
    mdxSource: any;
  }>
> => {
  // read each file
  const markdown = fs.readFileSync(
    path.join("posts", params?.slug + ".mdx"),
    "utf-8"
  );

  // Extract front matter
  const { data: frontMatter, content } = matter(markdown);

  const mdxSource = await serialize(content);

  return {
    props: {
      frontMatter,
      slug: params?.slug,
      mdxSource,
    },
  };
};

const Post = ({
  frontMatter,
  slug,
  mdxSource,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div title={frontMatter.title}>
      <div>
        <h1 className="font-semibold my-8 text-3xl text-blue-700">
          {frontMatter.title}
        </h1>
        <MDXRemote {...mdxSource} />
      </div>
    </div>
  );
};

export default Post;
