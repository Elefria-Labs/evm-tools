import React from 'react';
import Link from 'next/link';
import { getPosts } from '../utils/mdx-utils';
import { getGlobalData } from '../utils/global-data';
import ToolBase from '@components/common/ToolBase';
import { pageMeta } from '@config/constants';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';

export default function Blog({ posts, globalData }: any) {
  return (
    // <SEO title={globalData.name} description={globalData.blogTitle} />
    <Main
      meta={
        <Meta
          title={`Learn web3, solidity and zk | ${pageMeta.appName}`}
          description="Learn web3, solidity and zk"
        />
      }
    >
      <ToolBase
        title=""
        toolComponent={
          <ul className="w-full">
            {posts.map((post: any) => (
              <li
                key={post.filePath}
                className="my-4 md:first:rounded-t-lg md:last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-b-0 last:border-b hover:border-b hovered-sibling:border-t-0"
              >
                <Link
                  as={`/posts/${post.filePath.replace(/\.mdx?$/, '')}`}
                  href={`/posts/[slug]`}
                  legacyBehavior
                >
                  <a className="py-6 lg:py-10 px-6 lg:px-16 block focus:outline-none focus:ring-4">
                    {post.data.date && (
                      <p className="uppercase mb-3 font-bold opacity-60">
                        {post.data.date}
                      </p>
                    )}
                    <h2 className="text-2xl md:text-3xl">{post.data.title}</h2>
                    {post.data.description && (
                      <p className="mt-3 text-lg opacity-60">
                        {post.data.description}
                      </p>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        }
      />
    </Main>
  );
}

export function getStaticProps() {
  const posts = getPosts();
  const globalData = getGlobalData();

  return { props: { posts, globalData } };
}
