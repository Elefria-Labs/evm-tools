import { getGlobalData } from '../../utils/global-data';
import {
  getNextPostBySlug,
  getPostBySlug,
  getPreviousPostBySlug,
  postFilePaths,
} from '../../utils/mdx-utils';

import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import Link from 'next/link';
import SEO from '@components/SEO';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { Separator } from '@shadcn-components/ui/separator';
import ToolBase from '@components/common/ToolBase';
import { pageMeta } from '@config/constants';
import { Meta } from '@layout/Meta';
import { Main } from '@templates/Main';

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  Head,

  h1: (props: any) => (
    <h1
      className="text-4xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-100"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-3xl font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-100"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-2xl font-medium mt-4 mb-2 text-gray-800 dark:text-gray-100"
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4
      className="text-xl font-medium mt-3 mb-2 text-gray-800 dark:text-gray-100"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="my-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside my-4 pl-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside my-4 pl-4" {...props} />
  ),
  li: (props: any) => (
    <li className="my-2 text-gray-700 dark:text-gray-300" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
      {...props}
    />
  ),
  a: (props: any) => (
    <Link
      className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
      {...props}
    />
  ),
  hr: (props: any) => (
    <Separator
      className="my-8 border-gray-300 dark:border-gray-700"
      {...props}
    />
  ),
  strong: (props: any) => (
    <strong
      className="font-semibold text-gray-900 dark:text-gray-100"
      {...props}
    />
  ),
  em: (props: any) => (
    <em className="italic text-gray-800 dark:text-gray-200" {...props} />
  ),
  pre: (props: any) => (
    <pre
      className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto text-sm"
      {...props}
    />
  ),
  code: (props: any) => (
    <code
      className="bg-gray-200 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono"
      {...props}
    />
  ),
  img: (props: any) => (
    <img className="max-w-full h-auto rounded-lg my-4 mx-auto" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-4">
      <table
        className="min-w-full divide-y divide-gray-300 dark:divide-gray-700"
        {...props}
      />
    </div>
  ),
  th: (props: any) => (
    <th
      className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
      {...props}
    />
  ),
};

export default function PostPage({
  source,
  frontMatter,
  prevPost,
  nextPost,
  globalData,
}: any) {
  return (
    <Main
      meta={
        <Meta
          title={`Burner Wallet | ${pageMeta.appName}`}
          description="Generate random private keys for evm chains"
        />
      }
    >
      <ToolBase
        title=""
        toolComponent={
          <div className="flex flex-col items-center max-w-3xl w-full mx-auto">
            <SEO
              title={`${frontMatter.title} - ${globalData.name}`}
              description={frontMatter.description}
            />
            <div className="flex flex-col items-center max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8">
              <main className="w-full py-8">
                <article className="px-6 md:px-0">
                  <header>
                    <h1 className="text-3xl md:text-5xl dark:text-white text-center mb-12">
                      {frontMatter.title}
                    </h1>
                    {frontMatter.description && (
                      <p className="text-xl mb-4 font-semibold italic">
                        {frontMatter.description}
                      </p>
                    )}
                  </header>
                  <main>
                    <article className="prose dark:prose-dark">
                      <MDXRemote {...source} components={components} />
                    </article>
                  </main>
                  <div className="grid md:grid-cols-2 lg:-mx-24 mt-12">
                    {prevPost && (
                      <Link href={`/posts/${prevPost.slug}`} legacyBehavior>
                        <a className="py-8 px-10 text-center md:text-right first:rounded-t-lg md:first:rounded-tr-none md:first:rounded-l-lg last:rounded-r-lg first last:rounded-b-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 last:border-t md:border-r-0 md:last:border-r md:last:rounded-r-none flex flex-col">
                          <p className="uppercase text-gray-500 mb-4 dark:text-white dark:opacity-60">
                            Previous
                          </p>
                          <h4 className="text-2xl text-gray-700 mb-6 dark:text-white">
                            {prevPost.title}
                          </h4>
                          <ArrowLeftIcon className="transform mx-auto md:mr-0 mt-auto" />
                        </a>
                      </Link>
                    )}
                    {nextPost && (
                      <Link href={`/posts/${nextPost.slug}`} legacyBehavior>
                        <a className="py-8 px-10 text-center md:text-left md:first:rounded-t-lg last:rounded-b-lg first:rounded-l-lg md:last:rounded-bl-none md:last:rounded-r-lg backdrop-blur-lg bg-white dark:bg-black dark:bg-opacity-30 bg-opacity-10 hover:bg-opacity-20 dark:hover:bg-opacity-50 transition border border-gray-800 dark:border-white border-opacity-10 dark:border-opacity-10 border-t-0 first:border-t first:rounded-t-lg md:border-t border-b-0 last:border-b flex flex-col">
                          <p className="uppercase text-gray-500 mb-4 dark:text-white dark:opacity-60">
                            Next
                          </p>
                          <h4 className="text-2xl text-gray-700 mb-6 dark:text-white">
                            {nextPost.title}
                          </h4>
                          <ArrowRightIcon className="mt-auto mx-auto md:ml-0" />
                        </a>
                      </Link>
                    )}
                  </div>
                </article>
                {/* <Footer copyrightText={globalData.footerText} /> */}

                {/* <GradientBackground
          variant="large"
          className="absolute -top-32 opacity-30 dark:opacity-50"
        />
        <GradientBackground
          variant="small"
          className="absolute bottom-0 opacity-20 dark:opacity-10"
        /> */}
              </main>
            </div>
          </div>
        }
      />
    </Main>
  );
}

export const getStaticProps = async ({ params }: any) => {
  const globalData = getGlobalData();
  const { mdxSource, data } = await getPostBySlug(params.slug);
  const prevPost = getPreviousPostBySlug(params.slug);
  const nextPost = getNextPostBySlug(params.slug);

  return {
    props: {
      globalData,
      source: mdxSource,
      frontMatter: data,
      prevPost,
      nextPost,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};
